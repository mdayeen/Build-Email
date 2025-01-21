// routes/imageRoutes.js
import express from 'express';
import { upload } from '../middlewares/uploads.js';
import { uploadImage, deleteImage } from '../controllers/imageController.js';

const router = express.Router();

router.post('/upload', upload.single('image'), uploadImage);
router.delete('/:filename', deleteImage);

export default router;
