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
  InputLabel
} from '@mui/material';
import { apiService } from '../services/ApiService.js'; // Thay thế authStore

const API = import.meta.env.VITE_API || 'http://localhost:8071';

const departments = [
  { id: 1, code: 'HR', name: 'Human Resources', description: 'HR Department', parentId: null },
  { id: 2, code: 'IT', name: 'Information Technology', description: 'IT Department', parentId: null },
  { id: 3, code: 'FIN', name: 'Finance', description: 'Finance Department', parentId: null }
];

const Department = observer(() => {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const schema = Yup.object({ 
    code: Yup.string().required('Code is required'), 
    name: Yup.string().required('Name is required'), 
    description: Yup.string(),
    parentId: Yup.number().nullable()
  });
  
  const form = useFormik({ 
    initialValues: { code:'', name:'', description:'', parentId: null }, 
    validationSchema: schema, 
    onSubmit: async (values) => {
      try {
        if (editing !== null) {
          await apiService.put(`/api/hrDepartment/${rows[editing].id}`, values);
        } else {
          await apiService.post('/api/hrDepartment', values);
        }
        setOpen(false);
        setEditing(null);
        fetchDepartments();
      } catch (error) {
        setError(error.message);
      }
    } 
  });

  const fetchDepartments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.post('/api/hrDepartment/searchByPage', 
        { pageIndex: 0, pageSize: 20, keyword }
      );
      setRows(data?.content || []);
    } catch (error) {
      console.warn('API failed, using mock data:', error.message);
      setRows(departments);
      setError('Using mock data - API connection failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this department?')) {
      try {
        await apiService.delete(`/api/hrDepartment/${id}`);
        fetchDepartments();
      } catch (error) {
        setError('Delete failed: ' + error.message);
      }
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, [keyword]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div>
      <h2>Department Management</h2>
      
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
          placeholder="Search departments..."
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
          Add New Department
        </button>
      </div>
      
      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
        <thead>
          <tr style={{ backgroundColor: '#f5f5f5' }}>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Code</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Name</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Description</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Parent</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '12px' }}>{r.code}</td>
              <td style={{ padding: '12px' }}>{r.name}</td>
              <td style={{ padding: '12px' }}>{r.description}</td>
              <td style={{ padding: '12px' }}>{r.parentId ? `Parent ${r.parentId}` : 'None'}</td>
              <td style={{ padding: '12px' }}>
                <button 
                  className="secondary" 
                  onClick={() => { 
                    setEditing(i); 
                    form.setValues(r); 
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
      
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editing !== null ? 'Edit Department' : 'Add Department'}</DialogTitle>
        <DialogContent sx={{display:'flex',flexDirection:'column',gap:2,pt:2}}>
          <TextField 
            label="Code" 
            name="code" 
            value={form.values.code} 
            onChange={form.handleChange}
            error={form.touched.code && Boolean(form.errors.code)}
            helperText={form.touched.code && form.errors.code}
          />
          <TextField 
            label="Name" 
            name="name" 
            value={form.values.name} 
            onChange={form.handleChange}
            error={form.touched.name && Boolean(form.errors.name)}
            helperText={form.touched.name && form.errors.name}
          />
          <TextField 
            label="Description" 
            name="description" 
            value={form.values.description} 
            onChange={form.handleChange}
            multiline
            rows={3}
          />
          <FormControl fullWidth>
            <InputLabel>Parent Department</InputLabel>
            <Select
              name="parentId"
              value={form.values.parentId || ''}
              onChange={form.handleChange}
              label="Parent Department"
            >
              <MenuItem value="">None</MenuItem>
              {rows.map(dept => (
                <MenuItem key={dept.id} value={dept.id}>
                  {dept.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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

export default Department;