const mongoose = require('mongoose');

const subcategorySchema = new mongoose.Schema({
    subcategory: { 
        type: String,
        required: false // Make optional for backward compatibility
    },
    subSubcategories: {
        type: [String],
        required: false // Make optional
    },
    // Add new simplified fields
    name: {
        type: String,
        required: false
    },
    slug: {
        type: String,
        required: false,
        index: true
    }
}, { _id: false }); // Prevent automatic ID generation for subdocuments

const categorySchema = new mongoose.Schema({
    // Original fields (keep for backward compatibility)
    category: { 
        type: String,
        required: false // Change to optional
    },
    subcategories: {
        type: [subcategorySchema],
        required: false
    },
    
    // New simplified structure
    name: {
        type: String,
        required: true,
        index: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    description: {
        type: String,
        required: false
    },
    
    // Metadata for transition period
    isLegacyData: {
        type: Boolean,
        default: false
    },
    
    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: function(doc, ret) {
            // Clean up the output
            delete ret.__v;
            delete ret.isLegacyData;
            return ret;
        }
    }
});

// Add virtual for backward compatibility
categorySchema.virtual('legacyCategory').get(function() {
    return this.category || this.name;
});

// Add instance method to convert to new format
categorySchema.methods.migrateToNewFormat = function() {
    if (this.isLegacyData) {
        this.name = this.name || this.category;
        this.slug = this.slug || this.name.toLowerCase().replace(/\s+/g, '-');
        this.isLegacyData = false;
    }
    return this;
};

// Static method to find by either old or new format
categorySchema.statics.findByCategory = function(identifier) {
    return this.findOne({
        $or: [
            { name: identifier },
            { slug: identifier },
            { category: identifier }
        ]
    });
};

// Middleware to maintain consistency
categorySchema.pre('save', function(next) {
    if (!this.slug && this.name) {
        this.slug = this.name.toLowerCase().replace(/\s+/g, '-');
    }
    this.updatedAt = new Date();
    next();
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;