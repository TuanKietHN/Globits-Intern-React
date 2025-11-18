import React from 'react';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import { 
  People as StaffIcon, 
  Business as DepartmentIcon,
  Public as CountryIcon,
  Schedule as TimeSheetIcon 
} from '@mui/icons-material';

const DashboardCard = ({ title, value, icon, color }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography color="textSecondary" gutterBottom variant="h6">
            {title}
          </Typography>
          <Typography variant="h3" component="h2">
            {value}
          </Typography>
        </Box>
        <Box sx={{ color: color, fontSize: 40 }}>
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

export default function Home() {
  const stats = [
    { title: 'Total Staff', value: '156', icon: <StaffIcon />, color: '#1976d2' },
    { title: 'Departments', value: '12', icon: <DepartmentIcon />, color: '#388e3c' },
    { title: 'Countries', value: '195', icon: <CountryIcon />, color: '#f57c00' },
    { title: 'TimeSheets', value: '1,234', icon: <TimeSheetIcon />, color: '#7b1fa2' },
  ];

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body1" color="textSecondary" gutterBottom>
        Welcome to Globits HR Management System
      </Typography>
      
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <DashboardCard {...stat} />
          </Grid>
        ))}
      </Grid>
      
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid item>
            <Typography variant="body2" color="textSecondary">
              • Manage employee records
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body2" color="textSecondary">
              • Track department structures
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body2" color="textSecondary">
              • Monitor timesheet submissions
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body2" color="textSecondary">
              • Generate HR reports
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}
