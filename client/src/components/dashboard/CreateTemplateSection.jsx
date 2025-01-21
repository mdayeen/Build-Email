import React from 'react';
import { Box, Card, Typography } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import emailTemplate from '../../assets/email-template.jpg';

const CreateTemplateSection = ({ onCreateNew, onUseTemplate }) => {
  return (
    <Box sx={{ width: '100%', maxWidth: '1200px', p: 3 }}>
      <Typography 
        variant="h2" 
        sx={{ 
          fontSize: '2.5rem', 
          fontWeight: 'bold', 
          color: '#6200ee',
          mb: 4 
        }}
      >
        Create Templates
      </Typography>

      <Box 
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          gap: 3,
          maxWidth: '800px'
        }}
      >
        {/* Create From Blank Card */}
        <Card
          onClick={onCreateNew}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '300px',
            cursor: 'pointer',
            border: '2px solid #6200ee',
            borderRadius: 2,
            transition: 'transform 0.2s, box-shadow 0.2s',
            backgroundColor: 'transparent',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: 3
            }
          }}
        >
          <AddIcon 
            sx={{ 
              fontSize: 80, 
              color: '#6200ee',
              mb: 2 
            }} 
          />
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 'bold',
              color: '#000' 
            }}
          >
            Create From Blank
          </Typography>
        </Card>

        {/* Create From Template Card */}
        <Card
          onClick={onUseTemplate}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '300px',
            cursor: 'pointer',
            border: '1px solid #e0e0e0',
            borderRadius: 2,
            transition: 'transform 0.2s, box-shadow 0.2s',
            position: 'relative',
            overflow: 'hidden',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: 3
            }
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `url(${emailTemplate})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'brightness(0.9)'
            }}
          />
          <Box
            sx={{
              position: 'relative',
              zIndex: 1,
              textAlign: 'center'
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 'bold',
                color: '#000',
                backgroundColor: 'white',
                px: 2,
                py: 1,
                borderRadius: 1
              }}
            >
              Create From Template
            </Typography>
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default CreateTemplateSection;
