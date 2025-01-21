
### **Email Builder: Project Overview**

**Objective:**  
The Email Builder is a full-stack web application designed to help users create customized email templates. These templates are particularly useful for marketing and customer engagement. The app allows non-technical users to design professional emails with ease by providing a drag-and-drop editor, real-time updates, and flexible customization options.

---

### **Key Features**

1. **Frontend Features:**
    
    - Fetch and render a pre-defined email layout.
    - Edit text fields such as the title, content, and footer.
    - Upload and integrate images directly into the template.
    - Live preview of changes made to the template.
    - Advanced options: Drag-and-drop sections, dynamic styling (e.g., text color, font size).
2. **Backend Features:**
    
    - Manage email layouts and template data through REST APIs.
    - Save, update, and fetch templates from a MongoDB database.
    - Handle image uploads and storage.
    - Render final email templates dynamically and provide them for download.
3. **Deployment:**
    
    - Frontend hosted on platforms like Vercel or Netlify.
    - Backend hosted on Render, Heroku, or AWS.

---

### **Technologies Used**

#### **Frontend:**

- ES6, React.js, Tailwind CSS, React-Quill, Axios, React Context API, Formik, React-DnD.

#### **Backend:**

- Node.js, Express.js, MongoDB, Mongoose, Multer, Nodemailer.

#### **Deployment:**

- Vercel, Render, or Heroku for hosting.

---

### **Project Flow**

1. **User Interaction:**
    
    - The user logs into the app (if authentication is enabled).
    - Selects or creates a new email template.
    - Customizes the template by editing text, uploading images, and rearranging sections.
2. **Backend Processing:**
    
    - The server fetches the base layout and processes updates from the frontend.
    - Stores email template data in the database for future use.
    - Generates the final HTML template dynamically with all user-provided customizations.
3. **Output:**
    
    - Users can preview, download, or send the email template for testing.

### Complete Plan for the Email Builder Project

#### **Backend Plan**

1. **Tools & Libraries:**
    
    - **Mandatory:** ES6, Node.js, Express.js, MongoDB (with Mongoose), Multer, Dotenv
    -  **Enhanced functionality** Nodemailer (email testing), JWT (user authentication)
2. **Endpoints:**
    
    - **Email Template Endpoints:**
        
        - `GET /api/templates`: Fetch all templates.
        - `GET /api/templates/:id`: Fetch a specific template by ID.
        - `POST /api/templates`: Save a new template.
        - `PUT /api/templates/:id`: Update an existing template.
        - `DELETE /api/templates/:id`: Delete a template.
    - **Email Layout Endpoint:**
        
        - `GET /api/layout`: Fetch the base layout HTML.
    - **Image Upload Endpoints:**
        
        - `POST /api/images/upload`: Upload images.
        - `GET /api/images/:filename`: Fetch images by filename.
    - **Render and Download Endpoint:**
        
        - `POST /api/templates/render`: Render email template with dynamic data.
        - `GET /api/templates/download/:id`: Download the rendered HTML file.
    - **Utility Endpoints (Optional):**
        
        - `POST /api/auth/register`: Register a user.
        - `POST /api/auth/login`: Log in a user.
        - `GET /api/auth/logout`: Log out a user.
        - `GET /api/status`: Check backend status.
3. **Schema Design Plan:**
```
    const mongoose = require("mongoose");

const emailTemplateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    sections: [
      {
        type: {
          type: String,
          enum: ["text", "image", "button", "footer"], // Define the type of section
          required: true,
        },
        content: {
          type: String, // For text content, button labels, or URLs
          required: function () {
            return this.type === "text" || this.type === "button";
          },
        },
        imageUrl: {
          type: String, // For image sections
          required: function () {
            return this.type === "image";
          },
        },
        styles: {
          fontSize: {
            type: String,
            default: "16px",
          },
          color: {
            type: String,
            default: "#000000",
          },
          textAlign: {
            type: String,
            enum: ["left", "center", "right"],
            default: "left",
          },
          backgroundColor: {
            type: String,
            default: "#ffffff",
          },
          padding: {
            type: String,
            default: "10px",
          },
        },
      },
    ],
    footer: {
      type: String,
      default: "",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId, // Reference to a user collection if user management is added
      ref: "User",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

module.exports = mongoose.model("EmailTemplate", emailTemplateSchema);

```
    - Support for `sections` with customizable content (text, image, button) and styles.
    - Include `createdBy`, timestamps, and footer.
