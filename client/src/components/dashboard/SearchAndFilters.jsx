import React from 'react';
import { Box, TextField, Select, MenuItem, Button, Paper } from '@mui/material';
import { Search as SearchIcon, GridView as GridViewIcon, ViewList as ListViewIcon } from '@mui/icons-material';

const SearchAndFilters = ({ searchTerm, sortBy, viewMode, onSearchChange, onSortChange, onViewModeChange }) => {
  return (
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
          onChange={(e) => onSearchChange(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />,
            sx: { borderRadius: 2 }
          }}
          sx={{ flex: 1, minWidth: { xs: '100%', sm: 'auto' } }}
        />
        
        <Select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
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
          onClick={() => onViewModeChange(viewMode === 'grid' ? 'list' : 'grid')}
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
  );
};

export default SearchAndFilters;
