import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { countries as seed } from '../CountryData';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

const API = import.meta.env.VITE_API || 'http://localhost:8071';

export default function Countries(){
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [keyword, setKeyword] = useState('');
  const schema = Yup.object({ code: Yup.string().required(), name: Yup.string().required(), description: Yup.string() });
  const form = useFormik({ initialValues: { code:'', name:'', description:'' }, validationSchema: schema, onSubmit: v=>{ if(editing!=null){ const next=[...rows]; next[editing]=v; setRows(next); } else { setRows([...rows, v]); } setOpen(false); setEditing(null); } });

  useEffect(()=>{ (async()=>{ try{ const {data} = await axios.post(`${API}/api/hrCountry/searchByPage`, { pageIndex:0, pageSize:20, keyword }); setRows((data?.content||[]).map(x=>({code:x.code,name:x.name,description:x.description}))); }catch(e){ setRows(seed); } })() },[keyword]);

  return (
    <div>
      <h2>Countries</h2>
      <div style={{display:'flex',gap:8,marginBottom:12}}>
        <TextField size="small" label="Tìm kiếm" value={keyword} onChange={e=> setKeyword(e.target.value)} />
        <button onClick={()=>{ form.resetForm(); setEditing(null); setOpen(true); }}>Add new Country</button>
      </div>
      <table>
        <thead><tr><th>Code</th><th>Name</th><th>Description</th><th>Actions</th></tr></thead>
        <tbody>
          {rows.map((r,i)=> (
            <tr key={r.code+"-"+i}>
              <td>{r.code}</td>
              <td>{r.name}</td>
              <td>{r.description}</td>
              <td>
                <button className="secondary" onClick={()=>{ setEditing(i); form.setValues(r); setOpen(true); }}>Edit</button>
                <button onClick={()=>{ if(confirm('Delete?')) setRows(rows.filter((_,idx)=> idx!==i)); }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Dialog open={open} onClose={()=> setOpen(false)} fullWidth>
        <DialogTitle>{editing!=null? 'Edit Country':'Add Country'}</DialogTitle>
        <DialogContent sx={{display:'flex',flexDirection:'column',gap:2,pt:2}}>
          <TextField label="Code" name="code" value={form.values.code} onChange={form.handleChange} />
          <TextField label="Name" name="name" value={form.values.name} onChange={form.handleChange} />
          <TextField label="Description" name="description" value={form.values.description} onChange={form.handleChange} />
        </DialogContent>
        <DialogActions>
          <button className="secondary" onClick={()=> setOpen(false)}>Cancel</button>
          <button onClick={form.handleSubmit}>Save</button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
