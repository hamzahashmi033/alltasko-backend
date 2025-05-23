const Category = require("../models/Category")

exports.checkCategory = async (req, res) => {
    try {
        const { category, subcategories } = req.body;

        const categoryExists = await Category.findOne({ category });

        if (!categoryExists) {
            return res.status(400).json({ message: `Invalid category: ${category}` });
        }

        // Check if subcategories exist within the category
        for (const subcategory of subcategories) {
            if (!subcategory.subcategory) {
                return res.status(400).json({ message: "Missing subcategory field in request." });
            }

            const validSubcategory = categoryExists.subcategories.find(
                (sub) => sub.subcategory === subcategory.subcategory
            );

            if (!validSubcategory) {
                return res.status(400).json({ message: `Invalid subcategory: ${subcategory.subcategory}` });
            }

            // Check sub-subcategories
            for (const subSub of subcategory.subSubcategories) {
                if (!validSubcategory.subSubcategories.includes(subSub)) {
                    return res.status(400).json({ message: `Invalid sub-subcategory: ${subSub}` });
                }
            }
        }

        res.status(200).json({ message: "Valid category and subcategories" });

    } catch (error) {
        res.status(500).json({ error: "Error checking category", message: error.message });
    }
};


exports.searchSubSubcategories = async (req, res) => {
    try {
        const query = req.query.q; // Get search query from request

        if (!query) {
            return res.status(400).json({ error: "Search query is required" });
        }

        // Search both old and new structures
        const categories = await Category.find({
            $or: [
                // Old structure search
                { "subcategories.subSubcategories": { $regex: `^${query}`, $options: "i" } },

                // New structure search options
                { "name": { $regex: `^${query}`, $options: "i" } },
                { "slug": { $regex: `^${query}`, $options: "i" } },
                { "subcategories.name": { $regex: `^${query}`, $options: "i" } }
            ]
        });

        // Extract results from both structures
        let results = new Set(); // Using Set to automatically handle duplicates

        categories.forEach(category => {
            // Check new structure first
            if (category.name && category.name.toLowerCase().startsWith(query.toLowerCase())) {
                results.add(category.name);
            }

            // Check old structure if exists
            if (category.subcategories && category.subcategories.length > 0) {
                category.subcategories.forEach(subcategory => {
                    // Check subcategory name in new structure
                    if (subcategory.name && subcategory.name.toLowerCase().startsWith(query.toLowerCase())) {
                        results.add(subcategory.name);
                    }

                    // Check old subSubcategories
                    if (subcategory.subSubcategories) {
                        subcategory.subSubcategories.forEach(subSub => {
                            if (subSub.toLowerCase().startsWith(query.toLowerCase())) {
                                results.add(subSub);
                            }
                        });
                    }
                });
            }
        });

        res.json({
            success: true,
            results: Array.from(results)
        });

    } catch (error) {
        console.error("Search Error:", error);
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};  

exports.getSubCategories = async (req, res) => {
    try {
        const { category } = req.body;
        const categoryExists = await Category.findOne({ category })
        if (!categoryExists) {
            return res.status(404).json({ message: "Category not found", type: false })
        }

        const subcategories = categoryExists.subcategories.map(sub => sub.subcategory)
        return res.status(200).json({ subcategories, type: true })
    } catch (err) {
        return res.status(500).json({ message: "Internal Server Error!", type: false })
    }
}
exports.getsubsubCategories = async (req, res) => {
    try {
        const { category, subcategory } = req.body;
        const categoryExists = await Category.findOne({ category })
        if (!categoryExists) {
            return res.status(404).json({ message: "Category not found", type: false })
        }
        const subcategoryExists = categoryExists.subcategories.find(sub => subcategory == sub.subcategory)

        if (!subcategoryExists) {
            return res.status(404).json({ message: "Subcategory not found", type: false })
        }
        const subSubcategories = subcategoryExists.subSubcategories.map(sub => sub)
        return res.status(200).json({ subSubcategories, type: true })
    } catch (err) {
        return res.status(500).json({ message: "Internal Server Error!", type: false })
    }
}
exports.findHierarchyBySubSubcategory = async (req, res) => {
    try {
        const { subSubcategory } = req.body;

        if (!subSubcategory) {
            return res.status(400).json({ error: "subSubcategory is required in the request body" });
        }

        const categories = await Category.find({
            "subcategories.subSubcategories": { $regex: `^${subSubcategory}$`, $options: "i" }
        });

        // If no categories are found, return null with success false
        if (!categories.length) {
            return res.status(200).json({
                category: null,
                subcategory: null,
                subSubcategory: null,
                success: false
            });
        }

        let foundMatch = false;

        // Loop through categories and subcategories to find a matching subSubcategory
        for (const category of categories) {
            for (const sub of category.subcategories) {
                const match = sub.subSubcategories.find(
                    subSub => subSub.toLowerCase() === subSubcategory.toLowerCase()
                );

                if (match) {
                    // Found a match, return the corresponding data
                    foundMatch = true;
                    const categoryData = category.category || null;
                    const subcategoryData = sub.subcategory || null;

                    return res.status(200).json({
                        category: categoryData,
                        subcategory: subcategoryData,
                        subSubcategory: match,
                        success: true
                    });
                }
            }
        }

        // If no match is found in any of the subcategories, return null with success false
        if (!foundMatch) {
            return res.status(200).json({
                category: null,
                subcategory: null,
                subSubcategory: null,
                success: false
            });
        }

    } catch (error) {
        console.error("Hierarchy Lookup Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


exports.getCategories = async (req, res) => {
    try {
        // Fetch categories from the database without subcategories and subSubcategories
        const categories = await Category.find({}, 'category'); // Only select the 'category' field
        if (!categories) {
            return res.status(404).json({ message: 'Categories not found' });
        }
        res.status(200).json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching categories', error });
    }
};

exports.getSubcategoriesByCategory = async (req, res) => {
    try {
        const { category } = req.params; // Get category name from params
        const categoryexits = await Category.findOne({ category: category });

        if (!categoryexits) {
            return res.status(404).json({ message: `Category '${categoryName}' not found` });
        }

        // Format the subcategories and subSubcategories
        const subcategoriesWithSubSubcategories = categoryexits.subcategories.map(subcategory => ({
            subcategory: subcategory.subcategory,    // Subcategory name
            subSubcategories: subcategory.subSubcategories, // List of subSubcategories
        }));

        // Return the subcategories along with their subSubcategories
        res.status(200).json(subcategoriesWithSubSubcategories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching subcategories', error });
    }
};
