# 🧪 Tài Liệu Kiểm Thử - Globits HR React+Vite

## 📋 Tổng Quan Kiểm Thử

### Mục Tiêu Kiểm Thử
- ✅ Đảm bảo tất cả chức năng hoạt động đúng yêu cầu
- ✅ Xác minh giao diện responsive trên các thiết bị
- ✅ Kiểm tra tích hợp API với backend
- ✅ Đánh giá hiệu suất và trải nghiệm người dùng

### Phạm Vi Kiểm Thử
- **Functional Testing**: Tất cả modules CRUD
- **Integration Testing**: API integration
- **UI/UX Testing**: Responsive design, accessibility
- **Performance Testing**: Loading time, API response
- **Security Testing**: Authentication, authorization

## 🧪 Test Plan

### 1. Unit Testing

#### 1.1 Component Testing
```javascript
// Example: Countries Component Test
describe('Countries Component', () => {
  test('renders loading state initially', () => {
    render(<Countries />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test('displays countries data correctly', async () => {
    mockApiResponse(mockCountries);
    render(<Countries />);
    
    await waitFor(() => {
      expect(screen.getByText('Vietnam')).toBeInTheDocument();
    });
  });

  test('handles API errors gracefully', async () => {
    mockApiError();
    render(<Countries />);
    
    await waitFor(() => {
      expect(screen.getByText(/using mock data/i)).toBeInTheDocument();
    });
  });
});
```

#### 1.2 Form Validation Testing
```javascript
// Form validation test cases
describe('Form Validation', () => {
  test('validates required fields', async () => {
    render(<CountryForm />);
    
    fireEvent.click(screen.getByText(/save/i));
    
    await waitFor(() => {
      expect(screen.getByText(/code is required/i)).toBeInTheDocument();
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    });
  });

  test('validates email format', async () => {
    render(<StaffForm />);
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'invalid-email' }
    });
    fireEvent.click(screen.getByText(/save/i));
    
    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    });
  });

  test('validates number ranges', async () => {
    render(<TimeSheetForm />);
    
    fireEvent.change(screen.getByLabelText(/hours/i), {
      target: { value: '25' }
    });
    fireEvent.click(screen.getByText(/save/i));
    
    await waitFor(() => {
      expect(screen.getByText(/hours must be less than or equal to 24/i)).toBeInTheDocument();
    });
  });
});
```

#### 1.3 State Management Testing
```javascript
// MobX Store Testing
describe('AuthStore', () => {
  test('initializes with null user', () => {
    const store = new AuthStore();
    expect(store.user).toBeNull();
    expect(store.token).toBeNull();
  });

  test('successful login sets user and token', async () => {
    const store = new AuthStore();
    mockApiLoginSuccess();
    
    const result = await store.login('user', 'pass');
    
    expect(result.success).toBe(true);
    expect(store.user).toBeDefined();
    expect(store.token).toBeDefined();
  });

  test('logout clears user data', () => {
    const store = new AuthStore();
    store.user = { username: 'test' };
    store.token = 'token123';
    
    store.logout();
    
    expect(store.user).toBeNull();
    expect(store.token).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
  });
});
```

### 2. Integration Testing

#### 2.1 API Integration Testing
```javascript
// API Integration Test
describe('API Integration', () => {
  test('successful countries fetch', async () => {
    const mockResponse = {
      content: [
        { id: 1, code: 'VN', name: 'Vietnam' },
        { id: 2, code: 'US', name: 'United States' }
      ]
    };
    
    server.use(
      rest.post('/api/hrCountry/searchByPage', (req, res, ctx) => {
        return res(ctx.json(mockResponse));
      })
    );
    
    render(<Countries />);
    
    await waitFor(() => {
      expect(screen.getByText('Vietnam')).toBeInTheDocument();
      expect(screen.getByText('United States')).toBeInTheDocument();
    });
  });

  test('handles network errors', async () => {
    server.use(
      rest.post('/api/hrCountry/searchByPage', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ error: 'Server error' }));
      })
    );
    
    render(<Countries />);
    
    await waitFor(() => {
      expect(screen.getByText(/using mock data/i)).toBeInTheDocument();
    });
  });

  test('sends correct authentication headers', async () => {
    const mockToken = 'test-token-123';
    localStorage.setItem('token', mockToken);
    
    let capturedHeaders;
    server.use(
      rest.post('/api/hrCountry/searchByPage', (req, res, ctx) => {
        capturedHeaders = req.headers.all();
        return res(ctx.json({ content: [] }));
      })
    );
    
    render(<Countries />);
    
    await waitFor(() => {
      expect(capturedHeaders).toContainEqual(['authorization', `Bearer ${mockToken}`]);
    });
  });
});
```

#### 2.2 Authentication Flow Testing
```javascript
describe('Authentication Flow', () => {
  test('redirects to login when not authenticated', () => {
    render(
      <MemoryRouter initialEntries={['/countries']}>
        <App />
      </MemoryRouter>
    );
    
    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });

  test('allows access to protected routes when authenticated', () => {
    localStorage.setItem('token', 'valid-token');
    
    render(
      <MemoryRouter initialEntries={['/countries']}>
        <App />
      </MemoryRouter>
    );
    
    expect(screen.getByText(/countries management/i)).toBeInTheDocument();
  });

  test('logout redirects to login page', async () => {
    localStorage.setItem('token', 'valid-token');
    
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    
    fireEvent.click(screen.getByText(/logout/i));
    
    await waitFor(() => {
      expect(screen.getByText(/login/i)).toBeInTheDocument();
    });
  });
});
```

#### 2.3 CRUD Operations Testing
```javascript
describe('CRUD Operations', () => {
  describe('Create Operation', () => {
    test('creates new country successfully', async () => {
      render(<Countries />);
      
      // Click add button
      fireEvent.click(screen.getByText(/add new country/i));
      
      // Fill form
      fireEvent.change(screen.getByLabelText(/code/i), {
        target: { value: 'JP' }
      });
      fireEvent.change(screen.getByLabelText(/name/i), {
        target: { value: 'Japan' }
      });
      
      // Submit form
      fireEvent.click(screen.getByText(/save/i));
      
      // Verify API call
      await waitFor(() => {
        expect(mockAxios.post).toHaveBeenCalledWith(
          '/api/hrCountry',
          expect.objectContaining({
            code: 'JP',
            name: 'Japan'
          })
        );
      });
    });
  });

  describe('Update Operation', () => {
    test('updates country successfully', async () => {
      render(<Countries />);
      
      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByText('Vietnam')).toBeInTheDocument();
      });
      
      // Click edit button
      fireEvent.click(screen.getAllByText(/edit/i)[0]);
      
      // Update name
      fireEvent.change(screen.getByLabelText(/name/i), {
        target: { value: 'Vietnam Updated' }
      });
      
      // Submit form
      fireEvent.click(screen.getByText(/save/i));
      
      // Verify API call
      await waitFor(() => {
        expect(mockAxios.put).toHaveBeenCalledWith(
          expect.stringContaining('/api/hrCountry/'),
          expect.objectContaining({
            name: 'Vietnam Updated'
          })
        );
      });
    });
  });