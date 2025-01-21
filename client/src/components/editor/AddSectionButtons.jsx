import React from 'react';
import {
  Box,
  Button,
  Grid,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Image as ImageIcon,
  Link as LinkIcon,
} from '@mui/icons-material';
import { SECTION_TYPES } from './constants';

const AddSectionButtons = ({ onAddSection }) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Grid container spacing={2}>
        <Grid item>
          <Tooltip title="Add Text Section">
            <Button
              startIcon={<AddIcon />}
              onClick={() => onAddSection(SECTION_TYPES.TEXT)}
              variant="outlined"
            >
              Add Text
            </Button>
          </Tooltip>
        </Grid>
        <Grid item>
          <Tooltip title="Add Image Section">
            <Button
              startIcon={<ImageIcon />}
              onClick={() => onAddSection(SECTION_TYPES.IMAGE)}
              variant="outlined"
            >
              Add Image
            </Button>
          </Tooltip>
        </Grid>
        <Grid item>
          <Tooltip title="Add Button Section">
            <Button
              startIcon={<LinkIcon />}
              onClick={() => onAddSection(SECTION_TYPES.BUTTON)}
              variant="outlined"
            >
              Add Button
            </Button>
          </Tooltip>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AddSectionButtons;
