# 📋 Tài Liệu Đặc Tả Yêu Cầu Phần Mềm (SRS) - Globits HR React+Vite

## 1. Giới Thiệu

### 1.1 Mục Đích
Tài liệu này mô tả chi tiết các yêu cầu chức năng và phi chức năng của hệ thống quản lý nhân sự Globits HR phiên bản React+Vite, cung cấp cơ sở cho việc phát triển, kiểm thử và bảo trì hệ thống.

### 1.2 Phạm Vi
- Ứng dụng web quản lý nhân sự cho doanh nghiệp
- Giao diện người dùng thân thiện với React và Material-UI
- Tích hợp với backend Spring Boot qua REST API
- Hỗ trợ đa ngôn ngữ và responsive design

### 1.3 Đối Tượng Sử Dụng
- Nhân viên HR
- Quản lý cấp trung
- Admin hệ thống
- Developers và testers

## 2. Tổng Quan Hệ Thống

### 2.1 Mô Tả Sản Phẩm
Globits HR là hệ thống quản lý nhân sự toàn diện cho phép:
- Quản lý thông tin nhân viên
- Quản lý cơ cấu tổ chức (phòng ban)
- Quản lý đa quốc gia
- Chấm công và quản lý thời gian làm việc
- Báo cáo và thống kê

### 2.2 Kiến Trúc Hệ Thống
```
┌─────────────────────────────────────────────────────────┐
│                Frontend Layer (React+Vite)             │
├─────────────────────────────────────────────────────────┤
│  Components  │   State Mgt   │  Forms   │  Routing    │
│  Material-UI │     MobX      │  Formik  │ React Router│
├─────────────────────────────────────────────────────────┤
│              API Integration Layer                     │
│                    Axios HTTP                          │
├─────────────────────────────────────────────────────────┤
│              Backend Layer (Spring Boot)                 │
├─────────────────────────────────────────────────────────┤
│              Database Layer (MySQL)                     │
└─────────────────────────────────────────────────────────┘
```

## 3. Yêu Cầu Chức Năng

### 3.1 Module Authentication

#### 3.1.1 Đăng Nhập (FR-001)
**Mô tả**: Cho phép người dùng đăng nhập vào hệ thống
**Input**: Username, password
**Output**: JWT token, user information
**Validation**:
- Username không được để trống
- Password không được để trống
- Password tối thiểu 6 ký tự

**Flow**:
```
User → Login Form → API Authentication → JWT Token → Dashboard
```

#### 3.1.2 Đăng Xuất (FR-002)
**Mô tả**: Cho phép người dùng đăng xuất khỏi hệ thống
**Input**: Logout request
**Output**: Clear session, redirect to login
**Security**: Xóa token khỏi localStorage

### 3.2 Module Dashboard

#### 3.2.1 Thống Kê Tổng Quan (FR-003)
**Mô tả**: Hiển thị thống kê tổng quan của hệ thống
**Hiển thị**:
- Tổng số nhân viên
- Tổng số phòng ban
- Tổng số quốc gia
- Tổng số bản ghi chấm công

#### 3.2.2 Quick Actions (FR-004)
**Mô tả**: Cung cấp shortcuts đến các chức năng chính
**Các action**:
- Thêm nhân viên mới
- Xem báo cáo
- Quản lý phòng ban
- Import dữ liệu

### 3.3 Module Quản Lý Quốc Gia

#### 3.3.1 Xem Danh Sách Quốc Gia (FR-005)
**Mô tả**: Hiển thị danh sách tất cả quốc gia
**Columns**:
- Mã quốc gia (Code)
- Tên quốc gia (Name)
- Mô tả (Description)

#### 3.3.2 Tìm Kiếm Quốc Gia (FR-006)
**Mô tả**: Tìm kiếm quốc gia theo từ khóa
**Search fields**: Code, Name, Description
**Real-time**: Cập nhật kết quả khi gõ

#### 3.3.3 Thêm Quốc Gia Mới (FR-007)
**Mô tả**: Tạo quốc gia mới trong hệ thống
**Fields**:
- Code (bắt buộc, unique)
- Name (bắt buộc)
- Description (optional)

