// routes/renderRoutes.js
import express from 'express';
import { renderEmailTemplate, downloadTemplate } from '../controllers/renderController.js';
import { validateRenderRequest } from '../middlewares/validateRequest.js';

const router = express.Router();

router.post('/render/:id', validateRenderRequest, renderEmailTemplate);
router.post('/download', validateRenderRequest, downloadTemplate);

export default router;