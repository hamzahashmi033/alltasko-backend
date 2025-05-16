const ServiceProvider = require("../models/ServiceProvider");
const Payment = require("../models/payments");
const User = require("../models/User");
const ServiceRequest = require("../models/LeadGeneration/ServiceRequest");
const mongoose = require('mongoose');


exports.getTotalCompletedPayments = async (req, res) => {
    try {
        const payments = await Payment.aggregate([
            {
                $match: {
                    paymentStatus: "completed",
                }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$amount" },
                    count: { $sum: 1 }
                }
            }
        ]);

        const result = payments[0] || { totalAmount: 0, count: 0 };

        res.status(200).json({
            success: true,
            data: {
                totalAmount: result.totalAmount / 100, // Convert cents to dollars
                formattedTotal: `$${(result.totalAmount / 100).toFixed(2)}`,
                transactionCount: result.count
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching payments",
            error: error.message
        });
    }
};
exports.getCompletedPaymentsWithDetails = async (req, res) => {
    try {
        const payments = await Payment.find({
            paymentStatus: "completed",
        })
            .populate([
                {
                    path: "serviceProvider",
                    select: "-password -verificationCode -resetPasswordToken" // Exclude sensitive fields
                },
                {
                    path: "serviceRequest",
                    populate: {
                        path: "user",
                        select: "-password -verificationCode" // Exclude sensitive user fields
                    }
                }
            ])
            .sort({ completedAt: -1 });

        // Format the response
        const formattedPayments = payments.map(payment => {
            const paymentObj = payment.toObject();

            return {
                ...paymentObj,
                formattedAmount: `$${(payment.amount / 100).toFixed(2)}`,
                serviceProvider: paymentObj.serviceProvider,
                serviceRequest: {
                    ...paymentObj.serviceRequest,
                    user: paymentObj.serviceRequest?.user,
                    assignedProvider: paymentObj.serviceRequest?.serviceProvider
                }
            };
        });

        res.status(200).json({
            success: true,
            count: formattedPayments.length,
            data: formattedPayments
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching payment details",
            error: error.message
        });
    }
};
exports.getServiceRequestCounts = async (req, res) => {
    try {
        // Get counts in parallel for better performance
        const [totalCount, purchasedCount, notPurchasedCount] = await Promise.all([
            ServiceRequest.countDocuments(),
            ServiceRequest.countDocuments({ isPurchased: true }),
            ServiceRequest.countDocuments({ isPurchased: false })
        ]);

        // Get counts by service type (optional enhancement)


        res.status(200).json({
            success: true,
            total: totalCount,
            purchased: purchasedCount,
            notPurchased: notPurchasedCount,

        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching request counts",
            error: error.message
        });
    }
};
exports.getAllServiceRequests = async (req, res) => {
    try {
        const { isPurchased } = req.query;

        // Build the query object
        const query = {};

        // Handle isPurchased filter
        if (isPurchased !== undefined) {
            query.isPurchased = isPurchased === 'true';
        }

        // Fetch requests with deep population
        const requests = await ServiceRequest.find(query)
            .populate([
                {
                    path: 'customer',
                    select: '-password -verificationCode' // Exclude sensitive fields
                },
                {
                    path: 'purchasedBy',
                    select: 'name email contactInfo profilePicture'
                },
                {
                    path: 'serviceProvider',
                    select: 'name email contactInfo profilePicture'
                }
            ])
            .sort({ createdAt: -1 });

        // Format the response
        const formattedRequests = requests.map(request => {
            const requestObj = request.toObject();

            return {
                ...requestObj,
                kind: request.constructor.modelName, // Include discriminator type
                purchasedPrice: requestObj.purchasedPrice / 100, // Convert to dollars if stored as cents
                formattedPrice: requestObj.purchasedPrice ? `$${(requestObj.purchasedPrice / 100).toFixed(2)}` : null
            };
        });

        res.status(200).json({
            success: true,
            count: formattedRequests.length,
            data: formattedRequests
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching service requests",
            error: error.message
        });
    }
};
exports.deleteServiceRequest = async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Validate ID format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid service request ID format"
            });
        }

        // 2. Find and delete the request
        const deletedRequest = await ServiceRequest.findByIdAndDelete(id);

        // 3. Check if request existed
        if (!deletedRequest) {
            return res.status(404).json({
                success: false,
                message: "Service request not found"
            });
        }

        // 4. Cleanup related resources (optional)
        try {
            // Example: Delete uploaded photos if they exist
            if (deletedRequest.photos && deletedRequest.photos.length > 0) {
                deletedRequest.photos.forEach(photoPath => {
                    const fullPath = path.join(__dirname, '..', photoPath);
                    if (fs.existsSync(fullPath)) {
                        fs.unlinkSync(fullPath);
                    }
                });
            }
        } catch (cleanupError) {
            console.error("Cleanup error:", cleanupError);
            // Continue even if cleanup fails
        }

        // 5. Success response
        res.status(200).json({
            success: true,
            message: "Service request deleted successfully",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete service request",
            error: error.message
        });
    }
};
exports.getAllUsers = async (req, res) => {
    try {
        // Pagination parameters (default: page=1, limit=20)
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        // Sorting (default: newest first)
        const sort = req.query.sort || '-createdAt';

        // Search filter (optional)
        const search = req.query.search;
        const query = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        // Get users with pagination
        const users = await User.find(query)
            .select('-password -verificationCode -resetPasswordToken -__v')
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .lean();

        // Get total count (for pagination info)
        const totalUsers = await User.countDocuments(query);

        // Calculate total pages
        const totalPages = Math.ceil(totalUsers / limit);

        // Response structure
        res.status(200).json({
            success: true,
            data: {
                users,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalUsers,
                    usersPerPage: limit,
                    hasNextPage: page < totalPages,
                    hasPreviousPage: page > 1
                }
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch users",
            error: error.message,
            code: "USER_FETCH_ERROR"
        });
    }
};
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findByIdAndDelete(id)
        if (!user) {
            return res.status(404).json({ message: "User not found!" })
        }
        res.status(200).json({ success: true, message: "User deleted Successfully." })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to Delete User.",
            error: error.message
        });
    }
}
exports.getAllProfessionals = async (req, res) => {
    try {
        // Pagination parameters (default: page=1, limit=20)
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        // Sorting (default: newest first)
        const sort = req.query.sort || '-createdAt';

        // Search filter (optional)
        const search = req.query.search;
        const query = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        // Get users with pagination
        const providers = await ServiceProvider.find(query)
            .select('-password -verificationCode -resetPasswordToken -__v')
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .lean();

        // Get total count (for pagination info)
        const totalProviders = await ServiceProvider.countDocuments(query);

        // Calculate total pages
        const totalPages = Math.ceil(totalProviders / limit);

        // Response structure
        res.status(200).json({
            success: true,
            data: {
                providers,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalProviders,
                    providerPerPage: limit,
                    hasNextPage: page < totalPages,
                    hasPreviousPage: page > 1
                }
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch users",
            error: error.message
        });
    }
};
exports.deleteProfessional = async (req, res) => {
    try {
        const { id } = req.params
        const professional = await ServiceProvider.findByIdAndDelete(id)
        if (!professional) {
            return res.status(404).json({ message: "Professional not found!" })
        }
        res.status(200).json({ success: true, message: "Professional deleted Successfully." })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to Delete User.",
            error: error.message
        });
    }
}
exports.updateVerificationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, reasonOfRejection } = req.body;

        // Validate input
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid provider ID",
            });
        }

        if (!["pending", "approved", "rejected"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status value",
            });
        }

        if (status === "rejected" && !reasonOfRejection) {
            return res.status(400).json({
                success: false,
                message: "Reason is required when rejecting",
            });
        }

        // Prepare update object
        const update = { status };
        if (status === "rejected") {
            update.reasonOfRejection = reasonOfRejection;
        } else {
            update.reasonOfRejection = null; // Clear rejection reason if not rejected
        }

        // Update provider
        const provider = await ServiceProvider.findByIdAndUpdate(
            id,
            update,
            { new: true, runValidators: true }
        ).select('-password -verificationCode -resetPasswordToken');

        if (!provider) {
            return res.status(404).json({
                success: false,
                message: "Service provider not found",
            });
        }

        // Generate new token if verification status changed
        const newToken = provider.generateAuthToken();

        res.status(200).json({
            success: true,
            message: `Verification status updated to ${status}`,
            data: {
                provider,
                token: newToken
            }
        });

    } catch (error) {
        console.error('Error updating verification status:', error);
        res.status(500).json({
            success: false,
            message: "Failed to update verification status",
            error: error.message,
            code: "STATUS_UPDATE_ERROR"
        });
    }
};
exports.updateAccountStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { accountStatus, reasonOfHold, onHold } = req.body;

        // Validate input
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid provider ID",
                code: "INVALID_PROVIDER_ID"
            });
        }

        if (!["working", "on_hold"].includes(accountStatus)) {
            return res.status(400).json({
                success: false,
                message: "Invalid account status value",
            });
        }

        if (accountStatus === "on_hold" && !reasonOfHold) {
            return res.status(400).json({
                success: false,
                message: "Reason is required when putting account on hold",
            });
        }

        // Prepare update object
        const update = { 
            accountStatus,
            onHold: accountStatus === "on_hold" // Auto-set onHold based on status
        };

        if (accountStatus === "on_hold") {
            update.reasonOfHold = reasonOfHold;
        } else {
            update.reasonOfHold = null; // Clear hold reason if not on hold
            update.onHold = false; // Ensure onHold is false when status is working
        }

        // Update provider
        const provider = await ServiceProvider.findByIdAndUpdate(
            id,
            update,
            { new: true, runValidators: true }
        ).select('-password -verificationCode -resetPasswordToken');

        if (!provider) {
            return res.status(404).json({
                success: false,
                message: "Service provider not found",
            });
        }

        res.status(200).json({
            success: true,
            message: `Account status updated to ${accountStatus}`,
            data: {
                provider
            }
        });

    } catch (error) {
        console.error('Error updating account status:', error);
        res.status(500).json({
            success: false,
            message: "Failed to update account status",
            error: error.message,
        });
    }
};