4. **Folder Structure:**
    
    - `config/`: Configuration files (e.g., DB setup).
    - `controllers/`: API logic (e.g., email and image controllers).
    - `models/`: MongoDB schemas.
    - `routes/`: Define endpoints.
    - `middlewares/`: Authentication and error handlers.
    - `utils/`: Helper functions (e.g., `generateHtml.js`).
    - `views/`: Static HTML files (e.g., `layout.html`).
    - `server.js`: Entry point.

#### **Frontend Plan**

1. **Tools & Libraries:**
    
    - **UI Development:** Vite, React.js, Tailwind CSS, React-Quill, Formik, React Context API, headlessUI.
    - **Functionality:** React-DnD, React-Preview, Axios.
2. **Features:**
    
    - **Basic:**
        - Fetch and render layout HTML.
        - Edit fields (e.g., title, content).
        - Upload and preview images.
        - Save all data in a JSON object for backend submission.
    - **Advanced:**
        - Drag-and-drop sections.
        - Live preview updates for text styles, colors, and alignments.
        - Add/remove sections dynamically.
3. **Folder Structure:**
    
    - `public/`: Static assets.
    - `src/`: Main codebase.
        - `components/`: Reusable components (e.g., `Editor.jsx`, `Preview.jsx`).
        - `pages/`: Page-level components (e.g., `Home.jsx`, `Dashboard.jsx`).
        - `context/`: State management providers (e.g., `EmailContext.js`).
        - `hooks/`: Custom hooks (e.g., `useEmail.js`).
        - `services/`: API service functions (e.g., `emailService.js`).
        - `styles/`: CSS or modules for styling.

#### **Hosting & Deployment**

1. **Frontend Deployment:**
    
    - Use Vercel for hosting the React app.
2. **Backend Deployment:**
    
    - Use Render for hosting the Node.js app.
    - Set up environment variables for production (e.g., DB_URI, API keys).

#### **Additional Enhancements**

1. Testing:
    
    - **Unit Testing:** Jest, React Testing Library.
    - **API Testing:** Postman, Supertest.
    - **End-to-End Testing:** Cypress.
2. Security:
    
    - Helmet, CORS, and rate limiting for backend APIs.
3. Documentation:
    
    - Maintain a detailed `README.md` in the GitHub repository.
    - Include API documentation in Postman or Swagger.
4. Optimization:
    
    - Code splitting in React for faster load times.
    - Use caching strategies for faster API responses (e.g., Redis, React Query).
    -


# Day 1 completed 

# Email Builder Project - Technical Documentation (Day 1)

## System Architecture

The Email Builder uses a modern full-stack architecture with a clear separation between the backend API server and frontend client application. The backend is built with Node.js and Express, while the frontend will utilize React with Vite.

### Environment Configuration

#### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/email-builder
PORT=8000
NODE_ENV=development
MAX_FILE_SIZE=5242880
```

#### Frontend (.env)
```
VITE_API_URL=http://localhost:8000/api
```

## API Endpoints Documentation

### Template Management

#### GET /api/templates
Retrieves all email templates.

Response Format:
```json
{
  "templates": [
    {
      "_id": "template_id",
      "title": "Template Title",
      "sections": [
        {
          "type": "text",
          "content": "Section content",
          "styles": {
            "fontSize": "16px",
            "color": "#000000",
            "textAlign": "left"
          }
        }
      ],
      "footer": "Footer content",
      "createdAt": "2025-01-18T10:00:00.000Z",
      "updatedAt": "2025-01-18T10:00:00.000Z"
    }
  ]
}
```

#### GET /api/templates/:id
Retrieves a specific template by ID.

Response Format:
```json
{
  "template": {
    "_id": "template_id",
    "title": "Template Title",
    "sections": [],
    "footer": "Footer content"
  }
}
```

#### POST /api/templates
Creates a new email template.

Request Body:
```json
{
  "title": "New Template",
  "sections": [
    {
      "type": "text",
      "content": "Hello World",
      "styles": {
        "fontSize": "16px",
        "color": "#000000"
      }
    }
  ],
  "footer": "Contact us at example@email.com"
}
```

#### PUT /api/templates/:id
Updates an existing template.

Request Body: Same format as POST /api/templates

#### DELETE /api/templates/:id
Deletes a template.

### Image Management

#### POST /api/images/upload
Uploads an image file.

Request Format:
- Content-Type: multipart/form-data
- Field name: "image"
- Supported formats: JPEG, PNG, GIF
- Maximum size: 5MB

Response Format:
```json
{
  "message": "Image uploaded successfully",
  "imageUrl": "/uploads/filename.jpg"
}
```

#### DELETE /api/images/:filename
Deletes an uploaded image.

### Template Rendering

#### POST /api/templates/render/:id
Renders a template with dynamic data.

Request Body:
```json
{
  "data": {
    "customVariable": "value",
    "userInfo": {
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

Response Format:
```json
{
  "html": "<!DOCTYPE html>..."
}
```

#### GET /api/templates/download/:id
Downloads a rendered template as HTML file.

## Database Schema

### EmailTemplate Schema
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
    content: String,
    imageUrl: String,
    styles: {
      fontSize: String,
      color: String,
      textAlign: {
        type: String,
        enum: ['left', 'center', 'right']
      },
      backgroundColor: String,
      padding: String
    }
  }],
  footer: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Error Handling

The API implements standardized error responses:

```json
{
  "message": "Error description",
  "error": "Detailed error information (development only)",
  "status": 400
}
```

Common Status Codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 404: Not Found
- 500: Internal Server Error

## File Upload Specifications

### Image Upload Constraints
- Maximum file size: 5MB
- Allowed MIME types: image/jpeg, image/png, image/gif
- Storage location: /uploads directory
- File naming: timestamp-originalname.extension

## Security Measures

Current Implementation:
- CORS configuration
- File type validation
- File size limits
- Error handling middleware

Pending Implementation:
- Authentication
- Rate limiting
- Input sanitization
- XSS protection
- CSRF protection

## Development Tools and Commands

### Backend
```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production server
npm start
```

### Project Structure with File Purposes
```
email-builder/
├── config/
│   ├── db.js                 # Database connection configuration
│   └── constants.js          # Application constants
├── controllers/
│   ├── emailController.js    # Template CRUD operations
│   ├── imageController.js    # Image upload handling
│   └── renderController.js   # Template rendering logic
├── middleware/
│   ├── upload.js            # Multer configuration
│   └── errorHandler.js      # Global error handling
├── models/
│   └── EmailTemplate.js     # MongoDB schema definition
├── routes/
│   ├── emailRoutes.js       # Template endpoints
│   ├── imageRoutes.js       # Image handling endpoints
│   └── renderRoutes.js      # Rendering endpoints
├── utils/
│   └── templateRenderer.js   # Handlebars template processing
├── views/
│   └── base-template.html   # Base email template
└── server.js                # Application entry point
```

## Testing Guidelines

Planned Test Coverage:
1. API Endpoints
   - Template CRUD operations
   - Image upload/deletion
   - Template rendering
   
2. Database Operations
   - Schema validation
   - Data integrity
   - Error handling

3. File Operations
   - Upload constraints
   - File deletion
   - Storage management

## Performance Considerations

Current Optimizations:
- Efficient database queries
- Proper error handling
- Static file serving

Planned Optimizations:
- Response caching
- Image optimization
- Database indexing
- Query optimization

## Monitoring and Logging

To Be Implemented:
- Request logging
- Error tracking
- Performance monitoring
- Resource usage tracking

## Known Limitations and Future Improvements

Current Limitations:
1. No user authentication
2. Limited template customization options
3. Basic error handling
4. No email sending capability

Planned Improvements:
1. User authentication system
2. Advanced template features
3. Email testing functionality
4. Analytics dashboard
5. Template version control
6. Real-time collaboration

This technical documentation will be updated as new features are implemented and existing ones are modified. All endpoints and features are subject to change during development.