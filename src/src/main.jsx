import React from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes.jsx';
import './app.css';
const root = createRoot(document.getElementById('root'));
root.render(<RouterProvider router={router} />);
