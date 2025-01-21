// middlewares/validateRequest.js

// Validate email template creation/update
export const validateEmailTemplate = (req, res, next) => {
    const { title, sections } = req.body;
    const errors = [];

    // Validate title
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
        errors.push('Title is required and must be a non-empty string');
    }

    // Validate sections
    if (!Array.isArray(sections)) {
        errors.push('Sections must be an array');
    } else {
        sections.forEach((section, index) => {
            if (!section.type) {
                errors.push(`Section ${index}: type is required`);
            } else if (!['text', 'image', 'button'].includes(section.type)) {
                errors.push(`Section ${index}: invalid type. Must be text, image, or button`);
            }

            // Validate content based on type
            if (section.type === 'text' && (!section.content || typeof section.content !== 'string')) {
                errors.push(`Section ${index}: content is required for text sections`);
            }
            if (section.type === 'image' && (!section.imageUrl || typeof section.imageUrl !== 'string')) {
                errors.push(`Section ${index}: imageUrl is required for image sections`);
            }
            if (section.type === 'button') {
                if (!section.content || typeof section.content !== 'string') {
                    errors.push(`Section ${index}: content (button text) is required for button sections`);
                }
                if (!section.link || typeof section.link !== 'string') {
                    errors.push(`Section ${index}: link is required for button sections`);
                }
            }
        });
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    next();
};

// Validate render template request
export const validateRenderRequest = (req, res, next) => {
    const { data } = req.body;
    
    if (!data || typeof data !== 'object') {
        return res.status(400).json({
            errors: ['Request body must contain a data object']
        });
    }

    next();
};
