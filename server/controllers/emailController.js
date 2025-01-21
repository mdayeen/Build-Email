// controllers/emailController.js
import EmailTemplate from '../models/EmailTemplate.js';
import path from 'path';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

// Serve the base template
export const getBaseTemplate = (req, res) => {
  try {
    const filePath = path.join(process.cwd(), 'views', 'base-template.html');
    res.sendFile(filePath);
  } catch (error) {
    sendError(res, 'Failed to fetch the base template');
  }
};

export const getAllTemplates = async (req, res) => {
  try {
    const templates = await EmailTemplate.find().sort({ createdAt: -1 });
    sendSuccess(res, templates, 'Templates retrieved successfully');
  } catch (error) {
    sendError(res, error.message);
  }
};

export const getTemplateById = async (req, res) => {
  try {
    const template = await EmailTemplate.findById(req.params.id);
    if (!template) {
      return sendError(res, 'Template not found', 404);
    }
    sendSuccess(res, template, 'Template retrieved successfully');
  } catch (error) {
    sendError(res, error.message);
  }
};

export const createTemplate = async (req, res) => {
  try {
    const template = new EmailTemplate(req.body);
    const savedTemplate = await template.save();
    sendSuccess(res, savedTemplate, 'Template created successfully', 201);
  } catch (error) {
    sendError(res, error.message);
  }
};

export const updateTemplate = async (req, res) => {
  try {
    const template = await EmailTemplate.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!template) {
      return sendError(res, 'Template not found', 404);
    }
    sendSuccess(res, template, 'Template updated successfully');
  } catch (error) {
    sendError(res, error.message);
  }
};

export const deleteTemplate = async (req, res) => {
  try {
    const template = await EmailTemplate.findByIdAndDelete(req.params.id);
    if (!template) {
      return sendError(res, 'Template not found', 404);
    }
    sendSuccess(res, null, 'Template deleted successfully');
  } catch (error) {
    sendError(res, error.message);
  }
};