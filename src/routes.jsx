import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import AppShell from './shell/App.jsx';
import Home from './pages/Home.jsx';
import Countries from './pages/Countries.jsx';
export const router = createBrowserRouter([
  { path: '/', element: <AppShell />, children: [
    { index: true, element: <Home /> },
    { path: 'countries', element: <Countries /> },
  ]}
], { future: { v7_relativeSplatPath: true, v7_startTransition: true } });
