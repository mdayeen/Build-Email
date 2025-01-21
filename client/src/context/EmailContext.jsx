import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from "react";
import axios from "axios";

const EmailContext = createContext();

const initialState = {
  templates: [],
  currentTemplate: null,
  loading: false,
  error: null,
};

const emailReducer = (state, action) => {
  switch (action.type) {
    case "SET_ERROR":
      return { 
        ...state, 
        error: {
          message: action.payload.message,
          type: action.payload.type,
          details: action.payload.details
        }, 
        loading: false 
      };
    case "SET_LOADING":
      return { ...state, loading: action.payload, error: null };
    case "SET_TEMPLATES":
      return {
        ...state,
        templates: action.payload || [],
        loading: false,
        error: null,
      };
    case "SET_CURRENT_TEMPLATE":
      return {
        ...state,
        currentTemplate: action.payload,
        loading: false,
        error: null,
      };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "UPDATE_SECTION":
      const updatedTemplate = {
        ...state.currentTemplate,
        sections: state.currentTemplate.sections.map((section, index) =>
          index === action.payload.index
            ? { ...section, ...action.payload.updates }
            : section
        ),
      };
      return { ...state, currentTemplate: updatedTemplate };
    default:
      return state;
  }
};

const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error
    return {
      message: error.response.data.message || 'Server error occurred',
      type: 'api',
      details: error.response.data
    };
  } else if (error.request) {
    // Request made but no response
    return {
      message: 'Unable to connect to server',
      type: 'network',
      details: error.request
    };
  } else {
    // Error in request setup
    return {
      message: error.message || 'An unexpected error occurred',
      type: 'client',
      details: error
    };
  }
};

export const EmailProvider = ({ children }) => {
  const [state, dispatch] = useReducer(emailReducer, initialState);
  const apiUrl = import.meta.env.VITE_API_URL;

  // console.log("API URL:", apiUrl);
  // Debugging line
  const fetchTemplates = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await axios.get(`${apiUrl}/templates`);
      if (response.data.success) {
        dispatch({ type: "SET_TEMPLATES", payload: response.data.data });
      } else {
        throw new Error(response.data.message || 'Failed to fetch templates');
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
      dispatch({ 
        type: "SET_ERROR", 
        payload: handleApiError(error)
      });
      throw error;
    }
  }, [apiUrl]);
  

  const fetchTemplate = useCallback(
    async (id) => {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const response = await axios.get(`${apiUrl}/templates/${id}`);
        if (response.data.success) {
          dispatch({
            type: "SET_CURRENT_TEMPLATE",
            payload: response.data.data
          });
        } else {
          throw new Error(response.data.message || 'Failed to fetch template');
        }
      } catch (error) {
        console.error("Error fetching template:", error);
        dispatch({ type: "SET_ERROR", payload: handleApiError(error) });
        throw error;
      }
    },
    [apiUrl]
  );

  const createTemplate = async (template) => {
    dispatch({ type: "SET_LOADING", payload: true });
    console.log("createTemplate hit", "template:", template);
    try {
      const response = await axios.post(`${apiUrl}/templates`, template);
      await fetchTemplates();
      return response.data.template;
    } catch (error) {
      console.error("Error creating template:", error);
      dispatch({ type: "SET_ERROR", payload: error.message });
      throw error;
    }
  };

  const updateTemplate = async (id, updates) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      await axios.put(`${apiUrl}/templates/${id}`, updates);
      await fetchTemplate(id);
    } catch (error) {
      console.error("Error updating template:", error);
      dispatch({ type: "SET_ERROR", payload: error.message });
      throw error;
    }
  };

  const deleteTemplate = async (id) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      await axios.delete(`${apiUrl}/templates/${id}`);
      await fetchTemplates();
    } catch (error) {
      console.error("Error deleting template:", error);
      dispatch({ type: "SET_ERROR", payload: error.message });
      throw error;
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    try {
      const response = await axios.post(`${apiUrl}/images/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.imageUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      dispatch({ type: "SET_ERROR", payload: error.message });
      throw error;
    }
  };

  const downloadTemplate = useCallback(async (templateData) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await axios({
        url: `${apiUrl}/templates/download`,
        method: 'POST',
        data: { data: templateData },
        responseType: 'blob'
      });
      
      // Create a blob from the response data
      const blob = new Blob([response.data], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = 'email-template.html';
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      dispatch({ type: "SET_LOADING", payload: false });
    } catch (error) {
      console.error("Error downloading template:", error);
      dispatch({ type: "SET_ERROR", payload: handleApiError(error) });
      throw error;
    }
  }, [apiUrl]);

  const value = {
    ...state,
    fetchTemplates,
    fetchTemplate,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    uploadImage,
    downloadTemplate,
    dispatch,
  };

  return (
    <EmailContext.Provider value={value}>{children}</EmailContext.Provider>
  );
};

export const useEmail = () => {
  const context = useContext(EmailContext);
  if (!context) {
    throw new Error("useEmail must be used within an EmailProvider");
  }
  return context;
};
