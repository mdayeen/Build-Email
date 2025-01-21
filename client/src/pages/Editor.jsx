import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEmail } from "../context/EmailContext";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Preview from "../components/Preview";
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  TextField,
  InputLabel,
  Snackbar,
  Alert,
  CircularProgress,
  Tooltip,
  Divider,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Slider,
  Radio,
  RadioGroup,
  FormControlLabel,
  InputAdornment,
} from "@mui/material";
import {
  Add as AddIcon,
  Image as ImageIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  ExpandMore as ExpandMoreIcon,
  FormatAlignLeft as FormatAlignLeftIcon,
  FormatAlignCenter as FormatAlignCenterIcon,
  FormatAlignRight as FormatAlignRightIcon,
  Link as LinkIcon,
} from "@mui/icons-material";

// Constants
const DEFAULT_STYLES = {
  fontSize: "16px",
  color: "#000000",
  textAlign: "left",
  backgroundColor: "#ffffff",
  padding: "20px",
  width: "100%",
  borderRadius: "0px",
  margin: "0px",
};

const BUTTON_DEFAULT_STYLES = {
  ...DEFAULT_STYLES,
  backgroundColor: "#2563eb",
  color: "#ffffff",
  padding: "12px 24px",
  borderRadius: "4px",
  width: "auto",
  textAlign: "center",
};

const SECTION_TYPES = {
  TEXT: "text",
  IMAGE: "image",
  BUTTON: "button",
};

const DEFAULT_TEMPLATE = {
  title: "",
  sections: [
    {
      type: SECTION_TYPES.TEXT,
      content: "Welcome to your new email template!",
      styles: {
        ...DEFAULT_STYLES,
        fontSize: "24px",
        textAlign: "center",
        padding: "20px",
      },
    },
    {
      type: SECTION_TYPES.TEXT,
      content: "Start editing this template by adding or modifying sections.",
      styles: {
        ...DEFAULT_STYLES,
        textAlign: "center",
        padding: "15px",
      },
    },
  ],
  footer: " 2025 Your Company. All rights reserved.",
};

