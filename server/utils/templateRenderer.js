// utils/templateRenderer.js
import Handlebars from 'handlebars';
import fs from 'fs/promises';
import path from 'path';

// hosting setup done 


// Register the eq helper for comparisons
Handlebars.registerHelper('eq', function(a, b) {
  return a === b;
});

// Register lookup helper to access object properties
Handlebars.registerHelper('lookup', function(obj, field) {
  return obj && obj[field];
});

// Convert relative image URLs to absolute URLs
const convertToAbsoluteUrl = (url) => {
  if (!url) return url;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  
  // Get the base URL from environment variable or use default
  const baseUrl = process.env.BASE_URL || 'http://localhost:8000';
  
  // Remove any leading slashes from the URL
  const cleanUrl = url.replace(/^\/+/, '');
  
  return `${baseUrl}/${cleanUrl}`;
};

// Register the default helper
Handlebars.registerHelper('default', function(value, defaultValue) {
  return value || defaultValue;
});

// Register a helper for style objects
Handlebars.registerHelper('styleObject', function(styles) {
  if (!styles) return '';
  
  // Ensure textAlign is applied if present
  if (styles.textAlign && !styles['text-align']) {
    styles['text-align'] = styles.textAlign;
  }
  
  return Object.entries(styles)
    .map(([key, value]) => {
      // Convert camelCase to kebab-case for CSS properties
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      return `${cssKey}:${value}`;
    })
    .join(';');
});

export const renderTemplate = async (template, data) => {
  try {
    const baseTemplate = await fs.readFile(
      path.join('views', 'base-template.html'),
      'utf-8'
    );
    
    const compiledTemplate = Handlebars.compile(baseTemplate);
    
    // Structure the data to match the base template expectations
    const templateData = {
      title: data.title || 'Email Template',
      sections: data.sections?.map(section => {
        if (section.type === 'image') {
          return {
            ...section,
            imageUrl: convertToAbsoluteUrl(section.imageUrl)
          };
        }
        return section;
      }) || [],
      footer: data.footer
    };
    
    const rendered = compiledTemplate(templateData);
    
    return rendered;
  } catch (error) {
    throw new Error(`Template rendering failed: ${error.message}`);
  }
};
