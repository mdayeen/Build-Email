import React from 'react';
import {
  Box,
  Paper,
  Button,
  IconButton,
  TextField,
} from '@mui/material';
import {
  Image as ImageIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import ReactQuill from 'react-quill';
import StyleControls from './StyleControls';
import { SECTION_TYPES } from './constants';

const Section = ({
  section,
  index,
  onUpdate,
  onStyleChange,
  onImageChange,
  onLinkChange,
  onDelete,
  expandedStyles,
  onAccordionChange,
}) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider' }}>
        {/* Section Content */}
        <Box mb={2}>
          {section.type === SECTION_TYPES.TEXT && (
            <ReactQuill
              value={section.content}
              onChange={(content) => onUpdate(index, content)}
              theme="snow"
            />
          )}
          
          {section.type === SECTION_TYPES.IMAGE && (
            <Box textAlign="center">
              {section.imageUrl ? (
                <img
                  src={section.imageUrl}
                  alt="Section"
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
              ) : (
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<ImageIcon />}
                >
                  Upload Image
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => onImageChange(index, e.target.files[0])}
                  />
                </Button>
              )}
            </Box>
          )}
          
          {section.type === SECTION_TYPES.BUTTON && (
            <Box>
              <TextField
                fullWidth
                label="Button Text"
                value={section.content}
                onChange={(e) => onUpdate(index, e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Button Link"
                value={section.link || ''}
                onChange={(e) => onLinkChange(index, e.target.value)}
              />
            </Box>
          )}
        </Box>

        {/* Style Controls */}
        <StyleControls
          section={section}
          index={index}
          onStyleChange={onStyleChange}
          expanded={expandedStyles.includes(index)}
          onAccordionChange={onAccordionChange}
        />

        {/* Section Actions */}
        <Box display="flex" justifyContent="flex-end" gap={1} mt={2}>
          <IconButton
            size="small"
            onClick={() => onDelete(index)}
            color="error"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </Paper>
    </Box>
  );
};

export default Section;
