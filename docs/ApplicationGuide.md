# 📋 Hướng Dẫn Chi Tiết Ứng Dụng Globits HR React+Vite

## 🎯 Tổng Quan

Ứng dụng Globits HR là hệ thống quản lý nhân sự được xây dựng với React 18 và Vite, cung cấp giao diện quản lý toàn diện cho các hoạt động HR bao gồm quản lý nhân viên, phòng ban, quốc gia và chấm công.

## 🏗️ Kiến Trúc Hệ Thống

### Frontend Stack
- **React 18.2.0**: Framework UI chính
- **Vite 4.5.3**: Build tool cho development nhanh
- **Material-UI 5.15.18**: Component library
- **MobX 6.9.0**: State management
- **React Router 7.0.0**: Navigation và routing
- **Axios 1.7.7**: HTTP client cho API calls
- **Formik 2.4.5 + Yup 1.4.0**: Form validation

### Backend Integration
- **API Endpoint**: `http://localhost:8071` (configurable via VITE_API)
- **Authentication**: JWT-based với Spring Boot backend
- **Data Format**: JSON RESTful APIs

## 🔐 Hệ Thống Authentication

### JWT Flow
```
User Login → API Authentication → JWT Token → Store in localStorage → Attach to Headers
```

### AuthStore (MobX)
```javascript
class AuthStore {
  user = null;           // User info từ JWT payload
  token = localStorage.getItem('token');
  isLoading = false;     // Login loading state
  error = null;          // Error messages
}
```

### Protected Routes
- Tự động redirect về `/login` nếu chưa authenticated
- Token validation mỗi lần load app
- Automatic logout khi token expire

## 📁 Cấu Trúc Thư Mục

```
src/
├── pages/              # Application pages
│   ├── Home.jsx        # Dashboard với statistics
│   ├── Login.jsx       # Authentication page
│   ├── Countries.jsx   # Country CRUD management
│   ├── Department.jsx  # Department CRUD management
│   ├── Staff.jsx       # Staff CRUD management
│   └── TimeSheet.jsx   # TimeSheet CRUD management
├── shell/              # Layout components
│   ├── AppShell.jsx    # Main layout với navigation
│   └── App.jsx         # Layout export
├── stores/             # MobX state management
│   ├── AuthStore.js    # Authentication state
│   └── CountryStore.js # Country data state
├── routes.jsx          # React Router configuration
├── main.jsx            # Application entry point
└── app.css             # Global styles
```

## 🎨 Giao Diện Người Dùng

### Dashboard (Home.jsx)
- **Statistics Cards**: Total Staff, Departments, Countries, TimeSheets
- **Quick Actions**: Links đến các modules chính
- **Responsive Grid**: Material-UI Grid system

### Navigation Layout
- **AppBar**: Brand name, user info, logout button
- **Drawer**: Sidebar navigation với menu items
- **Responsive**: Mobile-friendly với collapsible menu

### Form Components
- **Material-UI TextField**: Standard input fields
- **Select Components**: Dropdown cho foreign keys
- **Date Pickers**: Date selection cho DOB, TimeSheet dates
- **Validation**: Real-time validation với Formik + Yup

## 🔌 API Integration Strategy

### API Client Configuration
```javascript
const API = import.meta.env.VITE_API || 'http://localhost:8071';

// Axios với auth headers
const response = await axios.post(`${API}/api/endpoint`, data, {
  headers: authStore.authHeaders  // Bearer token
});
```

### Error Handling Pattern
```javascript
try {
  const { data } = await axios.post(...);
  setRows(data?.content || []);
} catch (error) {
  console.warn('API failed, using mock data:', error.message);
  setRows(mockData);  // Fallback data
  setError('Using mock data - API connection failed');
}
```

### Search Functionality
- **Real-time Search**: Tìm kiếm theo keyword
- **Pagination**: pageIndex và pageSize parameters
- **API Endpoints**: `/api/{entity}/searchByPage`

## 📊 CRUD Operations

### Countries Management
- **Entity**: Country (code, name, description)
- **API**: `/api/hrCountry`
- **Operations**: Create, Read, Update, Delete
- **Search**: By keyword in name/description

### Department Management
- **Entity**: Department (code, name, description, parentId)
- **API**: `/api/hrDepartment`
- **Hierarchy**: Parent-child relationships
- **Operations**: Full CRUD với parent selection

### Staff Management
- **Entity**: Staff (personal info, department, position)
- **API**: `/api/staff`
- **Relationships**: Department, Position foreign keys
- **Status**: ACTIVE, INACTIVE, TERMINATED

