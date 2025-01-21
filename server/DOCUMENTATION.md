# Email Template Builder - Server Documentation

## Overview
The server-side of the Email Template Builder is a Node.js/Express application that handles template management, email rendering, and image processing. It provides RESTful APIs and MongoDB data persistence.

## Project Structure

```
server/
├── config/
│   ├── appConfig.js
│   ├── constants.js
│   └── db.js
├── controllers/
│   ├── emailController.js
│   ├── imageController.js
│   └── renderController.js
├── middlewares/
│   ├── errorHandler.js
│   ├── requestLogger.js
│   ├── uploads.js
│   └── validateRequest.js
├── models/
│   └── EmailTemplate.js
├── routes/
│   ├── emailRoutes.js
│   ├── imageRoutes.js
│   └── renderRoutes.js
├── utils/
│   ├── responseHandler.js
│   └── templateRenderer.js
└── server.js
```

## Key Components

### 1. Configuration
- **appConfig.js**: Core application settings
- **constants.js**: System constants
- **db.js**: MongoDB configuration

### 2. Controllers
- **emailController.js**: Template CRUD operations
- **imageController.js**: Image upload handling
- **renderController.js**: Template rendering and download

### 3. Models
- **EmailTemplate.js**: MongoDB schema and validation

### 4. Middlewares
- **errorHandler.js**: Error handling
- **requestLogger.js**: Request logging
- **uploads.js**: File upload processing
- **validateRequest.js**: Input validation

## API Endpoints

### Template Endpoints
```javascript
GET    /api/templates     // List all templates
POST   /api/templates     // Create new template
GET    /api/templates/:id // Get specific template
PUT    /api/templates/:id // Update template
DELETE /api/templates/:id // Delete template
GET    /api/layout       // Get base template
```

### Image Endpoints
```javascript
POST   /api/upload       // Upload image
```

### Render Endpoints
```javascript
POST   /api/render/:id   // Render email template
POST   /api/download     // Download template as HTML
```

## Download Endpoint Details

### POST /api/download
Downloads the email template as an HTML file.

#### Request Body
```javascript
{
  "templateId": "string",  // Template ID
  "data": {               // Optional dynamic data
    "key": "value"
  }
}
```

#### Response
- Content-Type: text/html
- Content-Disposition: attachment; filename="template.html"

#### Error Responses
- 400: Invalid request data
- 404: Template not found
- 500: Server error

## Database Schema

### EmailTemplate
```javascript
{
  title: {
    type: String,
    required: true
  },
  sections: [{
    type: {
      type: String,
      enum: ['text', 'image', 'button', 'footer'],
      required: true
    },
    content: {
      type: String,
      required: function() {
        return this.type === 'text' || this.type === 'button';
      }
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
      }
    },
    styles: {
      fontSize: String,
      color: String,
      backgroundColor: String,
      textAlign: String,
      padding: String,
      margin: String,
      borderRadius: String,
      width: String
    }
  }],
  footer: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Error Handling

### Error Response Format
```javascript
{
  status: "error",
  message: "Error description",
  details: {} // Additional error info
}
```

### Common Error Types
1. Validation Errors
   - Invalid template structure
   - Missing required fields
   - Invalid URLs

2. Processing Errors
   - Database errors
   - File upload errors
   - Rendering errors

## Security Features

### Input Validation
- Request payload validation
- File type verification
- URL validation
- Content validation

### File Upload Security
- File size limits
- File type restrictions
- Secure file storage

## Environment Configuration

### Required Variables
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/email_builder
UPLOAD_DIR=uploads
```

## Best Practices

### Code Organization
- Modular architecture
- Clear separation of concerns
- Consistent error handling
- Request validation

### Performance
- Async operations
- Proper error handling
- Optimized file uploads
- Efficient database queries
