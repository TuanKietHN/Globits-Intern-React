# 📋 Hướng Dẫn Kiểm Thử API và Ứng Dụng

## Tổng Quan
Tài liệu này cung cấp hướng dẫn chi tiết để kiểm thử toàn bộ hệ thống Globits HR Management, bao gồm cả API backend và ứng dụng React frontend.

## 🧪 Các Công Cụ Kiểm Thử

### 1. PowerShell Test Script
**File:** `test/api-test.ps1`

Script này kiểm tra tất cả các endpoints của backend:

```powershell
# Chạy test script
.\test\api-test.ps1
```

**Kết quả mong đợi:**
- ✅ Countries: 200 OK (đang hoạt động)
- ❌ Departments: 404 Not Found
- ❌ Positions: 405 Method Not Allowed
- ❌ Staff: 500 Internal Server Error
- ❌ Projects: 405 Method Not Allowed
- ❌ TimeSheets: 405 Method Not Allowed

### 2. Postman Collection
**File:** `test/Globits-HR-API.postman_collection.json`

Import collection này vào Postman để test thủ công:

1. Mở Postman
2. Click Import → Upload file `Globits-HR-API.postman_collection.json`
3. Collection sẽ chứa tất cả API endpoints với các request mẫu
4. Thiết lập environment variable `baseUrl` nếu cần

### 3. Frontend Testing

#### Test Tính Năng CRUD

**Countries Management:**
1. Truy cập http://localhost:5173/countries
2. Kiểm tra danh sách countries hiển thị
3. Click "Thêm mới" để tạo country mới
4. Click "Sửa" để cập nhật thông tin
5. Click "Xóa" để xóa country

**Departments Management:**
1. Truy cập http://localhost:5173/departments
2. Kiểm tra danh sách departments (sẽ hiển thị mock data nếu API lỗi)
3. Test các chức năng CRUD

**Staff Management:**
1. Truy cập http://localhost:5173/staff
2. Kiểm tra danh sách nhân viên
3. Test chức năng thêm/sửa/xóa nhân viên

**TimeSheet Management:**
1. Truy cập http://localhost:5173/timesheet
2. Kiểm tra danh sách timesheets
3. Test chức năng quản lý timesheet

## 🔍 Kiểm Thử Chi Tiết

### Test Case 1: Kiểm Tra Kết Nối API
```bash
# Test countries endpoint (đang hoạt động)
curl -X POST http://localhost:8071/api/hrCountry/searchByPage \
  -H "Content-Type: application/json" \
  -d '{"pageIndex":0,"pageSize":20,"keyword":""}'

# Test departments endpoint (404 error)
curl -X POST http://localhost:8071/api/hrDepartment/searchByPage \
  -H "Content-Type: application/json" \
  -d '{"pageIndex":0,"pageSize":20,"keyword":""}'
```

### Test Case 2: Kiểm Tra CORS
```bash
# Test preflight request
curl -X OPTIONS http://localhost:8071/api/hrDepartment/searchByPage \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type"
```

### Test Case 3: Kiểm Tra Frontend Fallback
1. Tắt backend server
2. Refresh trang http://localhost:5173/countries
3. Kiểm tra xem có hiển thị mock data không
4. Mở browser console để xem thông báo lỗi

## 📊 Kiểm Thử Hiệu Suất

### Load Testing với curl
```bash
# Test load cho countries endpoint
for i in {1..10}; do
  curl -s -w "%{time_total}\n" -o /dev/null \
    -X POST http://localhost:8071/api/hrCountry/searchByPage \
    -H "Content-Type: application/json" \
    -d '{"pageIndex":0,"pageSize":20,"keyword":""}'
done
```

### Frontend Performance
1. Mở Chrome DevTools (F12)
2. Vào tab Network
3. Refresh trang và quan sát:
   - Thời gian tải API
   - Kích thước response
   - Trạng thái các request

## 🐛 Debugging Guide

### Lỗi CORS
**Symptom:** `Access to XMLHttpRequest has been blocked by CORS policy`
**Solution:** Xem `docs/SpringBootCORSGuide.md` để cấu hình CORS

### Lỗi 404 Not Found
**Symptom:** `404 Not Found` cho departments
**Solution:** Kiểm tra DepartmentController có tồn tại không

### Lỗi 405 Method Not Allowed
**Symptom:** `405 Method Not Allowed` cho positions, projects, timesheets
**Solution:** Kiểm tra controller có hỗ trợ POST method không

### Lỗi 500 Internal Server Error
**Symptom:** `500 Internal Server Error` cho staff
**Solution:** Kiểm tra Spring Boot logs để xem lỗi chi tiết

## 📋 Checklist Kiểm Thử

### Backend Testing
- [ ] Countries API hoạt động (200 OK)
- [ ] Departments API hoạt động
- [ ] Staff API hoạt động
- [ ] TimeSheets API hoạt động
- [ ] Positions API hoạt động
- [ ] Projects API hoạt động
- [ ] CORS configured properly
- [ ] No authentication required (temporarily)

### Frontend Testing
- [ ] All pages load without errors
- [ ] Countries CRUD works
- [ ] Departments CRUD works
- [ ] Staff CRUD works
- [ ] TimeSheets CRUD works
- [ ] Mock data displays when API fails
- [ ] Error handling works properly
- [ ] Responsive design works

### Integration Testing
- [ ] Frontend connects to backend
- [ ] Data synchronization works
- [ ] Error messages display correctly
- [ ] Fallback to mock data works

## 🛠️ Công Cụ Bổ Sung

### Browser Extensions
- **React Developer Tools**: Debug React components
- **Redux DevTools**: Debug state management (nếu dùng Redux)
- **Postman Interceptor**: Capture browser requests

### Command Line Tools
- **curl**: Test API endpoints
- **jq**: Parse JSON responses
- **httpie**: Alternative to curl

## 📈 Báo Cáo Lỗi

Khi phát hiện lỗi, ghi lại:
1. **Steps to reproduce**
2. **Expected behavior**
3. **Actual behavior**
4. **Screenshots/error messages**
5. **Environment (browser, OS)**
6. **Console logs**

## 🔧 Cấu Hình Test Environment

### Backend (.env hoặc application.properties)
```properties
server.port=8071
spring.datasource.url=jdbc:mysql://localhost:3306/globits_hr
spring.datasource.username=root
spring.datasource.password=password
```

### Frontend (.env)
```
VITE_API=http://localhost:8071
```

### Database Test Data
```sql
-- Test countries
INSERT INTO tbl_country (name, code, description) VALUES 
('Vietnam', 'VN', 'Vietnam Country'),
('United States', 'US', 'USA Country'),
('Japan', 'JP', 'Japan Country');

-- Test departments
INSERT INTO tbl_department (name, code, description) VALUES 
('IT', 'IT', 'Information Technology'),
('HR', 'HR', 'Human Resources'),
('Finance', 'FIN', 'Finance Department');
```

## 🎯 Kết Luận

Việc kiểm thử toàn diện giúp đảm bảo:
- **Ứng dụng hoạt động ổn định** với mock data fallback
- **API backend được kiểm tra kỹ lưỡng**
- **CORS và các vấn đề kết nối được giải quyết**
- **Trải nghiệm người dùng mượt mà** ngay cả khi backend có vấn đề

Sử dụng các công cụ và hướng dẫn này để:
1. **Xác nhận tình trạng hiện tại** của các API endpoints
2. **Test chức năng frontend** với mock data
3. **Chuẩn bị cho việc fix backend** khi cần thiết
4. **Đảm bảo chất lượng** của toàn bộ hệ thống