### TimeSheet Management
- **Entity**: TimeSheet (staff, project, hours, date)
- **API**: `/api/timeSheet`
- **Workflow**: PENDING → APPROVED/REJECTED
- **Reporting**: Total hours calculation

## 🔄 State Management (MobX)

### AuthStore Pattern
```javascript
@observer
class AuthStore {
  @observable user = null;
  @observable token = null;
  @observable isLoading = false;
  
  @action async login(username, password) {
    // API call logic
  }
  
  @action logout() {
    // Clear state logic
  }
}
```

### Component Observer Pattern
```javascript
const Component = observer(() => {
  const { user, isAuthenticated } = authStore;
  return <div>{user?.username}</div>;
});
```

## 🧪 Form Validation (Yup)

### Validation Schema Example
```javascript
const schema = Yup.object({
  staffCode: Yup.string().required('Staff Code is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  hours: Yup.number().min(0.5).max(24).required('Hours is required'),
  dateOfBirth: Yup.date().required('Date of Birth is required')
});
```

### Formik Integration
```javascript
const form = useFormik({
  initialValues: { /* default values */ },
  validationSchema: schema,
  onSubmit: async (values) => {
    // API submission logic
  }
});
```

## 🎨 Styling Strategy

### CSS Variables
```css
:root { 
  --primary: #1976d2;
  --success: #4caf50;
  --warning: #ff9800;
  --error: #f44336;
  --background: #f5f5f5;
}
```

### Material-UI Theme Integration
- Consistent color palette
- Responsive spacing
- Professional button styling
- Table formatting

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px (stacked layout)
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px (sidebar layout)

### Mobile Optimizations
- Collapsible navigation drawer
- Stacked form fields
- Touch-friendly button sizes
- Responsive tables với horizontal scroll

## 🔧 Development Workflow

### Local Development
```bash
cd globits-react-vite
npm install
npm run dev
```

### Build for Production
```bash
npm run build
npm run preview  # Preview production build
```

### Environment Variables
```bash
# .env file
VITE_API=http://localhost:8071
```

## 🚀 Deployment Strategy

### Build Output
- **Vite**: Optimized production build
- **Assets**: Minified và compressed
- **Code Splitting**: Automatic chunk splitting

### Environment Configuration
- **Development**: localhost:8071
- **Staging**: Staging API endpoint
- **Production**: Production API endpoint

## 📋 Testing Strategy

### Manual Testing Checklist
- [ ] Login/Logout functionality
- [ ] Navigation between pages
- [ ] CRUD operations cho mỗi module
- [ ] Form validation messages
- [ ] Search functionality
- [ ] Error handling (API failure)
- [ ] Responsive design trên mobile
- [ ] JWT token expiration handling

### API Integration Testing
- [ ] Successful API calls
- [ ] Network failure scenarios
- [ ] Authentication errors (401)
- [ ] Authorization errors (403)
- [ ] Validation errors (400)

## 🔍 Debugging Guide

### Common Issues
1. **CORS Errors**: Backend cần enable CORS
2. **JWT Expired**: Tự động logout và redirect
3. **API Connection**: Fallback sang mock data
4. **Form Validation**: Check Yup schema và field names

### Browser DevTools
- **Network Tab**: Monitor API calls
- **Console**: Error messages và warnings
- **Application**: localStorage token inspection
- **React DevTools**: Component state inspection

## 📈 Performance Optimization

### Code Splitting
- Route-based code splitting
- Lazy loading cho heavy components
- Vendor chunk optimization

### State Management
- Minimal re-renders với MobX
- Efficient component updates
- Memoization cho expensive calculations

### API Optimization
- Debounced search inputs
- Pagination cho large datasets
- Efficient data fetching patterns

## 🔐 Security Considerations

### JWT Security
- Token storage trong localStorage
- Automatic token refresh logic
- Secure logout với token cleanup

### API Security
- HTTPS enforcement trong production
- Input validation trên frontend
- XSS protection với React

### Data Protection
- No sensitive data trong mock data
- Form sanitization
- Error message security (no stack traces)

## 📚 Additional Resources

### Documentation Links
- [React Documentation](https://react.dev/)
- [Material-UI Components](https://mui.com/)
- [MobX Documentation](https://mobx.js.org/)
- [Vite Documentation](https://vitejs.dev/)

### API Reference
- Backend API documentation: `/docs` endpoint
- Postman collection: `postman/GlobitsHR.postman_collection.json`
- Swagger/OpenAPI specs: Backend integration

---

**✅ Status**: Application ready for development và testing
**📧 Support**: Contact development team cho technical issues