const FormConfiguration = require("../models/LeadGeneration/LeadFormConfiguration");
const fs = require('fs');
const path = require('path');
const ServiceProvider = require('../models/ServiceProvider');
const { ServiceRequest, HandymanRequest, MovingRequest, CustomRequest, CleaningRequest, YardworkRequest, PlumbingRequest } = require("../models/LeadGeneration/ServiceRequest");
const serviceUpload = require("../middlewares/serviceUpload")
const multer = require('multer')
const haversine = require('haversine-distance');
const { default: axios } = require("axios");

const getServiceModel = (serviceType) => {
    switch (serviceType) {
        case 'Handyman Services': return HandymanRequest;
        case 'Moving Services': return MovingRequest;
        case 'CustomRequest': return CustomRequest;
        case 'Cleaning Services': return CleaningRequest;
        case 'Yardwork & Outdoor Services': return YardworkRequest;
        case 'Plumbing': return PlumbingRequest;
        default: return ServiceRequest;
    }
};

exports.getFormConfig = async (req, res) => {
    try {
        const config = await FormConfiguration.findOne({ serviceType: req.params.serviceType });
        if (!config) {
            return res.status(404).json({ success: false, message: 'Form configuration not found' });
        }
        res.json({ success: true, data: config });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.createRequest = async (req, res) => {
    try {
        const { serviceType, ...requestData } = req.body;

        // Handle file uploads - updated to match serviceUpload's structure

        let photoUrls = [];
        if (req.files) {
            photoUrls = req.files.map(file => `/uploads/services/${file.filename}`);
        }
        const ServiceModel = getServiceModel(serviceType);
        const newRequest = new ServiceModel({
            ...requestData,
            serviceType,
            photos: photoUrls,
            status: 'pending'
        });

        await newRequest.save();

        res.status(201).json({
            success: true,
            data: newRequest,
            message: 'Service request created successfully'
        });
    } catch (err) {
        // Enhanced error handling
        if (req.files) {
            req.files.forEach(file => {
                try {
                    fs.unlinkSync(file.path);
                } catch (cleanupErr) {
                    console.error('Failed to cleanup file:', cleanupErr);
                }
            });
        }

        const statusCode = err instanceof multer.MulterError ? 413 : 400;
        res.status(statusCode).json({
            success: false,
            message: err.message,
            errorType: err.name
        });
    }
};
exports.picRequest = async (req, res) => {
    try {
        const { serviceType, ...requestData } = req.body;

        // Handle file uploads - updated to match serviceUpload's structure

        let photoUrls = [];
        if (req.files) {
            photoUrls = req.files.map(file => `/uploads/services/${file.filename}`);
        }
        console.log(req.files);
        console.log(photoUrls, "dshdishdi");
        return res.status(200).json({ messgae: "dgusuds" })

    } catch (err) {
        // Enhanced error handling
        console.log(err);

    }
};

exports.getRequest = async (req, res) => {
    try {
        const request = await ServiceRequest.findById(req.params.id)
            .populate('serviceProvider', 'name email contactInfo');

        if (!request) {
            return res.status(404).json({ success: false, message: 'Request not found' });
        }

        res.json({ success: true, data: request });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};


exports.assignProvider = async (req, res) => {
    try {
        const { requestId, providerId } = req.params;

        // Verify provider exists
        const provider = await ServiceProvider.findById(providerId);
        if (!provider) {
            return res.status(404).json({ success: false, message: 'Service provider not found' });
        }

        const updatedRequest = await ServiceRequest.findByIdAndUpdate(
            requestId,
            {
                serviceProvider: providerId,
                status: 'assigned'
            },
            { new: true }
        ).populate('serviceProvider', 'name email contactInfo');

        if (!updatedRequest) {
            return res.status(404).json({ success: false, message: 'Request not found' });
        }

        res.json({
            success: true,
            data: updatedRequest,
            message: 'Provider assigned successfully'
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.deleteRequest = async (req, res) => {
    try {
        const request = await ServiceRequest.findByIdAndDelete(req.params.id);

        if (!request) {
            return res.status(404).json({ success: false, message: 'Request not found' });
        }

        // Clean up associated photos
        if (request.photos && request.photos.length > 0) {
            request.photos.forEach(photoUrl => {
                const filename = photoUrl.split('/').pop();
                const filePath = path.join(__dirname, '../uploads/services', filename);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            });
        }

        res.json({
            success: true,
            message: 'Request deleted successfully'
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};


exports.getUserRequests = async (req, res) => {
    try {

        const userId = req.user._id;
        const requests = await ServiceRequest.find({ customer: userId })
            .populate('serviceProvider', 'name')
            .populate('customer', 'name email')
            .sort({ createdAt: -1 });
        if (!requests || requests.length === 0) {
            return res.status(404).json({ message: 'No service requests found for this user.' });
        }
        res.status(200).json(requests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving user service requests.' });
    }
};

// professional panel 
async function getCoordinatesFromPostalCode(postalCode) {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY || "YOUR_API_KEY";
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${postalCode}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        if (response.data.results.length > 0) {
            return response.data.results[0].geometry.location; // { lat, lng }
        }
        return null;
    } catch (error) {
        console.error("Error fetching coordinates:", error);
        return null;
    }
}




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
exports.getLeadCountsBySubSubCategory = async (req, res) => {
    try {
        const providerId = req.params.providerId;

        // Get provider with selected categories
        const provider = await ServiceProvider.findById(providerId)
            .select("selectedCategories");

        if (!provider) {
            return res.status(404).json({ error: "Provider not found" });
        }

        // Get all pending service requests
        const serviceRequests = await ServiceRequest.find({ status: "pending" })
            .select("serviceTypeSubSubCategory customerDetails.zipCode");

        // Get all unique postal codes involved
        const providerPostalCodes = provider.selectedCategories.map(cat => cat.postalCode);
        const customerZipCodes = serviceRequests.map(req => req.customerDetails.zipCode);
        const allPostalCodes = [...new Set([...providerPostalCodes, ...customerZipCodes])];

        // Get coordinates for all postal codes
        const postalCodeCoordinates = {};
        for (const code of allPostalCodes) {
            const coords = await getCoordinatesFromPostalCode(code);
            if (coords) postalCodeCoordinates[code] = coords;
        }

        // Process each subsubcategory with distance check
        const subSubCategoryCounts = {};

        provider.selectedCategories.forEach(category => {
            const providerCoords = postalCodeCoordinates[category.postalCode];
            if (!providerCoords) return;

            category.subcategories.forEach(subcategory => {
                subcategory.subSubcategories.forEach(subSubCat => {
                    if (!subSubCategoryCounts[subSubCat]) {
                        subSubCategoryCounts[subSubCat] = 0;
                    }

                    // Count matching service requests within radius
                    serviceRequests.forEach(request => {
                        if (request.serviceTypeSubSubCategory === subSubCat) {
                            const customerCoords = postalCodeCoordinates[request.customerDetails.zipCode];
                            if (!customerCoords) return;

                            const distance = haversine(
                                { latitude: providerCoords.lat, longitude: providerCoords.lng },
                                { latitude: customerCoords.lat, longitude: customerCoords.lng }
                            ) / 1000; // Convert to kilometers

                            if (distance <= category.serviceRadius) {
                                subSubCategoryCounts[subSubCat]++;
                            }
                        }
                    });
                });
            });
        });

        // Format the response
        const leadsCount = Object.keys(subSubCategoryCounts).map(subSubCat => ({
            subSubCategory: subSubCat,
            count: subSubCategoryCounts[subSubCat]
        }));

        res.status(200).json({ leadsCount });
    } catch (error) {
        console.error("Error in getLeadCountsBySubSubCategory:", error);
        res.status(500).json({
            error: "Error fetching lead counts",
            message: error.message
        });
    }
};
// 3. Get all leads matching provider's services
exports.getAllMatchingLeads = async (req, res) => {
    try {
        const providerId = req.params.providerId;

        // Get provider with selected categories
        const provider = await ServiceProvider.findById(providerId)
            .select("selectedCategories");

        if (!provider) {
            return res.status(404).json({ error: "Provider not found" });
        }

        // Get all pending service requests that haven't been purchased
        const allServiceRequests = await ServiceRequest.find({
            status: "pending",
            isPurchased: false // Add this condition to exclude purchased leads
        }).select("serviceType customerDetails.zipCode");

        // Get all unique postal codes involved
        const providerPostalCodes = provider.selectedCategories.map(cat => cat.postalCode);
        const customerZipCodes = allServiceRequests.map(req => req.customerDetails.zipCode);
        const allPostalCodes = [...new Set([...providerPostalCodes, ...customerZipCodes])];

        // Get coordinates for all postal codes
        const postalCodeCoordinates = {};
        for (const code of allPostalCodes) {
            const coords = await getCoordinatesFromPostalCode(code);
            if (coords) postalCodeCoordinates[code] = coords;
        }

        // Filter service requests that match both subsubcategory and distance
        const matchingRequestIds = [];

        provider.selectedCategories.forEach(category => {
            const providerCoords = postalCodeCoordinates[category.postalCode];
            if (!providerCoords) return;

            allServiceRequests.forEach(request => {
                if (request.serviceType === category.category) {
                    const customerCoords = postalCodeCoordinates[request.customerDetails.zipCode];
                    if (!customerCoords) return;

                    // Calculate distance in miles (1 km = 0.621371 miles)
                    const distanceInMiles = haversine(
                        { latitude: providerCoords.lat, longitude: providerCoords.lng },
                        { latitude: customerCoords.lat, longitude: customerCoords.lng }
                    ) * 0.621371; // Convert to miles

                    if (distanceInMiles <= category.serviceRadius) {
                        matchingRequestIds.push(request._id);
                    }
                }
            });
        });

        // Remove duplicate IDs
        const uniqueMatchingIds = [...new Set(matchingRequestIds)];

        // Get full details for the matching requests (without customer details)
        const leads = await ServiceRequest.find({
            _id: { $in: uniqueMatchingIds },
            isPurchased: false // Add this condition again for the final query
        })
            .sort({ createdAt: -1 });

        res.status(200).json({
            leads,
            count: leads.length
        });
    } catch (error) {
        console.error("Error in getAllMatchingLeads:", error);
        res.status(500).json({
            error: "Error fetching leads",
            message: error.message
        });
    }
};