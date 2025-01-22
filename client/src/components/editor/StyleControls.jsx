import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Slider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Radio,
  RadioGroup,
  FormControlLabel,
  InputAdornment,
  Divider,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  FormatAlignLeft as FormatAlignLeftIcon,
  FormatAlignCenter as FormatAlignCenterIcon,
  FormatAlignRight as FormatAlignRightIcon,
} from '@mui/icons-material';

const StyleControls = ({ section, index, onStyleChange, expanded, onAccordionChange }) => {
  const handleChange = (property, value) => {
    onStyleChange(index, property, value);
  };

  return (
    <Accordion 
      expanded={expanded}
      onChange={() => onAccordionChange(index)}
      sx={{ '&.Mui-expanded': { margin: '0' } }}
    >
      <AccordionSummary 
        expandIcon={<ExpandMoreIcon />}
        sx={{ 
          minHeight: '48px',
          '&.Mui-expanded': { minHeight: '48px' },
          '& .MuiAccordionSummary-content.Mui-expanded': { margin: '12px 0' }
        }}
      >
        <Typography>Styling Options</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Text Alignment */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Text Alignment
            </Typography>
            <RadioGroup
              row
              value={section.styles?.textAlign || 'left'}
              onChange={(e) => handleChange('textAlign', e.target.value)}
            >
              <FormControlLabel
                value="left"
                control={<Radio size="small" />}
                label={<FormatAlignLeftIcon />}
              />
              <FormControlLabel
                value="center"
                control={<Radio size="small" />}
                label={<FormatAlignCenterIcon />}
              />
              <FormControlLabel
                value="right"
                control={<Radio size="small" />}
                label={<FormatAlignRightIcon />}
              />
            </RadioGroup>
          </Box>

          {/* Colors */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Colors
            </Typography>
            <Box display="flex" gap={2}>
              <TextField
                label="Text Color"
                type="color"
                value={section.styles?.color || '#000000'}
                onChange={(e) => handleChange('color', e.target.value)}
                sx={{ width: '100px' }}
              />
              <TextField
                label="Background"
                type="color"
                value={section.styles?.backgroundColor || '#ffffff'}
                onChange={(e) => handleChange('backgroundColor', e.target.value)}
                sx={{ width: '100px' }}
              />
            </Box>
          </Box>

          {/* Font Size */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Font Size
            </Typography>
            <Box display="flex" gap={2} alignItems="center">
              <Slider
                value={parseInt(section.styles?.fontSize) || 16}
                min={12}
                max={40}
                onChange={(_, value) => handleChange('fontSize', `${value}px`)}
                sx={{ flex: 1 }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ minWidth: 30 }}>
                {parseInt(section.styles?.fontSize) || 16}px
              </Typography>
            </Box>
          </Box>

          {/* Padding */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Padding
            </Typography>
            <Box display="flex" gap={2}>
              <TextField
                label="Padding"
                type="number"
                value={parseInt(section.styles?.padding) || 20}
                onChange={(e) => handleChange('padding', `${e.target.value}px`)}
                InputProps={{
                  endAdornment: <InputAdornment position="end">px</InputAdornment>,
                }}
                size="small"
              />
            </Box>
          </Box>

          {/* Button-specific styles */}
          {section.type === 'button' && (
            <>
              <Divider />
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Button Styles
                </Typography>
                <Box display="flex" flexDirection="column" gap={2}>
                  <TextField
                    label="Border Radius"
                    type="number"
                    value={parseInt(section.styles?.borderRadius) || 4}
                    onChange={(e) => handleChange('borderRadius', `${e.target.value}px`)}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">px</InputAdornment>,
                    }}
                    size="small"
                  />
                  <Box display="flex" gap={2}>
                    <TextField
                      label="Horizontal Padding"
                      type="number"
                      value={parseInt(section.styles?.padding?.split(' ')[1]) || 24}
                      onChange={(e) => {
                        const verticalPadding = parseInt(section.styles?.padding?.split(' ')[0]) || 12;
                        handleChange('padding', `${verticalPadding}px ${e.target.value}px`);
                      }}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">px</InputAdornment>,
                      }}
                      size="small"
                    />
                    <TextField
                      label="Vertical Padding"
                      type="number"
                      value={parseInt(section.styles?.padding?.split(' ')[0]) || 12}
                      onChange={(e) => {
                        const horizontalPadding = parseInt(section.styles?.padding?.split(' ')[1]) || 24;
                        handleChange('padding', `${e.target.value}px ${horizontalPadding}px`);
                      }}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">px</InputAdornment>,
                      }}
                      size="small"
                    />
                  </Box>
                </Box>
              </Box>
            </>
          )}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default StyleControls;