const Editor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    currentTemplate,
    fetchTemplate,
    createTemplate,
    updateTemplate,
    uploadImage,
  } = useEmail();

  // State Management
  const [template, setTemplate] = useState({
    title: "",
    sections: [],
    footer: "",
  });
  const [localImages, setLocalImages] = useState({});
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({
    title: null,
    sections: null,
    general: null,
  });
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [expandedStyles, setExpandedStyles] = useState([]);

  // Template Validation
  const validateTemplate = (data) => {
    const newErrors = {};

    if (!data.title?.trim()) {
      newErrors.title = "Title is required";
    }

    if (!data.sections?.length) {
      newErrors.sections = "At least one section is required";
    }

    data.sections?.forEach((section, index) => {
      if (section.type === SECTION_TYPES.BUTTON && !section.link?.trim()) {
        newErrors.sections = `Button at position ${
          index + 1
        } requires a valid URL`;
      }
    });

    return newErrors;
  };

  // Template Loading
  useEffect(() => {
    const loadTemplate = async () => {
      try {
        setLoading(true);
        if (id) {
          await fetchTemplate(id);
        } else if (location.state?.template) {
          // Use the example template if provided
          setTemplate(location.state.template);
        } else {
          // Use default template for blank templates
          setTemplate(DEFAULT_TEMPLATE);
        }
      } catch (error) {
        showNotification("Error loading template", "error");
        showNotification(error.message, "error");
      } finally {
        setLoading(false);
      }
    };
    loadTemplate();
  }, [id, fetchTemplate, location.state]);

  useEffect(() => {
    if (currentTemplate && id) {
      // Only set currentTemplate if we're editing an existing template
      setTemplate(currentTemplate);
      setLoading(false);
    }
  }, [currentTemplate, id]);

  // Section Management
  const handleAddSection = (type) => {
    const newSection = {
      type,
      content: type === SECTION_TYPES.TEXT ? "New section content" : "",
      imageUrl: type === SECTION_TYPES.IMAGE ? "" : undefined,
      link: type === SECTION_TYPES.BUTTON ? "" : undefined,
      styles: type === SECTION_TYPES.BUTTON ? BUTTON_DEFAULT_STYLES : DEFAULT_STYLES,
    };
    setTemplate((prev) => ({
      ...prev,
      sections: [...prev.sections, newSection],
    }));
  };

  const handleTitleChange = (e) => {
    setTemplate((prev) => ({ ...prev, title: e.target.value }));
  };

  const handleSectionUpdate = (index, content) => {
    const updatedSections = [...template.sections];
    updatedSections[index] = { ...updatedSections[index], content };
    setTemplate((prev) => ({ ...prev, sections: updatedSections }));
  };

  const handleImageChange = async (index, file) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLocalImages((prev) => ({
          ...prev,
          [index]: {
            file,
            preview: reader.result,
          },
        }));

        const updatedSections = [...template.sections];
        updatedSections[index] = {
          ...updatedSections[index],
          imageUrl: reader.result,
        };
        setTemplate((prev) => ({ ...prev, sections: updatedSections }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStyleChange = (index, property, value) => {
    const updatedSections = [...template.sections];
    updatedSections[index] = {
      ...updatedSections[index],
      styles: {
        ...updatedSections[index].styles,
        [property]: value,
      },
    };
    setTemplate((prev) => ({ ...prev, sections: updatedSections }));
  };

  const handleLinkChange = (index, link) => {
    const updatedSections = [...template.sections];
    updatedSections[index] = {
      ...updatedSections[index],
      link,
    };
    setTemplate((prev) => ({ ...prev, sections: updatedSections }));
  };

  const handleFooterChange = (content) => {
    setTemplate((prev) => ({ ...prev, footer: content }));
  };

  const handleDeleteSection = (index) => {
    setTemplate((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index),
    }));
  };

  // Save Handling
  const handleSave = async () => {
    try {
      const validationErrors = validateTemplate(template);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        showNotification("Please fix all errors before saving", "error");
        return;
      }

      const templateToSubmit = { ...template };

      // Handle image uploads
      for (let i = 0; i < templateToSubmit.sections.length; i++) {
        const section = templateToSubmit.sections[i];
        if (section.type === SECTION_TYPES.IMAGE && localImages[i]) {
          const imageUrl = await uploadImage(localImages[i].file);
          templateToSubmit.sections[i] = { ...section, imageUrl };
        }
      }

      if (id) {
        await updateTemplate(id, templateToSubmit);
      } else {
        await createTemplate(templateToSubmit);
      }

      showNotification("Template saved successfully");
      navigate("/dashboard");
    } catch (error) {
      showNotification(error.response.data.message || "Failed to save template", "error");
    }
  };

  // UI Helper Functions
  const showNotification = (message, severity = "success") => {
    setNotification({ open: true, message, severity });
  };

  const handleAccordionChange = (index) => {
    setExpandedStyles(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  const StyleControls = ({ section, index, onStyleChange }) => {
    const handleChange = (property, value) => {
      onStyleChange(index, property, value);
    };

    return (
      <Accordion 
        expanded={expandedStyles.includes(index)}
        onChange={() => handleAccordionChange(index)}
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

  const renderSection = (section, index) => {
    return (
      <Box key={index} sx={{ mb: 3 }}>
        <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider' }}>
          {/* Section Content */}
          <Box mb={2}>
            {section.type === 'text' && (
              <ReactQuill
                value={section.content}
                onChange={(content) => handleSectionUpdate(index, content)}
                theme="snow"
              />
            )}
            
            {section.type === 'image' && (
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
                      onChange={(e) => handleImageChange(index, e.target.files[0])}
                    />
                  </Button>
                )}
              </Box>
            )}
            
            {section.type === 'button' && (
              <Box>
                <TextField
                  fullWidth
                  label="Button Text"
                  value={section.content}
                  onChange={(e) => handleSectionUpdate(index, e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Button Link"
                  value={section.link || ''}
                  onChange={(e) => handleLinkChange(index, e.target.value)}
                />
              </Box>
            )}
          </Box>

          {/* Style Controls */}
          <StyleControls
            section={section}
            index={index}
            onStyleChange={handleStyleChange}
          />

          {/* Section Actions */}
          <Box display="flex" justifyContent="flex-end" gap={1} mt={2}>
            <IconButton
              size="small"
              onClick={() => handleDeleteSection(index)}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Paper>
      </Box>
    );
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Editor Section */}
      <Box sx={{ width: "66.666%", p: 4, overflowY: "auto" }}>
        <Paper elevation={0} sx={{ p: 3, mb: 4 }}>
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
              value={template.title}
              onChange={handleTitleChange}
              placeholder="Template Title"
              variant="outlined"
              fullWidth
              sx={{ "& .MuiOutlinedInput-root": { fontSize: "1.5rem" } }}
            />
            <Box sx={{ display: "flex", gap: 2, ml: 2 }}>
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate("/dashboard")}
                color="inherit"
              >
                Cancel
              </Button>
              <Button
                startIcon={<SaveIcon />}
                onClick={handleSave}
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

          {/* Add Section Buttons */}
          <Box sx={{ mb: 4 }}>
            <Grid container spacing={2}>
              <Grid item>
                <Tooltip title="Add Text Section">
                  <Button
                    startIcon={<AddIcon />}
                    onClick={() => handleAddSection(SECTION_TYPES.TEXT)}
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
                    onClick={() => handleAddSection(SECTION_TYPES.IMAGE)}
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
                    onClick={() => handleAddSection(SECTION_TYPES.BUTTON)}
                    variant="outlined"
                  >
                    Add Button
                  </Button>
                </Tooltip>
              </Grid>
            </Grid>
          </Box>

          {/* Sections */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {template.sections.map((section, index) => renderSection(section, index))}
          </Box>

          {/* Footer Section */}
          <Paper sx={{ p: 3, mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Footer
            </Typography>
            <ReactQuill
              value={template.footer}
              onChange={handleFooterChange}
              theme="snow"
            />
          </Paper>
        </Paper>
      </Box>

      {/* Preview Section */}
      <Box
        sx={{
          width: "33.333%",
          bgcolor: "grey.50",
          p: 4,
          position: "fixed",
          right: 0,
          top: 0,
          height: "100vh",
          overflowY: "auto",
          borderLeft: 1,
          borderColor: "grey.200",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Preview
        </Typography>
        <Preview template={template} />
      </Box>

      {/* Notifications */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Editor;
