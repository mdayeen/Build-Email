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
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";

// Import new components
import Section from "../components/editor/Section";
import EditorHeader from "../components/editor/EditorHeader";
import AddSectionButtons from "../components/editor/AddSectionButtons";
import { DEFAULT_TEMPLATE, SECTION_TYPES, DEFAULT_STYLES, BUTTON_DEFAULT_STYLES } from "../components/editor/constants";

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
        newErrors.sections = `Button at position ${index + 1} requires a valid URL`;
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
          setTemplate(location.state.template);
        } else {
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
      setTemplate(currentTemplate);
      setLoading(false);
    }
  }, [currentTemplate, id]);

  // Event Handlers
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

  const handleAccordionChange = (index) => {
    setExpandedStyles(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index];
      }
    });
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
          <EditorHeader
            title={template.title}
            errors={errors}
            onTitleChange={handleTitleChange}
            onSave={handleSave}
            onCancel={() => navigate("/dashboard")}
          />

          <AddSectionButtons onAddSection={handleAddSection} />

          {/* Sections */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {template.sections.map((section, index) => (
              <Section
                key={index}
                section={section}
                index={index}
                onUpdate={handleSectionUpdate}
                onStyleChange={handleStyleChange}
                onImageChange={handleImageChange}
                onLinkChange={handleLinkChange}
                onDelete={handleDeleteSection}
                expandedStyles={expandedStyles}
                onAccordionChange={handleAccordionChange}
              />
            ))}
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
