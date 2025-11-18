# 🔧 Hướng Dẫn Cấu Hình CORS cho Spring Boot Backend

## Tổng Quan
CORS (Cross-Origin Resource Sharing) là cơ chế cho phép các ứng dụng web từ domain khác nhau có thể truy cập lẫn nhau. Khi frontend React chạy trên `http://localhost:5173` và backend Spring Boot chạy trên `http://localhost:8071`, cần cấu hình CORS để cho phép truy cập.

## Giải Quyết Các Lỗi Hiện Tại

### Lỗi CORS hiện tại:
```
Access to XMLHttpRequest at 'http://localhost:8071/api/hrDepartment/searchByPage' from origin 'http://localhost:5173' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: It does not have HTTP ok status.
```

## Cách 1: Cấu Hình Global CORS (Khuyến Nghị)

Tạo file cấu hình CORS toàn cục trong Spring Boot:

**File: `src/main/java/com/globits/config/WebConfig.java`**

```java
package com.globits.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:5173", "http://127.0.0.1:5173")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
```

## Cách 2: Cấu Hình CORS trên Từng Controller

Thêm annotation `@CrossOrigin` vào từng controller:

**Ví dụ cho CountryController:**

```java
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class CountryController {
    
    @PostMapping("/hrCountry/searchByPage")
    public ResponseEntity<Page<CountryDTO>> searchCountries(@RequestBody SearchRequest request) {
        // Implementation
    }
}
```

## Cách 3: Cấu Hình CORS với Security (Nếu có Spring Security)

Nếu bạn sử dụng Spring Security, cần thêm cấu hình trong SecurityConfig:

**File: `src/main/java/com/globits/config/SecurityConfig.java`**

```java
package com.globits.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.cors().and().csrf().disable()
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/api/**").permitAll()
                .anyRequest().authenticated()
            );
        return http.build();
    }
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173", "http://127.0.0.1:5173"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration);
        return source;
    }
}
```

## Cách 4: Cấu Hình application.properties

Thêm cấu hình vào `application.properties`:

```properties
# CORS Configuration
cors.allowed-origins=http://localhost:5173,http://127.0.0.1:5173
cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
cors.allowed-headers=*
cors.allow-credentials=true
cors.max-age=3600
```

## Kiểm Tra CORS Sau Khi Cấu Hình

Sau khi áp dụng một trong các cách trên, kiểm tra lại bằng cách:

1. **Khởi động lại Spring Boot backend**
2. **Chạy test script** để kiểm tra endpoints
3. **Refresh trang React** để xem lỗi CORS đã hết chưa

## Test CORS với curl

```bash
# Test preflight request
curl -X OPTIONS http://localhost:8071/api/hrDepartment/searchByPage \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type"

# Test actual request
curl -X POST http://localhost:8071/api/hrDepartment/searchByPage \
  -H "Origin: http://localhost:5173" \
  -H "Content-Type: application/json" \
  -d '{"pageIndex":0,"pageSize":20,"keyword":""}'
```

## Lưu Ý Quan Trọng

1. **Luôn restart Spring Boot** sau khi thay đổi cấu hình
2. **Kiểm tra logs** để xem có lỗi nào không
3. **Test từng endpoint** sau khi cấu hình
4. **Kiểm tra firewall** nếu vẫn bị chặn

## Giải Quyết Các Lỗi Cụ Thể

### Lỗi 404 Not Found (Departments)
- Kiểm tra xem `DepartmentController` có tồn tại không
- Kiểm tra `@RequestMapping` path
- Kiểm tra method signature

### Lỗi 405 Method Not Allowed (Positions, Projects, TimeSheets)
- Controller tồn tại nhưng không hỗ trợ POST
- Có thể chỉ hỗ trợ GET hoặc endpoints khác
- Kiểm tra `@PostMapping` trong controller

### Lỗi 500 Internal Server Error (Staff)
- Kiểm tra logs Spring Boot để xem lỗi chi tiết
- Có thể lỗi database connection, query, hoặc null pointer

### Lỗi CORS (Tất cả các endpoints khác)
- Áp dụng cấu hình CORS như hướng dẫn trên
- Kiểm tra `@CrossOrigin` annotation