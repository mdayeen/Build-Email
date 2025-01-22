# Email Template Builder

A modern web application designed to create, edit, and manage email templates. Built for ease of use with real-time preview functionality, this project is perfect for users who want to create professional email designs effortlessly.

### 🌐 [Live Demo](https://ayeen.suhail.app)

---

## 📜 Features

- **Functionality**: Add and arrange text, image, and button sections easily.  
- **Real-Time Preview**: See changes instantly as you edit.  
- **Styling Options**: Customize text styles, alignment, colors, and more.  
- **Template Management**: Create, edit, and delete templates seamlessly.  
- **Secure Image Uploads**: Restricts file types and enforces size limits.  
- **Responsive Design**: Templates adapt perfectly to different devices.  

---

## 🚀 Technologies Used

### Frontend
- **React.js**
- **Material-UI**
- **Tailwind CSS**
- **React-Quill** (Rich Text Editor)
- **React Context API** (State Management)

### Backend
- **Node.js**
- **Express.js**
- **MongoDB**
- **Mongoose** (Schema Validation)
- **Multer** (File Upload Handling)

### Deployment
- **DigitalOcean**

---

## 🛠️ API Endpoints

### Template Management
- `GET /api/templates` - Retrieve all templates  
- `POST /api/templates` - Create a new template  
- `GET /api/templates/:id` - Retrieve a specific template  
- `PUT /api/templates/:id` - Update a template  
- `DELETE /api/templates/:id` - Delete a template  

### Image Upload
- `POST /api/upload` - Upload an image  

### Template Rendering
- `POST /api/render/:id` - Render a template as HTML  
- `POST /api/download` - Download a rendered template  

---

## 🔧 Getting Started

Follow these steps to set up the project locally.

### Prerequisites
- **Node.js** (v14 or higher)  
- **MongoDB** (locally or cloud-based)  

### Clone the Repository
```bash
git clone https://github.com/mdayeen/Build-Email.git
cd email-template-builder
```

### Environment Variables
Configure the environment variables by renaming `.env.example` to `.env` and updating the necessary values.

### Start the Client
```bash
cd client
npm install
npm run dev
```

### Start the Server
```bash
cd server
npm install
npm run dev
```

### Open in Browser
Visit `http://localhost:3000` for the frontend and `http://localhost:8000` for the backend.

---

## 🔗 Contributing

This project is open for contributions!  
- Fork the repository.  
- Create a feature branch (`git checkout -b feature-name`).  
- Commit your changes (`git commit -m "Add feature"`).  
- Push to the branch (`git push origin feature-name`).  
- Open a pull request.  

Feel free to use the code in your own projects as well. Contributions, feedback, and suggestions are welcome!

---

## 📄 License

This project is licensed under the **MIT License**.
