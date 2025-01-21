import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { EmailProvider } from './context/EmailContext';

const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Editor = React.lazy(() => import('./pages/Editor'));

const App = () => {
  
  return (
   
    <BrowserRouter>
      <EmailProvider>
        <div className="min-h-screen bg-gray-50">
          <React.Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
              <div className="w-8 h-8 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
            </div>
          }>
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/editor/:id?" element={<Editor />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </React.Suspense>
        </div>
      </EmailProvider>
    </BrowserRouter>
    
  );
};

export default App;