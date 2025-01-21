import React from 'react';
import { Box, Paper, Typography, IconButton } from '@mui/material';
import { MoreVert as MoreVertIcon, CalendarToday as CalendarIcon } from '@mui/icons-material';

const TemplateList = ({ templates, viewMode, onTemplateClick, onMenuOpen, getRelativeTime }) => {
  return (
    <Box
      display="grid"
      gap={3}
      gridTemplateColumns={{
        xs: '1fr',
        sm: viewMode === 'grid' ? 'repeat(auto-fill, minmax(280px, 1fr))' : '1fr'
      }}
    >
      {templates.length > 0 ? (
        templates.map((template) => (
          <Paper
            key={template._id}
            elevation={0}
            onClick={() => onTemplateClick(template._id)}
            sx={{
              p: 3,
              cursor: 'pointer',
              transition: 'all 0.2s',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 2
              }
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
              <Typography variant="h6" fontWeight="500">
                {template.title}
              </Typography>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onMenuOpen(e, template);
                }}
              >
                <MoreVertIcon />
              </IconButton>
            </Box>
            <Box display="flex" alignItems="center" gap={1} mt={1} color="text.secondary">
              <CalendarIcon fontSize="small" />
              <Typography variant="body2">
                {getRelativeTime(template.updatedAt)}
              </Typography>
            </Box>
          </Paper>
        ))
      ) : (
        <Box textAlign="center" py={6} gridColumn="1/-1">
          <Typography color="text.secondary">
            {templates.searchTerm ? 'No templates match your search' : 'No templates yet'}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default TemplateList;
