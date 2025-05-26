const bcrypt = require("bcrypt");
const ServiceProvider = require("../models/ServiceProvider");
const Category = require("../models/Category");
const mongoose = require("mongoose");
const { sendVerificationEmail } = require("../utils/sendVerificationEmail")
const crypto = require("crypto")
const axios = require("axios")
const geolib = require("geolib");
const { sendOnBoardingEmailToProvider } = require("../utils/sendOnBoardEmailToProvider");
const { ServiceRequest } = require("../models/LeadGeneration/ServiceRequest");
const path = require('path');
const fs = require('fs');
// Create Service Provider Account
exports.createServiceProviderAccount = async (req, res) => {
    try {
        const { name, email, password, contactInfo, country, city, state, postalCode, selectedCategories, verificationCode } = req.body;

        const existingUser = await ServiceProvider.findOne({ email });

        if (!existingUser) {
            return res.status(400).json({ message: "Email not found!" });
        }

        if (existingUser.verificationCode !== verificationCode) {
            return res.status(400).json({ error: "Invalid verification code" });
        }

        if (existingUser.password) {
            return res.status(400).json({ message: "Account already exists with this email!" });
        }

        let processedCategories = [];

        // Process only categories (no subcategories)
        for (const selectedCategory of selectedCategories) {
            const { category, serviceRadius, postalCode } = selectedCategory;

            // Find category by name or slug
            const categoryDoc = await Category.findOne({
                $or: [
                    { name: category },
                    { slug: category.toLowerCase().replace(/\s+/g, '-') }
                ]
            });

            if (!categoryDoc) {
                return res.status(400).json({ message: `Invalid category: ${category}` });
            }

            processedCategories.push({
                category: categoryDoc.name,
                serviceRadius,
                postalCode
                // No subcategories included
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await ServiceProvider.updateOne(
            { email },
            {
                $set: {
                    name,
                    password: hashedPassword,
                    contactInfo,
                    country,
                    city,
                    state,
                    postalCode,
                    selectedCategories: processedCategories,
                    verificationCode: null,
                    isVerified: true
                },
            }
        );

        const token = existingUser.generateAuthToken();
        await sendOnBoardingEmailToProvider(email, name);

          const isProduction = true;
        res
            .cookie("token", token, {
                httpOnly: true,
                secure: isProduction,
                sameSite: isProduction ? 'None' : 'Lax',
                domain: isProduction ? '.alltasko.com' : undefined,
                path: '/',
                maxAge: 7 * 24 * 60 * 60 * 1000
            })
            .status(200)
            .json({ message: "Service provider registered successfully", token });

    } catch (error) {
        console.error("Error in createServiceProviderAccount:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
exports.getServiceProviderDetails = async (req, res) => {
    try {
        const provider = await ServiceProvider.findById(req.provider._id).select("-password");
        if (!provider) {
            return res.status(404).json({ message: "Professional not found!" })
        }
        return res.status(200).json({ provider, isProfessional: true })
    } catch (error) {
        res.status(500).json({ error: "Error fetching professional details", isProfessional: false });
    }
}
exports.loginServiceProvider = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: "Email and password are required" });

        const serviceProvider = await ServiceProvider.findOne({ email });
        if (!serviceProvider) return res.status(404).json({ error: "User not found" });

        const isMatch = await bcrypt.compare(password, serviceProvider.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

        const token = serviceProvider.generateAuthToken();
        const isProduction = true;
        res.cookie("token", token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'None' : 'Lax',
            domain: isProduction ? '.alltasko.com' : undefined, // Only set domain in production
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        }).status(200).json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ error: "Error logging in", message: error.message });
    }
};

exports.sendVerificationCode = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: "Email is required" });

        const verificationCode = crypto.randomInt(100000, 999999).toString();


        let user = await ServiceProvider.findOne({ email });
        if (user) {
            user.verificationCode = verificationCode;
        } else {
            user = new ServiceProvider({ email, verificationCode });
        }

        await user.save();
        await sendVerificationEmail(email, verificationCode);

        res.status(200).json({ message: "Verification code sent" });
    } catch (error) {
        res.status(500).json({ error: "Error sending verification code", message: error.message });
    }
};

