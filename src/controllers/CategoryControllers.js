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

        // Find subSubcategories matching the query
        const categories = await Category.find({
            "subcategories.subSubcategories": { $regex: `^${query}`, $options: "i" }
        });

        // Extract only subSubcategories
        let subSubcategories = [];
        categories.forEach(category => {
            category.subcategories.forEach(subcategory => {
                subcategory.subSubcategories.forEach(subSub => {
                    if (subSub.toLowerCase().startsWith(query.toLowerCase())) {
                        subSubcategories.push(subSub);
                    }
                });
            });
        });

        // Remove duplicates
        subSubcategories = [...new Set(subSubcategories)];

        res.json({ results: subSubcategories });

    } catch (error) {
        console.error("Search Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
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
