import React, { useEffect } from 'react';
import { Box, CircularProgress, Container } from '@mui/material';
import { useEmail } from '../context/EmailContext';
import { useTemplateManagement } from '../hooks/useTemplateManagement';
import CreateTemplateSection from '../components/dashboard/CreateTemplateSection';
import SearchAndFilters from '../components/dashboard/SearchAndFilters';
import TemplateList from '../components/dashboard/TemplateList';
import TemplateActions from '../components/dashboard/TemplateActions';

const Dashboard = () => {
  const { fetchTemplates } = useEmail();
  const {
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
  } = useTemplateManagement();

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        console.log('Fetching templates...');
        await fetchTemplates();
        console.log('Templates fetched successfully');
      } catch (err) {
        console.error('Error loading templates:', err);
        setNotification({
          open: true,
          message: 'Failed to load templates',
          severity: 'error'
        });
      }
    };
    loadTemplates();
  }, [fetchTemplates, setNotification]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <CreateTemplateSection
        onCreateNew={handleCreateNew}
        onUseTemplate={handleUseTemplate}
      />

      <SearchAndFilters
        searchTerm={searchTerm}
        sortBy={sortBy}
        viewMode={viewMode}
        onSearchChange={setSearchTerm}
        onSortChange={setSortBy}
        onViewModeChange={setViewMode}
      />

      <TemplateList
        templates={filteredAndSortedTemplates}
        viewMode={viewMode}
        onTemplateClick={handleEdit}
        onMenuOpen={handleMenuOpen}
        getRelativeTime={getRelativeTime}
      />

      <TemplateActions
        anchorEl={anchorEl}
        selectedTemplate={selectedTemplate}
        onMenuClose={handleMenuClose}
        onEdit={handleEdit}
        onDownload={handleDownload}
        onDelete={handleDeleteClick}
        deleteDialog={deleteDialog}
        onDeleteDialogClose={() => setDeleteDialog({ open: false, templateId: null })}
        onDeleteConfirm={handleDeleteConfirm}
        notification={notification}
        onNotificationClose={() => setNotification({ ...notification, open: false })}
      />
    </Container>
  );
};

export default Dashboard;