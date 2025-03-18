const mongoose = require('mongoose');

// Define the schema
const subcategorySchema = new mongoose.Schema({
    subcategory: String,
    subSubcategories: [String], 
});

const categorySchema = new mongoose.Schema({
    category: String, 
    subcategories: [subcategorySchema], 
});

// Create the model
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;