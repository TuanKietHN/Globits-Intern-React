import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useFormik } from "formik";
import * as Yup from "yup";

// Base URL: dùng theo Vite (bạn có thể set VITE_API trong .env)
// VITE_API=http://localhost:8071
const API = import.meta.env.VITE_API || "http://localhost:8072";

const API_COUNTRY = `${API}/api/country`;
const API_HR_COUNTRY = `${API}/api/hrCountry`;

// ---------------- API helper ----------------
// const pagingCountries = (searchObject) =>
//   axios.post(`${API_HR_COUNTRY}/searchByPage`, searchObject);
const pagingCountries = (searchObject) =>
  axiosInstance.post(`/api/hrCountry/searchByPage`, searchObject);

// const getCountry = (id) => axios.get(`${API_COUNTRY}/${id}`);

// const createCountry = (obj) => axios.post(API_HR_COUNTRY, obj);

// const editCountry = (obj) => axios.put(`${API_HR_COUNTRY}/${obj.id}`, obj);

// const deleteCountry = (id) => axios.delete(`${API_HR_COUNTRY}/${id}`);
const getCountry = (id) =>
  axiosInstance.get(`/api/country/${id}`);

const createCountry = (obj) =>
  axiosInstance.post(`/api/hrCountry`, obj);

const editCountry = (obj) =>
  axiosInstance.put(`/api/hrCountry/${obj.id}`, obj);

const deleteCountry = (id) =>
  axiosInstance.delete(`/api/hrCountry/${id}`);

// ---------------- Component ----------------
export default function Countries() {
  const [rows, setRows] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [page, setPage] = useState(0); // DataGrid đang 0-based
  const [pageSize, setPageSize] = useState(10);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("Thêm Country");

  const [editingId, setEditingId] = useState(null); // null = thêm mới
  const axiosInstance = axios.create({
    baseURL: API,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });

  // ---------------- Formik + Yup ----------------
  const validationSchema = Yup.object({
    code: Yup.string().required("Code là bắt buộc"),
    name: Yup.string().required("Name là bắt buộc"),
    description: Yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      id: null,
      code: "",
      name: "",
      description: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (values.id) {
          // Edit
          await editCountry(values);
        } else {
          // Create
          await createCountry(values);
        }
        setOpenDialog(false);
        // reload list
        await loadData();
      } catch (error) {
        console.error("Error when submit Country:", error);
        alert("Có lỗi xảy ra khi lưu Country");
      }
    },
  });

  // ---------------- Load data (paging) ----------------
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const searchObject = {
        pageIndex: page,
        pageSize,
        keyword,
      };
      const { data } = await pagingCountries(searchObject);

      const content = data?.content || data?.data || [];
      const total =
        data?.totalElements ??
        data?.total ??
        data?.totalItems ??
        content.length;

      setRows(content);
      setRowCount(total);
    } catch (error) {
      console.error("Error loading countries:", error);
      setRows([]);
      setRowCount(0);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, keyword]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ---------------- Handlers ----------------

  // Mở dialog thêm mới
  const handleAdd = () => {
    setDialogTitle("Thêm Country");
    setEditingId(null);
    formik.resetForm();
    setOpenDialog(true);
  };

  // Mở dialog sửa: gọi getCountry để lấy chi tiết
  const handleEdit = async (id) => {
    try {
      const { data } = await getCountry(id);
      setDialogTitle("Sửa Country");
      setEditingId(id);
      formik.setValues({
        id: data.id,
        code: data.code || "",
        name: data.name || "",
        description: data.description || "",
      });
      setOpenDialog(true);
    } catch (error) {
      console.error("Error getCountry:", error);
      alert("Không lấy được dữ liệu Country để chỉnh sửa");
    }
  };

  // Xóa
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa Country này?")) return;
    try {
      await deleteCountry(id);
      await loadData();
    } catch (error) {
      console.error("Error deleteCountry:", error);
      alert("Xóa thất bại");
    }
  };

  // Tìm kiếm: khi bấm Enter hoặc bấm button Search
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0); // reset về page đầu
    loadData();
  };

  // ---------------- DataGrid Columns ----------------
  const columns = useMemo(
    () => [
      { field: "code", headerName: "Code", flex: 1, minWidth: 120 },
      { field: "name", headerName: "Name", flex: 1.2, minWidth: 160 },
      {
        field: "description",
        headerName: "Description",
        flex: 2,
        minWidth: 220,
      },
      {
        field: "actions",
        headerName: "Actions",
        sortable: false,
        filterable: false,
        width: 160,
        renderCell: (params) => {
          const id = params.row.id;
          return (
            <Stack direction="row" spacing={1}>
              <Button
                size="small"
                variant="outlined"
                onClick={() => handleEdit(id)}
              >
                Edit
              </Button>
              <Button
                size="small"
                variant="outlined"
                color="error"
                onClick={() => handleDelete(id)}
              >
                Delete
              </Button>
            </Stack>
          );
        },
      },
    ],
    []
  );

  // ---------------- Render ----------------
  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Countries
      </Typography>

      {/* Thanh tool: Search + Add */}
      <Box
        component="form"
        onSubmit={handleSearchSubmit}
        sx={{ mb: 2, display: "flex", gap: 2, alignItems: "center" }}
      >
        <TextField
          size="small"
          label="Từ khóa (code/name)"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <Button type="submit" variant="contained">
          Search
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        <Button variant="contained" color="primary" onClick={handleAdd}>
          Thêm Country
        </Button>
      </Box>

      {/* DataGrid */}
      <Box sx={{ height: 520, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          getRowId={(row) => row.id}
          pagination
          paginationMode="server"
          rowCount={rowCount}
          page={page}
          pageSize={pageSize}
          onPageChange={(newPage) => setPage(newPage)}
          onPageSizeChange={(newPageSize) => {
            setPageSize(newPageSize);
            setPage(0);
          }}
          pageSizeOptions={[5, 10, 20, 50, 100]} // FIX LỖI DATA GRID
        />

      </Box>

      {/* Dialog thêm/sửa */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          <TextField
            label="Code"
            name="code"
            value={formik.values.code}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.code && Boolean(formik.errors.code)}
            helperText={formik.touched.code && formik.errors.code}
          />

          <TextField
            label="Name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />

          <TextField
            label="Description"
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            multiline
            minRows={3}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button onClick={formik.handleSubmit} variant="contained">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