**Validation**:
- Code: 2-3 ký tự, uppercase
- Name: 3-100 ký tự
- Không được trùng Code

#### 3.3.4 Sửa Thông Tin Quốc Gia (FR-008)
**Mô tả**: Cập nhật thông tin quốc gia
**Editable fields**: Name, Description
**Non-editable**: Code (primary key)

#### 3.3.5 Xóa Quốc Gia (FR-009)
**Mô tả**: Xóa quốc gia khỏi hệ thống
**Validation**: Không được xóa nếu đang được sử dụng
**Confirmation**: Yêu cầu xác nhận trước khi xóa

### 3.4 Module Quản Lý Phòng Ban

#### 3.4.1 Xem Cây Tổ Ch�c (FR-010)
**Mô tả**: Hiển thị cấu trúc phòng ban dạng cây
**Features**:
- Expand/collapse nodes
- Drag & drop (future)
- Color coding theo level

#### 3.4.2 CRUD Phòng Ban (FR-011)
**Create/Read/Update/Delete** phòng ban
**Fields**:
- Mã phòng ban (Code)
- Tên phòng ban (Name)
- Mô tả (Description)
- Phòng ban cha (Parent)

**Business Rules**:
- Một phòng ban có thể có nhiều phòng ban con
- Không được tạo vòng tròn trong cây
- Code phải unique trong toàn hệ thống

### 3.5 Module Quản Lý Nhân Viên

#### 3.5.1 Danh Sách Nhân Viên (FR-012)
**Mô tả**: Hiển thị danh sách nhân viên
**Columns**:
- Mã nhân viên
- Họ tên
- Email
- Phòng ban
- Vị trí
- Trạng thái

#### 3.5.2 Tìm Kiếm Nhân Viên (FR-013)
**Mô tả**: Tìm kiếm theo nhiều tiêu chí
**Search fields**:
- Mã nhân viên
- Họ tên
- Email
- Phòng ban
- Trạng thái

#### 3.5.3 Thêm Nhân Viên Mới (FR-014)
**Fields**:
- Mã nhân viên (bắt buộc)
- Họ và tên (bắt buộc)
- Email (bắt buộc, format email)
- Số điện thoại
- Phòng ban (dropdown)
- Vị trí (dropdown)
- Ngày sinh
- Giới tính
- Địa chỉ
- Trạng thái (Active/Inactive/Terminated)

**Validation**:
- Email unique trong hệ thống
- Mã nhân viên unique
- Ngày sinh hợp lệ (>= 18 tuổi)

#### 3.5.4 Cập Nhật Thông Tin Nhân Viên (FR-015)
**Mô tả**: Cập nhật thông tin nhân viên
**Editable**: Tất cả fields trừ Mã nhân viên
**Audit**: Log thay đổi (future feature)

#### 3.5.5 Thay Đổi Trạng Thái Nhân Viên (FR-016)
**Trạng thái**:
- ACTIVE: Đang làm việc
- INACTIVE: Tạm dừng
- TERMINATED: Đã nghỉ việc

**Business Rules**:
- Không thể xóa nhân viên, chỉ chuyển trạng thái
- Nhân viên TERMINATED không được tạo timesheet mới

### 3.6 Module Chấm Công (TimeSheet)

#### 3.6.1 TimeSheet Entry (FR-017)
**Mô tả**: Nhập thời gian làm việc
**Fields**:
- Nhân viên (dropdown)
- Dự án (dropdown)
- Tên công việc
- Ngày làm việc
- Số giờ làm việc (0.5 - 24)
- Mô tả công việc
- Trạng thái (Pending/Approved/Rejected)

#### 3.6.2 Danh Sách TimeSheet (FR-018)
**Columns**:
- Nhân viên
- Dự án
- Công việc
- Ngày
- Số giờ
- Trạng thái
- Mô tả

#### 3.6.3 Tổng Hợp Giờ Làm (FR-019)
**Mô tả**: Tính tổng số giờ làm việc
**Filters**:
- Theo nhân viên
- Theo dự án
- Theo khoảng thời gian
- Theo phòng ban

