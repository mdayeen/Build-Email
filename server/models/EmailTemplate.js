import mongoose from 'mongoose';

const emailTemplateSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  sections: [{
    type: {
      type: String,
      enum: ['text', 'image', 'button', 'footer'],
      required: true,
    },
    content: {
      type: String,
      required: function() {
        return this.type === 'text' || this.type === 'button';
      },
    },
    link: {
      type: String,
      required: function() {
        return this.type === 'button';
      },
      validate: {
        validator: function(v) {
          if (!this.type || this.type !== 'button') return true;
          try {
            new URL(v);
            return true;
          } catch (err) {
            return false;
          }
        },
        message: props => `${props.value} is not a valid URL!`
      }
    },
    imageUrl: {
      type: String,
      required: function() {
        return this.type === 'image';
      },
    },
    styles: {
      fontSize: { 
        type: String, 
        default: '16px' 
      },
      color: { 
        type: String, 
        default: '#000000' 
      },
      textAlign: { 
        type: String, 
        enum: ['left', 'center', 'right'], 
        default: 'left' 
      },
      backgroundColor: { 
        type: String,
        default: '#ffffff'
      },
      padding: { 
        type: String, 
        default: '10px' 
      },
      borderRadius: { 
        type: String,
        default: '0'
      },
      width: { 
        type: String,
        default: '100%'
      }
    },
  }],
  footer: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: true
});

// Pre-save middleware to handle button styles and validation
emailTemplateSchema.pre('save', function(next) {
  this.sections.forEach(section => {
    // Set button-specific styles
    if (section.type === 'button') {
      section.styles = {
        ...section.styles,
        backgroundColor: section.styles?.backgroundColor || '#3B82F6',
        borderRadius: section.styles?.borderRadius || '4px',
        width: section.styles?.width || 'auto'
      };
      
      // Validate button requirements
      if (!section.content) {
        throw new Error('Button sections must have content (button text)');
      }
      if (!section.link) {
        throw new Error('Button sections must have a link');
      }
    }
  });
  next();
});

// Method to validate entire template
emailTemplateSchema.methods.validateTemplate = function() {
  const errors = [];
  
  if (!this.title) {
    errors.push('Title is required');
  }

  this.sections.forEach((section, index) => {
    if (section.type === 'button') {
      if (!section.content) {
        errors.push(`Button at index ${index} must have content`);
      }
      if (!section.link) {
        errors.push(`Button at index ${index} must have a link`);
      }
      try {
        new URL(section.link);
      } catch (err) {
        errors.push(`Invalid URL for button at index ${index}`);
      }
    }
  });

  return errors;
};

export default mongoose.model('EmailTemplate', emailTemplateSchema);