import React from 'react';
import { Box, Paper } from '@mui/material';

const Preview = ({ template }) => {
  // Base styles matching the template
  const baseStyles = {
    body: {
      margin: 0,
      padding: 0,
      fontFamily: 'Arial, sans-serif',
    },
    container: {
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
    },
    section: {
      marginBottom: '20px',
    },
    img: {
      maxWidth: '100%',
      height: 'auto',
    },
    footer: {
      marginTop: '30px',
      paddingTop: '20px',
      borderTop: '1px solid #eee',
      textAlign: 'center',
      color: '#666',
    }
  };

  const renderSection = (section) => {
    switch (section.type) {
      case 'text':
        return (
          <div
            style={{
              ...baseStyles.section,
              ...section.styles
            }}
            dangerouslySetInnerHTML={{ __html: section.content }}
          />
        );
      
      case 'image':
        return section.imageUrl ? (
          <div style={baseStyles.section}>
            <img
              src={section.imageUrl}
              alt="Email content"
              style={{
                ...baseStyles.img,
                ...section.styles
              }}
            />
          </div>
        ) : (
          <div style={{
            ...baseStyles.section,
            backgroundColor: '#f3f4f6',
            padding: '20px',
            textAlign: 'center',
            color: '#666'
          }}>
            No image uploaded
          </div>
        );
      
      case 'button':
        const buttonStyles = {
          display: 'inline-block',
          textDecoration: 'none',
          backgroundColor: section.styles?.backgroundColor || '#2563eb',
          color: section.styles?.color || '#ffffff',
          padding: section.styles?.padding || '12px 24px',
          borderRadius: section.styles?.borderRadius || '4px',
          fontSize: section.styles?.fontSize || '16px',
          textAlign: 'center',
          cursor: 'pointer',
          border: 'none',
          ...section.styles
        };

        return (
          <div style={{
            ...baseStyles.section,
            textAlign: section.styles?.textAlign || 'center'
          }}>
            <a
              href={section.link}
              target="_blank"
              rel="noopener noreferrer"
              style={buttonStyles}
            >
              {section.content}
            </a>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <Paper 
      elevation={0}
      sx={{
        backgroundColor: 'white',
        overflow: 'auto',
        height: '100%'
      }}
    >
      <Box sx={baseStyles.body}>
        <Box sx={baseStyles.container}>
          <h1 style={{ 
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '20px',
            color: '#333'
          }}>
            {template.title}
          </h1>
          
          {template.sections.map((section, index) => (
            <div key={index}>
              {renderSection(section)}
            </div>
          ))}
          
          {template.footer && (
            <div 
              style={baseStyles.footer}
              dangerouslySetInnerHTML={{ __html: template.footer }}
            />
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default Preview;