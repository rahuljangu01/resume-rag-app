const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  filename: { 
    type: String, 
    required: true 
  },
  originalName: { 
    type: String, 
    required: true 
  },
  mimetype: { 
    type: String, 
    required: true 
  },
  size: { 
    type: Number, 
    required: true 
  },
  uploader: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['processing', 'completed', 'failed'], 
    default: 'processing' 
  },
  piiRedacted: { 
    type: Boolean, 
    default: true 
  },
}, { 
  timestamps: true 
});

const Resume = mongoose.model('Resume', resumeSchema);

module.exports = Resume;