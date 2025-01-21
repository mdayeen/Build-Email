import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmail } from '../context/EmailContext';
import emailTemplate from '../assets/email-template.jpg';
import { 
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Menu,
  Container,
  ListItemIcon,
  useTheme,
  useMediaQuery,
  Paper
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CalendarToday as CalendarIcon,
  GridView as GridViewIcon,
  ViewList as ListViewIcon,
  MoreVert as MoreVertIcon,
  Download as DownloadIcon
} from '@mui/icons-material';

const Dashboard = () => {
  console.log('Rendering Dashboard...');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { 
    templates, 
    loading, 
    fetchTemplates, 
    deleteTemplate,
    downloadTemplate 
  } = useEmail();
  
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

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        console.log('Fetching templates...');
        await fetchTemplates();
        console.log('Templates fetched successfully');
      } catch (err) {
        console.error('Error loading templates:', err);
        showNotification('Failed to load templates', 'error');
      }
    };
    loadTemplates();
  }, [fetchTemplates]);

  const showNotification = (message, severity = 'success') => {
    setNotification({ open: true, message, severity });
  };

  const handleCreateNew = () => {
    navigate('/editor');
  };

  const handleUseTemplate = () => {
    // Create a new template with professional promotional content
    const exampleTemplate = {
      title: "Summer Sale Promotion",
      sections: [
        // Header image section
        {
          type: "image",
          imageUrl: "https://c.ndtvimg.com/2022-05/ntucqbc_fashion-650_625x300_02_May_22.jpg",
          styles: {
            width: "100%",
            padding: "0",
            backgroundColor: "#ffffff"
          }
        },
        // Main headline
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
        // Subheadline
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
        // Feature section 1
        {
          type: "text",
          content: `
            <div style='background-color: #f8fafc; border-radius: 8px; margin: 0 20px;'>
              <h2 style='margin: 0; font-size: 24px; color: #2563eb;'>🔥 Flash Deals</h2>
              <p style='margin: 12px 0 0 0;'>Limited time offers on our best-selling items. Don't miss out!</p>
            </div>
          `,
          styles: {
            fontSize: "16px",
            color: "#334155",
            textAlign: "left",
            padding: "24px",
            backgroundColor: "#ffffff"
          }
        },
        // Primary CTA
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
        },
        // Feature section 2
        {
          type: "text",
          content: `
            <div style='border: 1px solid #e2e8f0; border-radius: 8px; margin: 0 20px;'>
              <h3 style='margin: 0; color: #1a1a1a;'>🎁 Exclusive Benefits</h3>
              <ul style='margin: 12px 0 0 0; padding-left: 20px; color: #334155;'>
                <li>Free shipping on orders over $50</li>
                <li>Early access to new arrivals</li>
                <li>Special member discounts</li>
              </ul>
            </div>
          `,
          styles: {
            fontSize: "16px",
            color: "#334155",
            textAlign: "left",
            padding: "24px",
            backgroundColor: "#ffffff"
          }
        },
        // Secondary CTA
        {
          type: "button",
          content: "Join Member Program",
          link: "https://example.com/membership",
          styles: {
            fontSize: "16px",
            color: "#2563eb",
            backgroundColor: "#ffffff",
            textAlign: "center",
            padding: "12px 24px",
            borderRadius: "8px",
            width: "auto",
          }
        },
        // Social proof
        {
          type: "text",
          content: "⭐️⭐️⭐️⭐️⭐️<br>\"Best summer collection I've seen\" - Fashion Weekly",
          styles: {
            fontSize: "16px",
            color: "#666666",
            textAlign: "center",
            padding: "32px 20px",
            backgroundColor: "#ffffff"
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
    event.stopPropagation();
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
    console.log('Current templates:', templates);
    if (!Array.isArray(templates)) {
      console.log('Templates is not an array:', templates);
      return [];
    }
    
    const filtered = templates.filter(template =>
      template.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    console.log('Filtered templates:', filtered);

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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Template Creation Section */}
      
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
          onClick={handleCreateNew}
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
          onClick={handleUseTemplate}
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

          {/* handleUseTemplate handleCreateNew */}
      {/* Search and Filters */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Box display="flex" gap={2} flexWrap="wrap">
          <TextField
            fullWidth
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />,
              sx: { borderRadius: 2 }
            }}
            sx={{ flex: 1, minWidth: { xs: '100%', sm: 'auto' } }}
          />
          
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            sx={{ 
              minWidth: 150,
              borderRadius: 2,
              width: { xs: '100%', sm: 'auto' }
            }}
          >
            <MenuItem value="updatedAt">Last Updated</MenuItem>
            <MenuItem value="title">Title</MenuItem>
          </Select>
          
          <Button
            variant="outlined"
            onClick={() => setViewMode(v => v === 'grid' ? 'list' : 'grid')}
            startIcon={viewMode === 'grid' ? <ListViewIcon /> : <GridViewIcon />}
            sx={{ 
              borderRadius: 2,
              width: { xs: '100%', sm: 'auto' }
            }}
          >
            {viewMode === 'grid' ? 'List View' : 'Grid View'}
          </Button>
        </Box>
      </Paper>

      {/* Templates Grid/List */}
      <Box
        display="grid"
        gap={3}
        gridTemplateColumns={{
          xs: '1fr',
          sm: viewMode === 'grid' ? 'repeat(auto-fill, minmax(280px, 1fr))' : '1fr'
        }}
      >
        {filteredAndSortedTemplates.length > 0 ? (
          filteredAndSortedTemplates.map((template) => (
            <Paper
              key={template._id}
              elevation={0}
              onClick={() => handleEdit(template._id)}
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
                  onClick={(e) => handleMenuOpen(e, template)}
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
              {searchTerm ? 'No templates match your search' : 'No templates yet'}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Keep existing Menu, Dialog, and Snackbar components */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => {
          handleMenuClose();
          handleEdit(selectedTemplate?._id);
        }}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          Edit
        </MenuItem>
        <MenuItem onClick={() => handleDownload(selectedTemplate)}>
          <ListItemIcon>
            <DownloadIcon fontSize="small" />
          </ListItemIcon>
          Download
        </MenuItem>
        <MenuItem onClick={() => handleDeleteClick(selectedTemplate)}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <Typography color="error">Delete</Typography>
        </MenuItem>
      </Menu>

      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, templateId: null })}
      >
        <DialogTitle>Delete Template</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this template? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialog({ open: false, templateId: null })}
            color="inherit"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Dashboard;