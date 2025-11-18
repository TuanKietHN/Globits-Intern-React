import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { observer } from 'mobx-react';
import { 
  TextField, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  CircularProgress, 
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography
} from '@mui/material';
import { apiService } from '../services/ApiService.js'; // Thay thế authStore

const API = import.meta.env.VITE_API || 'http://localhost:8071';

const mockTimeSheets = [
  {
    id: 1,
    staffId: 1,
    staffName: 'Nguyen Van A',
    projectId: 1,
    projectName: 'Website Development',
    taskName: 'Frontend Development',
    date: '2024-01-15',
    hours: 8,
    description: 'Implemented user authentication',
    status: 'APPROVED'
  },
  {
    id: 2,
    staffId: 2,
    staffName: 'Tran Thi B',
    projectId: 2,
    projectName: 'Mobile App',
    taskName: 'UI Design',
    date: '2024-01-15',
    hours: 7,
    description: 'Designed login screen',
    status: 'PENDING'
  }
];

const TimeSheet = observer(() => {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [staffList, setStaffList] = useState([]);
  const [projectList, setProjectList] = useState([]);
  
  const schema = Yup.object({ 
    staffId: Yup.number().required('Staff is required'),
    projectId: Yup.number().required('Project is required'),
    taskName: Yup.string().required('Task Name is required'),
    date: Yup.date().required('Date is required'),
    hours: Yup.number().min(0.5).max(24).required('Hours is required'),
    description: Yup.string(),
    status: Yup.string().required('Status is required')
  });
  
  const form = useFormik({ 
    initialValues: { 
      staffId: '',
      projectId: '',
      taskName: '',
      date: new Date().toISOString().split('T')[0],
      hours: 8,
      description: '',
      status: 'PENDING'
    }, 
    validationSchema: schema, 
    onSubmit: async (values) => {
      try {
        const payload = {
          ...values,
          staffId: parseInt(values.staffId),
          projectId: parseInt(values.projectId),
          hours: parseFloat(values.hours)
        };
        
        if (editing !== null) {
          await apiService.put(`/api/timesheet/${rows[editing].id}`, payload);
        } else {
          await apiService.post('/api/timesheet', payload);
        }
        setOpen(false);
        setEditing(null);
        fetchTimeSheets();
      } catch (error) {
        setError(error.message);
      }
    } 
  });

  const fetchTimeSheets = async () => {
    setLoading(true);
    setError(null);
    try {
      const [{ data: timeData }, { data: staffData }, { data: projectData }] = await Promise.all([
        apiService.post('/api/timesheet/searchByPage', 
          { pageIndex: 0, pageSize: 20, keyword }
        ),
        apiService.post('/api/staff/searchByPage', 
          { pageIndex: 0, pageSize: 100 }
        ),
        apiService.post('/api/project/searchByPage', 
          { pageIndex: 0, pageSize: 100 }
        )
      ]);
      
      setRows(timeSheetData?.content || []);
      setStaffList(staffData?.content || []);
      setProjectList(projectData?.content || []);
    } catch (error) {
      console.warn('API failed, using mock data:', error.message);
      setRows(mockTimeSheets);
      setStaffList([
        { id: 1, firstName: 'Nguyen', lastName: 'Van A' },
        { id: 2, firstName: 'Tran', lastName: 'Thi B' }
      ]);
      setProjectList([
        { id: 1, name: 'Website Development' },
        { id: 2, name: 'Mobile App' }
      ]);
      setError('Using mock data - API connection failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this time sheet entry?')) {
      try {
        await apiService.delete(`/api/timesheet/${id}`);
        fetchTimeSheets();
      } catch (error) {
        setError('Delete failed: ' + error.message);
      }
    }
  };

  useEffect(() => {
    fetchTimeSheets();
  }, [keyword]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED': return 'success';
      case 'PENDING': return 'warning';
      case 'REJECTED': return 'error';
      default: return 'default';
    }
  };

  const getTotalHours = () => {
    return rows.reduce((total, row) => total + row.hours, 0);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2>TimeSheet Management</h2>
        <Typography variant="h6" color="primary">
          Total Hours: {getTotalHours()}
        </Typography>
      </div>
      
      {error && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <div style={{display:'flex',gap:8,marginBottom:12}}>
        <TextField 
          size="small" 
          label="Search" 
          value={keyword} 
          onChange={e => setKeyword(e.target.value)} 
          placeholder="Search time sheets..."
        />
        <button 
          onClick={() => { 
            form.resetForm(); 
            setEditing(null); 
            setOpen(true); 
          }}
          style={{
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Add New TimeSheet
        </button>
      </div>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: '#f5f5f5' }}>
              <TableCell style={{ fontWeight: 'bold' }}>Staff</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Project</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Task</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Date</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Hours</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Description</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((r, i) => (
              <TableRow key={r.id}>
                <TableCell>
                  {staffList.find(s => s.id === r.staffId)?.firstName + ' ' + 
                   staffList.find(s => s.id === r.staffId)?.lastName || r.staffName}
                </TableCell>
                <TableCell>
                  {projectList.find(p => p.id === r.projectId)?.name || r.projectName}
                </TableCell>
                <TableCell>{r.taskName}</TableCell>
                <TableCell>{r.date}</TableCell>
                <TableCell>{r.hours}</TableCell>
                <TableCell>{r.description}</TableCell>
                <TableCell>
                  <Chip 
                    label={r.status} 
                    color={getStatusColor(r.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <button 
                    className="secondary" 
                    onClick={() => { 
                      setEditing(i); 
                      form.setValues({
                        ...r,
                        staffId: r.staffId?.toString() || '',
                        projectId: r.projectId?.toString() || ''
                      }); 
                      setOpen(true); 
                    }}
                    style={{
                      backgroundColor: '#ff9800',
                      color: 'white',
                      border: 'none',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      marginRight: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(r.id)}
                    style={{
                      backgroundColor: '#f44336',
                      color: 'white',
                      border: 'none',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Delete
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>{editing !== null ? 'Edit TimeSheet' : 'Add TimeSheet'}</DialogTitle>
        <DialogContent sx={{display:'flex',flexDirection:'column',gap:2,pt:2}}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Staff</InputLabel>
                <Select
                  name="staffId"
                  value={form.values.staffId}
                  onChange={form.handleChange}
                  label="Staff"
                  error={form.touched.staffId && Boolean(form.errors.staffId)}
                >
                  <MenuItem value="">Select Staff</MenuItem>
                  {staffList.map(staff => (
                    <MenuItem key={staff.id} value={staff.id.toString()}>
                      {staff.firstName} {staff.lastName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Project</InputLabel>
                <Select
                  name="projectId"
                  value={form.values.projectId}
                  onChange={form.handleChange}
                  label="Project"
                  error={form.touched.projectId && Boolean(form.errors.projectId)}
                >
                  <MenuItem value="">Select Project</MenuItem>
                  {projectList.map(project => (
                    <MenuItem key={project.id} value={project.id.toString()}>
                      {project.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField 
                label="Task Name" 
                name="taskName" 
                value={form.values.taskName} 
                onChange={form.handleChange}
                error={form.touched.taskName && Boolean(form.errors.taskName)}
                helperText={form.touched.taskName && form.errors.taskName}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField 
                label="Date" 
                name="date" 
                type="date"
                value={form.values.date} 
                onChange={form.handleChange}
                error={form.touched.date && Boolean(form.errors.date)}
                helperText={form.touched.date && form.errors.date}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField 
                label="Hours" 
                name="hours" 
                type="number"
                value={form.values.hours} 
                onChange={form.handleChange}
                error={form.touched.hours && Boolean(form.errors.hours)}
                helperText={form.touched.hours && form.errors.hours}
                fullWidth
                inputProps={{ min: 0.5, max: 24, step: 0.5 }}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={form.values.status}
                  onChange={form.handleChange}
                  label="Status"
                >
                  <MenuItem value="PENDING">Pending</MenuItem>
                  <MenuItem value="APPROVED">Approved</MenuItem>
                  <MenuItem value="REJECTED">Rejected</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField 
                label="Description" 
                name="description" 
                value={form.values.description} 
                onChange={form.handleChange}
                fullWidth
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <button 
            className="secondary" 
            onClick={() => setOpen(false)}
            style={{
              backgroundColor: '#9e9e9e',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button 
            onClick={form.handleSubmit}
            style={{
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Save
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
});

export default TimeSheet;