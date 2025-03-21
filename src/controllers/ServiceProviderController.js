const bcrypt = require("bcrypt");
const ServiceProvider = require("../models/ServiceProvider");
const Category = require("../models/Category");
const mongoose = require("mongoose");

// Create Service Provider Account
exports.createServiceProviderAccount = async (req, res) => {
    try {
        const { name, email, password, contactInfo, country, city, postalCode, selectedCategories } = req.body;

        const existingUser = await ServiceProvider.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email is already in use" });
        }

        let processedCategories = [];

        for (const selectedCategory of selectedCategories) {
            const categoryDoc = await Category.findOne({ category: selectedCategory.category });

            if (!categoryDoc) {
                return res.status(400).json({ message: `Invalid category: ${selectedCategory.category}` });
            }

            let processedSubcategories = [];

            for (const selectedSubcategory of selectedCategory.subcategories) {
                const subcategoryDoc = categoryDoc.subcategories.find(
                    (sub) => sub.subcategory === selectedSubcategory.subcategory
                );

                if (!subcategoryDoc) {
                    return res.status(400).json({ message: `Invalid subcategory: ${selectedSubcategory.subcategory}` });
                }

                let processedSubSubcategories = [];

                for (const subSub of selectedSubcategory.subSubcategories) {
                    if (!subcategoryDoc.subSubcategories.includes(subSub)) {
                        return res.status(400).json({ message: `Invalid sub-subcategory: ${subSub}` });
                    }

                    processedSubSubcategories.push(subSub);
                }

                processedSubcategories.push({
                    subcategory: selectedSubcategory.subcategory,
                    subSubcategories: processedSubSubcategories,
                });
            }

            processedCategories.push({
                category: selectedCategory.category,
                subcategories: processedSubcategories,
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newProvider = new ServiceProvider({
            name,
            email,
            password: hashedPassword,
            contactInfo,
            country,
            city,
            postalCode,
            selectedCategories: processedCategories,
        });

        await newProvider.save();
        res.status(201).json({ message: "Service provider registered successfully" });
    } catch (error) {
        console.error("Error in createServiceProviderAccount:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
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

        // Ensure a file was uploaded
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // Update the service provider with the file path
        const updatedProvider = await ServiceProvider.findByIdAndUpdate(
            id,
            { verificationDocument: req.file.path, status: "pending" },
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