exports.getServiceProviderById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid service provider ID" });
        }


        const serviceProvider = await ServiceProvider.findById(id).lean();
        if (!serviceProvider) {
            return res.status(404).json({ message: "Service provider not found" });
        }


        const populatedCategories = serviceProvider.selectedCategories.map((category) => ({
            category: category.category,
            subcategories: category.subcategories
                .filter((sub) => sub.subcategory) // Remove empty subcategories
                .map((sub) => ({
                    subcategory: sub.subcategory,
                    subSubcategories: sub.subSubcategories.filter(Boolean), // Remove empty sub-subcategories
                })),
        }));

        res.status(200).json({
            ...serviceProvider,
            selectedCategories: populatedCategories,
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

exports.uploadVerificationDocument = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if ID is valid
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid service provider ID" });
        }

        const provider = await ServiceProvider.findById(id)
        if (!provider) {
            return res.status(404).json({ message: "Provider not found" })
        }
        if (provider.verificationDocument) {
            try {
                // Ensure the path is correct (strip leading '/' if needed)
                const docPath = provider.verificationDocument.startsWith('/')
                    ? provider.verificationDocument.substring(1)
                    : provider.verificationDocument;
                const fullPath = path.resolve(__dirname, '..', provider.verificationDocument.replace(/^\//, ''));


                if (fs.existsSync(fullPath)) {
                    fs.unlinkSync(fullPath);
                    console.log(`Deleted old file: ${fullPath}`);
                }
            } catch (fileError) {
                console.error("Failed to delete old file:", fileError);
                // Don't fail the entire request if deletion fails
            }
        }
        // Ensure a file was uploaded
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const filePath = `/uploads/${req.file.filename}`;

        // Update the service provider with the file path
        const updatedProvider = await ServiceProvider.findByIdAndUpdate(
            id,
            { verificationDocument: filePath, status: "pending" },
            { new: true }
        );


        if (!updatedProvider) {
            return res.status(404).json({ message: "Service provider not found" });
        }

        res.status(200).json({
            message: "Verification document uploaded successfully",
            serviceProvider: updatedProvider,
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

exports.getAllServiceProviders = async (req, res) => {
    try {
        const serviceProviders = await ServiceProvider.find().lean();

        if (!serviceProviders.length) {
            return res.status(404).json({ message: "No service providers found" });
        }

        res.status(200).json(serviceProviders);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

exports.getServiceProviderCategoriesById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate if ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid service provider ID" });
        }

        // Fetch service provider and only return selectedCategories
        const serviceProvider = await ServiceProvider.findById(id, "selectedCategories").lean();
        if (!serviceProvider) {
            return res.status(404).json({ message: "Service provider not found" });
        }

        res.status(200).json(serviceProvider.selectedCategories);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

exports.searchServiceProvidersByCity = async (req, res) => {
    try {
        const { city } = req.query;

        if (!city) {
            return res.status(400).json({ message: "City is required for search" });
        }

        // Case-insensitive search for service providers in the given city
        const serviceProviders = await ServiceProvider.find({ city: { $regex: new RegExp(city, "i") } }).lean();

        if (!serviceProviders.length) {
            return res.status(404).json({ message: "No service providers found in this city" });
        }

        res.status(200).json(serviceProviders);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

exports.getServiceProviderByNameOrEmail = async (req, res) => {
    try {
        const { query } = req.query;


        if (!query) {
            return res.status(400).json({ message: "Name or Email is required for search" });
        }

        // Search by name or email (case-insensitive)
        const serviceProvider = await ServiceProvider.findOne({
            $or: [
                { name: { $regex: new RegExp(query, "i") } },  // Search by name
                { email: { $regex: new RegExp(`^${query}$`, "i") } } // Search by email (exact match)
            ]
        }).lean();

        if (!serviceProvider) {
            return res.status(404).json({ message: "Service provider not found" });
        }

        res.status(200).json(serviceProvider);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

exports.addMoreCategories = async (req, res) => {
    try {
        const { id } = req.params;
        const { selectedCategories } = req.body;

        if (!selectedCategories || !Array.isArray(selectedCategories)) {
            return res.status(400).json({ message: "Invalid selectedCategories format" });
        }

        // Fetch existing service provider
        const serviceProvider = await ServiceProvider.findById(id);
        if (!serviceProvider) {
            return res.status(404).json({ message: "Service provider not found" });
        }

        // Get provider's default postal code if available
        const defaultPostalCode = serviceProvider.postalCode || '';
        let existingCategories = serviceProvider.selectedCategories || [];

        // Process each new selected category
        for (const selectedCategory of selectedCategories) {
            // Find category by name or slug
            const categoryDoc = await Category.findOne({
                $or: [
                    { name: selectedCategory.category },
                    { slug: selectedCategory.category.toLowerCase().replace(/\s+/g, '-') }
                ]
            });

            if (!categoryDoc) {
                return res.status(400).json({ message: `Invalid category: ${selectedCategory.category}` });
            }

            // Check if category already exists in provider's list
            const existingCategoryIndex = existingCategories.findIndex(
                cat => cat.category === categoryDoc.name
            );

            if (existingCategoryIndex === -1) {
                // Add new category
                existingCategories.push({
                    category: categoryDoc.name,
                    postalCode: selectedCategory.postalCode || defaultPostalCode,
                    serviceRadius: selectedCategory.serviceRadius || 120 // Default radius
                });
            } else {
                // Update existing category
                existingCategories[existingCategoryIndex] = {
                    ...existingCategories[existingCategoryIndex],
                    postalCode: selectedCategory.postalCode || existingCategories[existingCategoryIndex].postalCode,
                    serviceRadius: selectedCategory.serviceRadius || existingCategories[existingCategoryIndex].serviceRadius
                };
            }
        }

        // Update the service provider
        serviceProvider.selectedCategories = existingCategories;
        await serviceProvider.save();

        res.status(200).json({
            message: "Services updated successfully",
            selectedCategories: serviceProvider.selectedCategories
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteSelectedCategory = async (req, res) => {
    try {
        const { id } = req.params; // Service provider ID
        const { category } = req.body; // Category to be deleted

        if (!category) {
            return res.status(400).json({ message: "Category name is required" });
        }

        // Find the service provider
        const serviceProvider = await ServiceProvider.findById(id);
        if (!serviceProvider) {
            return res.status(404).json({ message: "Service provider not found" });
        }

        // Filter out the category to be deleted
        const updatedCategories = serviceProvider.selectedCategories.filter(
            cat => cat.category !== category
        );

        // Update the service provider document
        serviceProvider.selectedCategories = updatedCategories;
        await serviceProvider.save();

        res.status(200).json({
            message: `Category '${category}' removed successfully`,
            selectedCategories: serviceProvider.selectedCategories,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addReview = async (req, res) => {
    try {
        const { providerId } = req.params;
        const { name, email, rating, description } = req.body;

        // Validate input
        if (!name || !email || !rating || !description) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Rating must be between 1 and 5" });
        }

        const provider = await ServiceProvider.findById(providerId);
        if (!provider) {
            return res.status(404).json({ message: "Service provider not found" });
        }

        // Add the review
        provider.reviews.push({ name, email, rating, description });
        await provider.save();

        res.status(201).json({ message: "Review added successfully", review: provider.reviews });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.getReviews = async (req, res) => {
    try {
        const { providerId } = req.params;
        const provider = await ServiceProvider.findById(providerId);

        if (!provider) {
            return res.status(404).json({ message: "Service provider not found" });
        }

        res.status(200).json({ reviews: provider.reviews });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


exports.updateServiceProviderProfile = async (req, res) => {
    try {
        const serviceProviderId = req.provider._id; // Extract provider ID from token
        const { name, about, contactInfo, postalCode } = req.body;

        // Check if at least one field is provided for update
        if (!name && !about && !contactInfo && !postalCode) {
            return res.status(400).json({ message: "Provide at least one field to update." });
        }

        // Find and update the service provider
        const updatedServiceProvider = await ServiceProvider.findByIdAndUpdate(
            serviceProviderId,
            { $set: { name, about, contactInfo, postalCode } },
            { new: true, runValidators: true }
        );

        if (!updatedServiceProvider) {
            return res.status(404).json({ message: "Service provider not found." });
        }

        res.status(200).json({ message: "Profile updated successfully.", provider: updatedServiceProvider });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.updateProviderStatus = async (req, res) => {
    try {
        const { providerId } = req.params; // ID of the service provider to update
        const { status, reasonOfRejection } = req.body; // Boolean status and optional reason

        // Validate status field
        if (typeof status !== "boolean") {
            return res.status(400).json({ message: "Status must be a boolean (true for approved, false for rejected)." });
        }

        // Determine the new status
        const newStatus = status ? "approved" : "rejected";
        const updateData = { status: newStatus };

        // If rejected, store the reason
        if (!status && reasonOfRejection) {
            updateData.reasonOfRejection = reasonOfRejection;
        }

        // Find and update the service provider
        const updatedProvider = await ServiceProvider.findByIdAndUpdate(
            providerId,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedProvider) {
            return res.status(404).json({ message: "Service provider not found." });
        }

        res.status(200).json({ message: `Service provider ${newStatus} successfully.`, provider: updatedProvider });

    } catch (error) {
        console.error("Update Provider Status Error:", error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

exports.updateProviderHoldStatus = async (req, res) => {
    try {
        const { providerId } = req.params; // Service provider ID
        const { onHold, reasonOfHold } = req.body; // Boolean onHold and reason

        // Validate the onHold field
        if (typeof onHold !== "boolean") {
            return res.status(400).json({ message: "onHold must be a boolean (true for on hold, false for active)." });
        }

        // Prepare the update object
        const updateData = {
            onHold,
            accountStatus: onHold ? "on_hold" : "working",
            resaonOfHold: onHold ? reasonOfHold || "No reason provided" : null, // Store reason if onHold is true
        };

        // Find and update the service provider
        const updatedProvider = await ServiceProvider.findByIdAndUpdate(
            providerId,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedProvider) {
            return res.status(404).json({ message: "Service provider not found." });
        }

        res.status(200).json({
            message: `Service provider is now ${onHold ? "on hold" : "active"}.`,
            provider: updatedProvider
        });

    } catch (error) {
        console.error("Update Provider Hold Status Error:", error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

exports.updateProviderPassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const providerId = req.user._id; // Extract provider ID from token

        // Validate input
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: "Both old and new passwords are required." });
        }

        // Find the provider
        const provider = await ServiceProvider.findById(providerId);
        if (!provider) {
            return res.status(404).json({ message: "Service provider not found." });
        }

        // Check if old password is correct
        const isMatch = await bcrypt.compare(oldPassword, provider.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Old password is incorrect." });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        provider.password = await bcrypt.hash(newPassword, salt);

        // Save the updated password
        await provider.save();

        res.status(200).json({ message: "Password updated successfully." });

    } catch (error) {
        console.error("Update Password Error:", error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


exports.getAvailableProviders = async (req, res) => {
    try {
        const { postalCode, category } = req.query;

        // Validate required parameters
        if (!postalCode || !category) {
            return res.status(400).json({
                success: false,
                message: "Both postal code and category are required"
            });
        }

        // Get client coordinates
        const clientCoords = await getCoordinatesFromPostalCode(postalCode);
        if (!clientCoords) {
            return res.status(400).json({
                success: false,
                message: "Could not determine location from postal code"
            });
        }

        // Find providers offering this service category
        const providers = await ServiceProvider.find({
            "selectedCategories.category": category
        }).select('-password -verificationCode -__v');

        if (!providers.length) {
            return res.status(404).json({
                success: false,
                message: "No providers found for this service category"
            });
        }

        const availableProviders = [];

        for (const provider of providers) {
            const serviceCategory = provider.selectedCategories.find(
                sc => sc.category === category
            );

            if (!serviceCategory) continue;

            // Get provider's service location
            const providerCoords = await getCoordinatesFromPostalCode(
                serviceCategory.postalCode || provider.postalCode
            );

            if (!providerCoords) continue;

            // Calculate distance in miles
            const distanceMiles = geolib.getDistance(
                { latitude: clientCoords.lat, longitude: clientCoords.lng },
                { latitude: providerCoords.lat, longitude: providerCoords.lng }
            ) / 1609.34;

            // Check if within service radius
            if (distanceMiles <= (serviceCategory.serviceRadius || 10)) {
                availableProviders.push({
                    ...provider.toObject(),
                    distance: parseFloat(distanceMiles.toFixed(1)),
                    serviceRadius: serviceCategory.serviceRadius,
                    serviceArea: serviceCategory.postalCode,
                    isSubscriptionHolder: provider.isSubscriptionHolder || false
                });
            }
        }

        if (!availableProviders.length) {
            return res.status(404).json({
                success: false,
                message: "No available providers within your area"
            });
        }

        // Sort with subscription holders first, then by distance
        availableProviders.sort((a, b) => {
            // Both are subscription holders - sort by distance
            if (a.isSubscriptionHolder && b.isSubscriptionHolder) {
                return a.distance - b.distance;
            }
            // Only a is subscription holder
            else if (a.isSubscriptionHolder) {
                return -1;
            }
            // Only b is subscription holder
            else if (b.isSubscriptionHolder) {
                return 1;
            }
            // Neither are subscription holders - sort by distance
            else {
                return a.distance - b.distance;
            }
        });

        return res.status(200).json({
            success: true,
            count: availableProviders.length,
            filteredProviders: availableProviders
        });

    } catch (error) {
        console.error("Provider search error:", error);
        return res.status(500).json({
            success: false,
            message: "Error searching for providers",
            error: error.message
        });
    }
};


exports.forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const provider = await ServiceProvider.findOne({ email });

        if (!provider) {
            return res.status(404).json({ message: "No account found with this email." });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString("hex");
        provider.resetPasswordToken = resetToken;
        provider.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
        await provider.save();

        // Send reset email
        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: provider.email,
            subject: "Password Reset Request",
            text: `Hello ${provider.name},\n\nYou requested a password reset. Click the link below to reset your password:\n\n${resetLink}\n\nIf you did not request this, please ignore this email.\n\nBest,\nAlltasko Team`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "Password reset link sent to your email." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong." });
    }
}
exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        const provider = await ServiceProvider.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }, // Check token expiry
        });

        if (!provider) {
            return res.status(400).json({ message: "Invalid or expired token." });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        provider.password = hashedPassword;
        provider.resetPasswordToken = null;
        provider.resetPasswordExpires = null;
        await provider.save();

        res.status(200).json({ message: "Password has been successfully reset." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong." });
    }
};

async function getCoordinatesFromPostalCode(postalCode) {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY || "AIzaSyDI6buRCYVvdCZ1mUAk4r9s8Z14uzxZxsc";
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${postalCode}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        if (response.data.results.length > 0) {
            return response.data.results[0].geometry.location; // { lat, lng }
        } else {
            throw new Error("Invalid postal code");
        }
    } catch (error) {
        console.error("Error fetching coordinates:", error);
        return null;
    }
}


// leads gene
exports.getProviderSubSubCategories = async (req, res) => {
    try {
        const providerId = req.params.providerId;

        const provider = await ServiceProvider.findById(providerId)
            .select("selectedCategories");

        if (!provider) {
            return res.status(404).json({ error: "Provider not found" });
        }

        const subSubCategories = provider.selectedCategories.flatMap(category =>
            category.subcategories.flatMap(subcategory =>
                subcategory.subSubcategories
            )
        );

        res.status(200).json({ subSubCategories });
    } catch (error) {
        res.status(500).json({ error: "Error fetching subsubcategories", message: error.message });
    }
};


// @desc    Get service provider by name
// @route   GET /api/providers/name
// @access  Public
exports.getProfessionalProfileByName = async (req, res) => {
    try {
        const { name } = req.params;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Name is required in the request body"
            });
        }

        const provider = await ServiceProvider.findOne({ name })
            .select("-password -resetPasswordToken -resetPasswordExpires -verificationCode")
            .lean();

        if (!provider) {
            return res.status(404).json({
                success: false,
                message: "Service provider not found"
            });
        }

        // Optionally, you might want to exclude more sensitive fields
        const providerData = { ...provider };
        delete providerData.__v; // Remove version key if not needed

        return res.status(200).json({
            success: true,
            data: providerData
        });

    } catch (error) {
        console.error("Error fetching provider by name:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};


exports.uploadProfilePicture = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        // Construct the file path to save in database
        const filePath = `/uploads/profilepictures/${req.file.filename}`;

        // If you need to delete the previous profile picture
        if (req.provider.profilePicture) {
            const oldFilePath = path.join(__dirname, '../../', req.provider.profilePicture);
            fs.unlinkSync(oldFilePath);
        }

        // Here you would typically save the filePath to your database
        await ServiceProvider.findByIdAndUpdate(req.provider._id, { profilePicture: filePath });

        return res.status(200).json({
            success: true,
            message: 'Profile picture uploaded successfully',
            data: {
                fileName: req.file.filename,
                filePath: filePath,
                fileType: req.file.mimetype,
                fileSize: req.file.size
            }
        });
    } catch (error) {
        console.error('Error uploading profile picture:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to upload profile picture'
        });
    }
};

// controllers/authController.js
exports.providerLogout = (req, res) => {
    try {
        // Mirror EXACTLY the same cookie settings used in login
        res.clearCookie('token', {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            domain: '.alltasko.com',
            path: '/'
        });


        return res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });



    } catch (error) {
        console.error('Logout error:', error);
        return res.status(500).json({
            success: false,
            message: 'Logout failed'
        });
    }
};