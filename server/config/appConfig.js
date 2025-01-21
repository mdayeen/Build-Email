// config/appConfig.js

export const config = {
    // Server settings
    port: process.env.PORT || 8000,
    nodeEnv: process.env.NODE_ENV || 'development',
    
    // MongoDB settings
    mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/emailbuilder',
    
    // Upload settings
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/gif'],
    
    // Template settings
    maxSections: 20,
    defaultStyles: {
        fontSize: '16px',
        color: '#000000',
        backgroundColor: '#ffffff',
        padding: '10px'
    }
};
