import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import AppShell from './shell/AppShell.jsx';
import Login from './pages/Login.jsx';
import Home from './pages/Home.jsx';
import Countries from './pages/Countries.jsx';
import Department from './pages/Department.jsx';
import Staff from './pages/Staff.jsx';
import TimeSheet from './pages/TimeSheet.jsx';
import { authStore } from './stores/AuthStore.js';

// Bỏ ProtectedRoute để không cần login vẫn dùng được
// const ProtectedRoute = ({ children }) => {
//   return authStore.isAuthenticated ? children : <Navigate to="/login" replace />;
// };

export const router = createBrowserRouter([
  { 
    path: '/', 
    element: <AppShell />, // Bỏ ProtectedRoute
    children: [
      { index: true, element: <Home /> },
      { path: 'countries', element: <Countries /> },
      { path: 'departments', element: <Department /> },
      { path: 'staff', element: <Staff /> },
      { path: 'timesheet', element: <TimeSheet /> },
    ]
  },
  // Login route vẫn giữ lại để có thể tích hợp sau
  { path: '/login', element: <Login /> },
  { path: '*', element: <Navigate to="/" replace /> }
], { future: { v7_relativeSplatPath: true, v7_startTransition: true } });
