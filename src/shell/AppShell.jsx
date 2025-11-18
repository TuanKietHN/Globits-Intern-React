import React from 'react';
import { observer } from 'mobx-react';
import { authStore } from '../stores/AuthStore.js';
import { AppBar, Toolbar, Typography, Button, Box, Drawer, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 240;

const AppShell = observer(() => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'Dashboard', path: '/' },
    { text: 'Countries', path: '/countries' },
    { text: 'Departments', path: '/departments' },
    { text: 'Staff', path: '/staff' },
    { text: 'TimeSheet', path: '/timesheet' },
  ];

  // Tạm thời bỏ logout và auth check để không cần login
  // const handleLogout = () => {
  //   authStore.logout();
  //   navigate('/login');
  // };

  // Bỏ auth check để luôn hiển thị giao diện
  // if (!authStore.isAuthenticated) {
  //   navigate('/login');
  //   return null;
  // }

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Globits HR System
          </Typography>
          {/* Tạm thời bỏ user info và logout button */}
          {/* <Typography variant="body2" sx={{ mr: 2 }}>
            Welcome, {authStore.user?.username || 'User'}
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button> */}
        </Toolbar>
      </AppBar>
      
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {menuItems.map((item) => (
              <ListItem 
                button 
                key={item.text}
                onClick={() => navigate(item.path)}
                selected={location.pathname === item.path}
              >
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          p: 3,
          overflow: 'auto',
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
});

export default AppShell;