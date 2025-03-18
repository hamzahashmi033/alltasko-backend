const Category = require("../models/Category")

exports.saveCategory = async (req, res) => {
    try {
        
    
        
        await Category.insertMany(req.body)
        res.status(200).json({message:"Success"})
    } catch (error) {
        res.status(500).json({ error: "Error saving category", message: error.message });
    }
}