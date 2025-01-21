# Email Template Builder - Client Documentation

## Overview
The Email Template Builder is a React-based application that allows users to create, edit, and manage email templates with a modern interface and real-time preview functionality.

## Project Structure

```
client/
├── src/
│   ├── components/
│   │   ├── editor/
│   │   │   ├── AddSectionButtons.jsx
│   │   │   ├── EditorHeader.jsx
│   │   │   ├── Section.jsx
│   │   │   ├── StyleControls.jsx
│   │   │   └── constants.js
│   │   └── Preview.jsx
│   ├── context/
│   │   └── EmailContext.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   └── Editor.jsx
│   ├── App.jsx
│   └── main.jsx
```

## Key Components

### 1. Editor Components

#### Editor.jsx (Main Editor)
- Core template editing functionality
- Manages template state
- Handles template saving and updating
- Coordinates between sub-components
- Real-time preview integration

#### Components/editor/
- **AddSectionButtons**: Buttons for adding text, image, and button sections
- **EditorHeader**: Title input, save and cancel actions
- **Section**: Individual section rendering and editing
- **StyleControls**: Section styling options (font, color, alignment)
- **constants.js**: Default styles and template structure

### 2. Context

#### EmailContext.jsx
- Global state management
- API communication layer
- Template CRUD operations
- Image upload handling
- Error state management

### 3. Preview Component
- Real-time template preview
- Renders sections with applied styles
- Updates as changes are made

## Code Flow

### 1. Template Creation/Editing Flow
1. User starts template creation/editing
2. Editor loads with initial state
3. User can:
   - Edit template title
   - Add sections (text/image/button)
   - Edit section content
   - Apply styles
   - Preview changes
4. Changes saved via EmailContext

### 2. Section Management Flow
1. User adds section using AddSectionButtons
2. Section renders based on type:
   - Text: Rich text editor (React-Quill)
   - Image: Upload interface
   - Button: Text and URL inputs
3. StyleControls provides styling options
4. Preview updates automatically

### 3. State Management
- Template data in Editor.jsx
- API operations in EmailContext
- Real-time preview updates

## Important Information

### Dependencies
- React 18+
- Material-UI
- React-Quill
- Tailwind CSS

### Key Features
1. Section Types:
   - Text sections with rich formatting
   - Image sections with upload
   - Button sections with URL linking

2. Styling Options:
   - Font size control
   - Text alignment
   - Color selection
   - Padding adjustment
   - Button-specific styling

3. Template Management:
   - Create new templates
   - Edit existing templates
   - Real-time preview
   - Template saving

## API Integration

### Endpoints Used
```javascript
// Template Operations
GET    /api/templates      // List templates
POST   /api/templates      // Create template
PUT    /api/templates/:id  // Update template
DELETE /api/templates/:id  // Delete template
GET    /api/templates/:id  // Get template

// Image Operations
POST   /api/upload        // Upload images

// Render Operations
POST   /api/render/:id    // Render template
POST   /api/download      // Download template
```

### Error Handling
- API error state management
- User-friendly error messages
- Validation feedback

## Security Features
- Input validation
- Image upload validation
- URL validation for buttons
- Secure API communication
