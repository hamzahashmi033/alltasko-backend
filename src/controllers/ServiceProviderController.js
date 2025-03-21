const bcrypt = require("bcrypt");
const ServiceProvider = require("../models/ServiceProvider");
const Category = require("../models/Category");
const mongoose = require("mongoose");
const { sendVerificationEmail } = require("../utils/sendVerificationEmail")
const crypto = require("crypto")
// Create Service Provider Account
exports.createServiceProviderAccount = async (req, res) => {
    try {
        const { name, email, password, contactInfo, country, city, postalCode, selectedCategories, verificationCode } = req.body;

        // Find the existing user (already saved when sending the verification code)
        const existingUser = await ServiceProvider.findOne({ email });

        if (!existingUser) {
            return res.status(400).json({ message: "Email not found!" });
        }

        // Check if verification code is valid
        if (existingUser.verificationCode !== verificationCode) {
            return res.status(400).json({ error: "Invalid verification code" });
        }

        // Ensure that an account is not already created
        if (existingUser.password) {
            return res.status(400).json({ message: "Account already exists with this email!" });
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

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update the existing user instead of inserting a new one
        await ServiceProvider.updateOne(
            { email },
            {
                $set: {
                    name,
                    password: hashedPassword,
                    contactInfo,
                    country,
                    city,
                    postalCode,
                    selectedCategories: processedCategories,
                    verificationCode: null,
                    isVerified: true
                },
            }
        );
        const token = existingUser.generateAuthToken()
        res
            .cookie("token", token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 })
            .status(200)
            .json({  message: "Service provider registered successfully" , token });
    } catch (error) {
        console.error("Error in createServiceProviderAccount:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

exports.loginServiceProvider = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password are required" });

    const serviceProvider = await ServiceProvider.findOne({ email });
    if (!serviceProvider) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, serviceProvider.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = serviceProvider.generateAuthToken();
    res.cookie("token", token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

    res.status(200).json({ message: "Login successful", token });
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

        // Fetch all valid categories from the database
        const allCategories = await Category.find().lean();

        // Fetch existing service provider's selected categories
        const serviceProvider = await ServiceProvider.findById(id);
        if (!serviceProvider) {
            return res.status(404).json({ message: "Service provider not found" });
        }

        let existingCategories = serviceProvider.selectedCategories || [];

        // Helper function to find a category in the existing list
        const findCategory = (categoryName) => existingCategories.find(cat => cat.category === categoryName);

        // Process each new selected category
        selectedCategories.forEach(selectedCategory => {
            const categoryExists = allCategories.find(cat => cat.category === selectedCategory.category);
            if (!categoryExists) {
                throw new Error(`Invalid category: ${selectedCategory.category}`);
            }

            let existingCategory = findCategory(selectedCategory.category);
            if (!existingCategory) {
                // If category does not exist, add it completely
                existingCategories.push({
                    category: selectedCategory.category,
                    subcategories: selectedCategory.subcategories || []
                });
            } else {
                // Merge subcategories
                selectedCategory.subcategories.forEach(selectedSub => {
                    const subcategoryExists = categoryExists.subcategories.find(sub => sub.subcategory === selectedSub.subcategory);
                    if (!subcategoryExists) {
                        throw new Error(`Invalid subcategory: ${selectedSub.subcategory} in category ${selectedCategory.category}`);
                    }

                    let existingSubcategory = existingCategory.subcategories.find(sub => sub.subcategory === selectedSub.subcategory);
                    if (!existingSubcategory) {
                        // If subcategory does not exist, add it
                        existingCategory.subcategories.push({
                            subcategory: selectedSub.subcategory,
                            subSubcategories: selectedSub.subSubcategories || []
                        });
                    } else {
                        // Merge sub-subcategories
                        selectedSub.subSubcategories.forEach(subSub => {
                            if (subcategoryExists.subSubcategories.includes(subSub) && !existingSubcategory.subSubcategories.includes(subSub)) {
                                existingSubcategory.subSubcategories.push(subSub);
                            }
                        });
                    }
                });
            }
        });

        // Update the service provider with merged categories
        serviceProvider.selectedCategories = existingCategories;
        await serviceProvider.save();

        res.status(200).json({
            message: "Selected services updated successfully",
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
            (cat) => cat.category !== category
        );

        // Update the service provider document
        serviceProvider.selectedCategories = updatedCategories;
        await serviceProvider.save();

        res.status(200).json({
            message: `Category '${category}' and its subcategories removed successfully`,
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