#### 3.6.4 Phê Duyệt TimeSheet (FR-020)
**Workflow**:
1. Nhân viên tạo timesheet (PENDING)
2. Quản lý review
3. Approved/Rejected với lý do
4. Notification cho nhân viên

## 4. Yêu Cầu Phi Chức Năng

### 4.1 Hiệu Suất (NFR-001)
- **Thời gian tải trang**: < 3 giây
- **Thời gian response API**: < 500ms
- **Concurrent users**: 100+ users
- **Browser support**: Chrome, Firefox, Safari, Edge

### 4.2 Khả Năng Mở Rộng (NFR-002)
- **Horizontal scaling**: Có thể scale thêm servers
- **Database**: Support partitioning
- **Caching**: Redis integration ready
- **CDN**: Static asset optimization

### 4.3 Bảo Mật (NFR-003)
- **Authentication**: JWT token-based
- **Authorization**: Role-based access control
- **HTTPS**: SSL/TLS encryption
- **Input validation**: XSS và SQL injection prevention
- **Rate limiting**: API throttling

### 4.4 Khả Dụng (NFR-004)
- **Uptime**: 99.9% availability
- **Backup**: Daily automated backups
- **Recovery**: RTO < 4 giờ, RPO < 1 giờ
- **Monitoring**: Real-time system monitoring

### 4.5 Trải Nghiệm Người Dùng (NFR-005)
- **Responsive**: Mobile-first design
- **Accessibility**: WCAG 2.1 Level AA
- **Usability**: Intuitive navigation
- **Performance**: Smooth user interactions

### 4.6 Bảo Trì (NFR-006)
- **Code quality**: ESLint, Prettier
- **Testing**: Unit test coverage > 80%
- **Documentation**: Comprehensive docs
- **Version control**: Git workflow

## 5. Ràng Buộc Hệ Thống

### 5.1 Công Nghệ
- **Frontend**: React 18+, TypeScript
- **Build tool**: Vite
- **UI Library**: Material-UI
- **State management**: MobX
- **HTTP Client**: Axios

### 5.2 Backend Integration
- **API**: RESTful với Spring Boot
- **Authentication**: JWT tokens
- **Database**: MySQL
- **Protocol**: HTTPS

### 5.3 Môi Trường
- **Development**: Node.js 16+
- **Browser support**: Modern browsers
- **Mobile**: Responsive design
- **Deployment**: Docker containers

## 6. Use Case Diagrams

### 6.1 Authentication Use Cases
```
┌─────────────┐       ┌──────────────┐       ┌─────────────┐
│   Người dùng │──────▶│  Đăng nhập   │──────▶│   Dashboard  │
└─────────────┘       └──────────────┘       └─────────────┘
       │                                              │
       │                                              │
       ▼                                              ▼
┌─────────────┐       ┌──────────────┐       ┌─────────────┐
│Đăng xuất    │◀──────│  Hết phiên   │◀──────│ Lỗi đăng   │
└─────────────┘       └──────────────┘       └─────────────┘
                                             nhập
```

### 6.2 HR Management Use Cases
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Xem DS    │◀───│  Tìm kiếm   │◀───│   Lọc      │◀───│  Sắp xếp   │
└──────┬──────┘    └──────┬──────┘    └──────┬──────┘    └──────┬──────┘
       │                  │                  │                  │
       ▼                  ▼                  ▼                  ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Thêm     │    │    Sửa     │    │   Xóa      │    │  Import    │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

## 7. Giao Diện Người Dùng

### 7.1 Layout Structure
```
┌─────────────────────────────────────────────────────────────┐
│                        AppBar                                │
│  [Logo] Globits HR                    [User] [Logout]      │
├─────────────────┬───────────────────────────────────────────┤
│                 │                                           │
│   Navigation    │              Main Content                │
│     Drawer      │                                           │
│                 │         Dashboard/CRUD Views              │
│  ▶ Dashboard    │                                           │
│    Countries    │         [Cards/Tables/Forms]             │
│    Departments  │                                           │
│    Staff        │         [Pagination/Search]            │
│    TimeSheet    │                                           │
│                 │                                           │
└─────────────────┴───────────────────────────────────────────┘
```

