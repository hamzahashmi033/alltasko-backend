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