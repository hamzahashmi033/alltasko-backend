const mongoose = require('mongoose');

const FormConfigurationSchema = new mongoose.Schema({
  serviceType: { type: String, required: true, unique: true },
  questions: [{
    fieldName: { type: String, required: true },
    questionText: { type: String, required: true },
    fieldType: { 
      type: String, 
      required: true,
      enum: ["text", "select", "date", "checkbox", "radio", "number"] 
    },
    options: [String],  
    required: { type: Boolean, default: false },
    placeholder: String,
    validation: {
      min: Number,
      max: Number,
      pattern: String
    }
  }]
});

module.exports = mongoose.model('FormConfiguration', FormConfigurationSchema);