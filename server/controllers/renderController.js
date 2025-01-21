// controllers/renderController.js
import { renderTemplate } from '../utils/templateRenderer.js';
import EmailTemplate from '../models/EmailTemplate.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

export const renderEmailTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = req.body;

    const template = await EmailTemplate.findById(id);
    if (!template) {
      return sendError(res, 'Template not found', 404);
    }

    const renderedHtml = await renderTemplate(template, data);
    sendSuccess(res, { html: renderedHtml }, 'Template rendered successfully');
  } catch (error) {
    sendError(res, error.message);
  }
};

export const downloadTemplate = async (req, res) => {
  try {
    const { data } = req.body;
    
    const renderedHtml = await renderTemplate({ content: data }, data);
    
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Disposition', 'attachment; filename="rendered-template.html"');
    res.send(renderedHtml);
  } catch (error) {
    sendError(res, error.message);
  }
};