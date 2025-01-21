// Updated server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import emailRoutes from './routes/emailRoutes.js';
import imageRoutes from './routes/imageRoutes.js';
import renderRoutes from './routes/renderRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { requestLogger } from './middlewares/requestLogger.js';
import { UPLOAD_DIRECTORY } from './config/constants.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(requestLogger);

// Ensure uploads directory exists
import { mkdirSync } from 'fs';
try {
  mkdirSync(path.join(__dirname, UPLOAD_DIRECTORY));
} catch (err) {
  if (err.code !== 'EEXIST') {
    console.error('Error creating uploads directory:', err);
  }
}

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, UPLOAD_DIRECTORY)));

// Routes
app.use('/api', emailRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/templates', renderRoutes);

// Error handling
app.use(errorHandler);

// Connect to Database
connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});