### 7.2 Component Specifications

#### Login Page
- **Layout**: Centered card
- **Fields**: Username, Password
- **Actions**: Login, Forgot password
- **Validation**: Real-time feedback

#### Dashboard
- **Cards**: Statistics with icons
- **Grid**: Responsive 4 columns desktop, 2 tablet, 1 mobile
- **Colors**: Material Design palette

#### CRUD Tables
- **Columns**: Sortable, filterable
- **Actions**: Edit (icon), Delete (icon)
- **Pagination**: 20 items per page
- **Search**: Real-time, debounced 300ms

## 8. API Specifications

### 8.1 Authentication APIs
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "string",
  "password": "string"
}

Response: 200 OK
{
  "token": "jwt_token_string",
  "user": {
    "id": 1,
    "username": "string",
    "roles": ["ROLE_USER"]
  }
}
```

### 8.2 CRUD APIs Pattern
```http
# List with pagination
POST /api/{entity}/searchByPage
{
  "pageIndex": 0,
  "pageSize": 20,
  "keyword": "search term",
  "sortBy": "fieldName",
  "sortDirection": "ASC|DESC"
}

# Create
POST /api/{entity}
{ entity_data_object }

# Update
PUT /api/{entity}/{id}
{ entity_data_object }

# Delete
DELETE /api/{entity}/{id}
```

## 9. Database Schema

### 9.1 Entity Relationships
```sql
-- Countries
CREATE TABLE countries (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(3) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  modified_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Departments
CREATE TABLE departments (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  parent_id BIGINT,
  FOREIGN KEY (parent_id) REFERENCES departments(id)
);

-- Staff
CREATE TABLE staff (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  staff_code VARCHAR(20) UNIQUE NOT NULL,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone_number VARCHAR(20),
  department_id BIGINT,
  position_id BIGINT,
  status ENUM('ACTIVE', 'INACTIVE', 'TERMINATED'),
  date_of_birth DATE,
  gender ENUM('MALE', 'FEMALE', 'OTHER'),
  address TEXT,
  FOREIGN KEY (department_id) REFERENCES departments(id)
);
```

## 10. Testing Requirements

### 10.1 Unit Testing
- **Coverage**: > 80% code coverage
- **Tools**: Jest, React Testing Library
- **Components**: All React components
- **Utils**: Helper functions

### 10.2 Integration Testing
- **API Integration**: Mock server testing
- **Form Submission**: End-to-end form flows
- **Authentication**: Login/logout flows
- **Navigation**: Route transitions

### 10.3 User Acceptance Testing (UAT)
- **Use cases**: All FR requirements
- **Scenarios**: Happy path và error cases
- **Performance**: Load testing với 100+ users
- **Usability**: User feedback collection

## 11. Deployment Requirements

### 11.1 Environment Setup
```bash
# Development
NODE_ENV=development
VITE_API=http://localhost:8071

# Staging
NODE_ENV=staging
VITE_API=https://api.staging.com

# Production
NODE_ENV=production
VITE_API=https://api.production.com
```

### 11.2 Build Requirements
- **Optimization**: Code splitting, minification
- **Assets**: Image optimization, font loading
- **Security**: Environment variables, CORS
- **Monitoring**: Error tracking, analytics

## 12. Maintenance Requirements

### 12.1 Code Quality
- **Linting**: ESLint configuration
- **Formatting**: Prettier setup
- **Documentation**: JSDoc comments
- **Version control**: Git workflow

### 12.2 Update Strategy
- **Dependencies**: Monthly security updates
- **Features**: Agile development cycles
- **Bug fixes**: Hotfix và patch releases
- **Backups**: Database và file system

---

**📋 SRS Status**: Complete và approved
**📅 Version**: 1.0.0
**👥 Stakeholders**: HR Team, Development Team, Management
**🎯 Priority**: High - Core business functionality