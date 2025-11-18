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
  Chip
} from '@mui/material';
import { apiService } from '../services/ApiService.js'; // Thay thế authStore

const API = import.meta.env.VITE_API || 'http://localhost:8071';

const mockStaff = [
  {
    id: 1,
    staffCode: 'EMP001',
    firstName: 'Nguyen',
    lastName: 'Van A',
    email: 'nguyenvana@company.com',
    phoneNumber: '0123456789',
    departmentId: 1,
    positionId: 1,
    status: 'ACTIVE',
    dateOfBirth: '1990-01-15',
    gender: 'MALE',
    address: '123 Main St, Hanoi'
  },
  {
    id: 2,
    staffCode: 'EMP002',
    firstName: 'Tran',
    lastName: 'Thi B',
    email: 'tranthib@company.com',
    phoneNumber: '0987654321',
    departmentId: 2,
    positionId: 2,
    status: 'ACTIVE',
    dateOfBirth: '1992-03-20',
    gender: 'FEMALE',
    address: '456 Oak St, Ho Chi Minh City'
  }
];

const Staff = observer(() => {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  
  const schema = Yup.object({ 
    staffCode: Yup.string().required('Staff Code is required'),
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phoneNumber: Yup.string().required('Phone Number is required'),
    departmentId: Yup.number().required('Department is required'),
    positionId: Yup.number().required('Position is required'),
    status: Yup.string().required('Status is required'),
    dateOfBirth: Yup.date().required('Date of Birth is required'),
    gender: Yup.string().required('Gender is required'),
    address: Yup.string().required('Address is required')
  });
  
  const form = useFormik({ 
    initialValues: { 
      staffCode: '',
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      departmentId: '',
      positionId: '',
      status: 'ACTIVE',
      dateOfBirth: '',
      gender: 'MALE',
      address: ''
    }, 
    validationSchema: schema, 
    onSubmit: async (values) => {
      try {
        const payload = {
          ...values,
          departmentId: parseInt(values.departmentId),
          positionId: parseInt(values.positionId)
        };
        
        if (editing !== null) {
          await apiService.put(`/api/staff/${rows[editing].id}`, payload);
        } else {
          await apiService.post('/api/staff', payload);
        }
        setOpen(false);
        setEditing(null);
        fetchStaff();
      } catch (error) {
        setError(error.message);
      }
    } 
  });

  const fetchStaff = async () => {
    setLoading(true);
    setError(null);
    try {
      const [{ data: staffData }, { data: deptData }, { data: posData }] = await Promise.all([
        apiService.post('/api/staff/searchByPage', 
          { pageIndex: 0, pageSize: 20, keyword }
        ),
        apiService.post('/api/hrDepartment/searchByPage', 
          { pageIndex: 0, pageSize: 100 }
        ),
        apiService.post('/api/position/searchByPage', 
          { pageIndex: 0, pageSize: 100 }
        )
      ]);
      
      setRows(staffData?.content || []);
      setDepartments(deptData?.content || []);
      setPositions(posData?.content || []);
    } catch (error) {
      console.warn('API failed, using mock data:', error.message);
      setRows(mockStaff);
      setDepartments([
        { id: 1, name: 'Human Resources' },
        { id: 2, name: 'Information Technology' }
      ]);
      setPositions([
        { id: 1, name: 'HR Manager' },
        { id: 2, name: 'Software Engineer' }
      ]);
      setError('Using mock data - API connection failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this staff member?')) {
      try {
        await apiService.delete(`/api/staff/${id}`);
        fetchStaff();
      } catch (error) {
        setError('Delete failed: ' + error.message);
      }
    }
  };

  useEffect(() => {
    fetchStaff();
  }, [keyword]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'INACTIVE': return 'warning';
      case 'TERMINATED': return 'error';
      default: return 'default';
    }
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
      <h2>Staff Management</h2>
      
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
          placeholder="Search staff..."
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
          Add New Staff
        </button>
      </div>
      
      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
        <thead>
          <tr style={{ backgroundColor: '#f5f5f5' }}>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Code</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Name</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Email</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Department</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Position</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Status</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '12px' }}>{r.staffCode}</td>
              <td style={{ padding: '12px' }}>{r.firstName} {r.lastName}</td>
              <td style={{ padding: '12px' }}>{r.email}</td>
              <td style={{ padding: '12px' }}>
                {departments.find(d => d.id === r.departmentId)?.name || 'N/A'}
              </td>
              <td style={{ padding: '12px' }}>
                {positions.find(p => p.id === r.positionId)?.name || 'N/A'}
              </td>
              <td style={{ padding: '12px' }}>
                <Chip 
                  label={r.status} 
                  color={getStatusColor(r.status)}
                  size="small"
                />
              </td>
              <td style={{ padding: '12px' }}>
                <button 
                  className="secondary" 
                  onClick={() => { 
                    setEditing(i); 
                    form.setValues({
                      ...r,
                      departmentId: r.departmentId?.toString() || '',
                      positionId: r.positionId?.toString() || ''
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>{editing !== null ? 'Edit Staff' : 'Add Staff'}</DialogTitle>
        <DialogContent sx={{display:'flex',flexDirection:'column',gap:2,pt:2}}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField 
                label="Staff Code" 
                name="staffCode" 
                value={form.values.staffCode} 
                onChange={form.handleChange}
                error={form.touched.staffCode && Boolean(form.errors.staffCode)}
                helperText={form.touched.staffCode && form.errors.staffCode}
                fullWidth
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
                  <MenuItem value="ACTIVE">Active</MenuItem>
                  <MenuItem value="INACTIVE">Inactive</MenuItem>
                  <MenuItem value="TERMINATED">Terminated</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField 
                label="First Name" 
                name="firstName" 
                value={form.values.firstName} 
                onChange={form.handleChange}
                error={form.touched.firstName && Boolean(form.errors.firstName)}
                helperText={form.touched.firstName && form.errors.firstName}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField 
                label="Last Name" 
                name="lastName" 
                value={form.values.lastName} 
                onChange={form.handleChange}
                error={form.touched.lastName && Boolean(form.errors.lastName)}
                helperText={form.touched.lastName && form.errors.lastName}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField 
                label="Email" 
                name="email" 
                value={form.values.email} 
                onChange={form.handleChange}
                error={form.touched.email && Boolean(form.errors.email)}
                helperText={form.touched.email && form.errors.email}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField 
                label="Phone Number" 
                name="phoneNumber" 
                value={form.values.phoneNumber} 
                onChange={form.handleChange}
                error={form.touched.phoneNumber && Boolean(form.errors.phoneNumber)}
                helperText={form.touched.phoneNumber && form.errors.phoneNumber}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Department</InputLabel>
                <Select
                  name="departmentId"
                  value={form.values.departmentId}
                  onChange={form.handleChange}
                  label="Department"
                  error={form.touched.departmentId && Boolean(form.errors.departmentId)}
                >
                  <MenuItem value="">Select Department</MenuItem>
                  {departments.map(dept => (
                    <MenuItem key={dept.id} value={dept.id.toString()}>
                      {dept.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Position</InputLabel>
                <Select
                  name="positionId"
                  value={form.values.positionId}
                  onChange={form.handleChange}
                  label="Position"
                  error={form.touched.positionId && Boolean(form.errors.positionId)}
                >
                  <MenuItem value="">Select Position</MenuItem>
                  {positions.map(pos => (
                    <MenuItem key={pos.id} value={pos.id.toString()}>
                      {pos.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Gender</InputLabel>
                <Select
                  name="gender"
                  value={form.values.gender}
                  onChange={form.handleChange}
                  label="Gender"
                >
                  <MenuItem value="MALE">Male</MenuItem>
                  <MenuItem value="FEMALE">Female</MenuItem>
                  <MenuItem value="OTHER">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField 
                label="Date of Birth" 
                name="dateOfBirth" 
                type="date"
                value={form.values.dateOfBirth} 
                onChange={form.handleChange}
                error={form.touched.dateOfBirth && Boolean(form.errors.dateOfBirth)}
                helperText={form.touched.dateOfBirth && form.errors.dateOfBirth}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField 
                label="Address" 
                name="address" 
                value={form.values.address} 
                onChange={form.handleChange}
                error={form.touched.address && Boolean(form.errors.address)}
                helperText={form.touched.address && form.errors.address}
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

export default Staff;