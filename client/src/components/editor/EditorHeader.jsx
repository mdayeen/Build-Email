import React from 'react';
import {
  Box,
  TextField,
  Button,
  Alert,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
} from '@mui/icons-material';

const EditorHeader = ({
  title,
  errors,
  onTitleChange,
  onSave,
  onCancel,
}) => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <TextField
          error={!!errors.title}
          helperText={errors.title}
          value={title}
          onChange={onTitleChange}
          placeholder="Template Title"
          variant="outlined"
          fullWidth
          sx={{ "& .MuiOutlinedInput-root": { fontSize: "1.5rem" } }}
        />
        <Box sx={{ display: "flex", gap: 2, ml: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={onCancel}
            color="inherit"
          >
            Cancel
          </Button>
          <Button
            startIcon={<SaveIcon />}
            onClick={onSave}
            variant="contained"
            color="primary"
          >
            Save
          </Button>
        </Box>
      </Box>

      {/* Error Alerts */}
      {Object.entries(errors).map(
        ([key, error]) =>
          error && (
            <Alert severity="error" sx={{ mb: 2 }} key={key}>
              {error}
            </Alert>
          )
      )}
    </>
  );
};

export default EditorHeader;
