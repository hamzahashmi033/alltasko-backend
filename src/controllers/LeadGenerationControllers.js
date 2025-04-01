const FormConfiguration = require("../models/LeadGeneration/LeadFormConfiguration");
const fs = require('fs');
const path = require('path');
const ServiceProvider = require('../models/ServiceProvider');
const { ServiceRequest, HandymanRequest, MovingRequest } = require("../models/LeadGeneration/ServiceRequest");
const serviceUpload = require("../middlewares/serviceUpload")
const multer = require('multer')
const getServiceModel = (serviceType) => {
    switch (serviceType) {
        case 'HandymanRequest': return HandymanRequest;
        case 'MovingRequest': return MovingRequest;
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


