// routes/emailRoutes.js
import express from 'express';
import {
  getAllTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  getBaseTemplate
} from '../controllers/emailController.js';
import { validateEmailTemplate } from '../middlewares/validateRequest.js';

const router = express.Router();

// Route to fetch base template
router.get('/layout', getBaseTemplate);

router.get('/templates', getAllTemplates);
router.get('/templates/:id', getTemplateById);
router.post('/templates', validateEmailTemplate, createTemplate);
router.put('/templates/:id', validateEmailTemplate, updateTemplate);
router.delete('/templates/:id', deleteTemplate);

export default router;