import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { AppBar, Toolbar, Typography } from '@mui/material';
export default function AppShell(){
  return (
    <div className="shell">
      <aside className="sidenav">
        <nav>
          <Link to="/">Home</Link>
          <Link to="/countries">Countries</Link>
        </nav>
      </aside>
      <main className="content">
        <div className="card">
          <AppBar position="static" color="transparent" elevation={0}>
            <Toolbar>
              <Typography variant="h6" sx={{color:'#2c2066'}}>Globits React (Vite)</Typography>
            </Toolbar>
          </AppBar>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
