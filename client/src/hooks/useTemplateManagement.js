import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmail } from '../context/EmailContext';

export const useTemplateManagement = () => {
  const navigate = useNavigate();
  const { templates, loading, fetchTemplates, deleteTemplate, downloadTemplate } = useEmail();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('updatedAt');
  const [viewMode, setViewMode] = useState('grid');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, templateId: null });
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const showNotification = (message, severity = 'success') => {
    setNotification({ open: true, message, severity });
  };

  const handleCreateNew = () => {
    navigate('/editor');
  };

  const handleUseTemplate = () => {
    const exampleTemplate = {
      title: "Summer Sale Promotion",
      sections: [
        {
          type: "image",
          imageUrl: "https://c.ndtvimg.com/2022-05/ntucqbc_fashion-650_625x300_02_May_22.jpg",
          styles: {
            width: "100%",
            padding: "0",
            backgroundColor: "#ffffff"
          }
        },
        {
          type: "text",
          content: "<h1 style='margin: 0;'>Summer Sale is Here! 🌞</h1>",
          styles: {
            fontSize: "32px",
            color: "#1a1a1a",
            textAlign: "center",
            padding: "32px 20px 16px 20px",
            backgroundColor: "#ffffff"
          }
        },
        {
          type: "text",
          content: "Get up to 50% off on all premium products",
          styles: {
            fontSize: "20px",
            color: "#666666",
            textAlign: "center",
            padding: "0 20px 32px 20px",
            backgroundColor: "#ffffff"
          }
        },
        {
          type: "button",
          content: "Shop Now",
          link: "https://example.com/summer-sale",
          styles: {
            fontSize: "18px",
            color: "#ffffff",
            backgroundColor: "#2563eb",
            textAlign: "center",
            padding: "16px 32px",
            borderRadius: "8px",
            width: "auto"
          }
        }
      ],
      footer: `
        © 2025 Your Brand Name. All rights reserved.<br>
        You received this email because you subscribed to our newsletter.<br>
        <a href="#" style="color: #2563eb;">Unsubscribe</a> | <a href="#" style="color: #2563eb;">Privacy Policy</a>
      `
    };
  
    navigate('/editor', { state: { template: exampleTemplate } });
  };

  const handleEdit = (id) => navigate(`/editor/${id}`);

  const handleMenuOpen = (event, template) => {
    setAnchorEl(event.currentTarget);
    setSelectedTemplate(template);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTemplate(null);
  };

  const handleDeleteClick = (template) => {
    handleMenuClose();
    setDeleteDialog({ open: true, templateId: template._id });
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteTemplate(deleteDialog.templateId);
      showNotification('Template deleted successfully');
    } catch (err) {
      console.error('Error deleting template:', err);
      showNotification('Failed to delete template', 'error');
    } finally {
      setDeleteDialog({ open: false, templateId: null });
    }
  };

  const handleDownload = async (template) => {
    try {
      await downloadTemplate(template);
      showNotification('Template downloaded successfully');
    } catch (err) {
      showNotification('Failed to download template', 'error');
    }
  };

  const filteredAndSortedTemplates = useMemo(() => {
    if (!Array.isArray(templates)) {
      return [];
    }
    
    const filtered = templates.filter(template =>
      template.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return [...filtered].sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });
  }, [templates, searchTerm, sortBy]);

  const getRelativeTime = (date) => {
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days < 1) return 'Today';
    if (days < 30) return rtf.format(-days, 'day');
    const months = Math.floor(days / 30);
    if (months < 12) return rtf.format(-months, 'month');
    return rtf.format(-Math.floor(months / 12), 'year');
  };

  return {
    loading,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    viewMode,
    setViewMode,
    deleteDialog,
    setDeleteDialog,
    anchorEl,
    selectedTemplate,
    notification,
    setNotification,
    filteredAndSortedTemplates,
    handleCreateNew,
    handleUseTemplate,
    handleEdit,
    handleMenuOpen,
    handleMenuClose,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDownload,
    getRelativeTime
  };
};
