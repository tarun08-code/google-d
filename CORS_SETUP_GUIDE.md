# CORS Configuration Guide

## Problem

You're experiencing a CORS (Cross-Origin Resource Sharing) error when making requests from `http://localhost:5173` to `https://eventhub.tigerjeshy.live`. This happens because the server doesn't include the necessary CORS headers in its response.

## Error Message

```
Access to fetch at 'https://eventhub.tigerjeshy.live/users/signup/admin' from origin 'http://localhost:5173' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## Solutions Implemented

### 1. Frontend CORS Configuration (Vite)

Updated `vite.config.ts` with:

```typescript
server: {
  cors: {
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'https://eventhub.tigerjeshy.live',
      process.env.VITE_API_BASE_URL || ''
    ].filter(Boolean),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'Cache-Control',
      'X-HTTP-Method-Override'
    ]
  },
  proxy: {
    '/api': {
      target: process.env.VITE_API_BASE_URL || 'http://localhost:8080',
      changeOrigin: true,
      secure: false,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
}
```

### 2. CORS-Enabled API Client

Created `src/services/CorsApiClient.ts` that:

- Automatically handles CORS headers
- Includes proper preflight request handling
- Provides consistent error handling
- Supports both direct API calls and proxy routes

### 3. Updated Authentication Components

Both `AdminLoginModal.tsx` and `AuthModal.tsx` now use the CORS-enabled API client with:

- Proper error handling for CORS issues
- TypeScript type safety
- Better user feedback for connection issues

## Backend Server Configuration Required

**The backend server at `https://eventhub.tigerjeshy.live` needs to be configured with proper CORS headers:**

### For Express.js Server:

```javascript
const cors = require("cors");

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "https://your-production-domain.com",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
      "Cache-Control",
    ],
  })
);
```

### For Spring Boot Server:

```java
@Configuration
@EnableWebMvc
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(
                    "http://localhost:3000",
                    "http://localhost:5173",
                    "http://localhost:5174",
                    "http://localhost:5175"
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

### For Nginx Reverse Proxy:

```nginx
location /api {
    add_header 'Access-Control-Allow-Origin' 'http://localhost:5173' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
    add_header 'Access-Control-Allow-Headers' 'Origin, X-Requested-With, Content-Type, Accept, Authorization' always;
    add_header 'Access-Control-Allow-Credentials' 'true' always;

    if ($request_method = 'OPTIONS') {
        add_header 'Access-Control-Allow-Origin' 'http://localhost:5173';
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS';
        add_header 'Access-Control-Allow-Headers' 'Origin, X-Requested-With, Content-Type, Accept, Authorization';
        add_header 'Access-Control-Allow-Credentials' 'true';
        return 204;
    }

    proxy_pass https://eventhub.tigerjeshy.live;
}
```

## Environment Variables

Updated `.env` file includes:

```properties
VITE_API_BASE_URL=https://eventhub.tigerjeshy.live
VITE_ENABLE_CORS_PROXY=true
VITE_CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173,http://localhost:5174,http://localhost:5175
VITE_CORS_CREDENTIALS=true
```

## Debugging CORS Issues

1. **Check Network Tab**: Look for OPTIONS preflight requests
2. **Inspect Response Headers**: Verify `Access-Control-Allow-Origin` is present
3. **Use Proxy Route**: Try using `/api/users/signup/admin` instead of direct URL
4. **Browser Developer Tools**: Check console for detailed CORS errors

## Testing

To test if CORS is working:

1. **Health Check**:

```javascript
import { corsApiClient } from "./src/services/CorsApiClient";

const testConnection = async () => {
  const isHealthy = await corsApiClient.healthCheck();
  console.log("API Health:", isHealthy);
};
```

2. **Manual Test**:

```javascript
// Test direct API call
const response = await corsApiClient.post("/users/signup/admin", testData);
console.log("Response:", response);
```

## Quick Fixes

### Option 1: Use Proxy (Temporary)

Set `useProxy: true` in API calls to route through Vite proxy:

```javascript
const response = await corsApiClient.post("/users/signup/admin", data, {
  useProxy: true,
});
```

### Option 2: Browser Extension (Development Only)

Install "CORS Unblock" extension for temporary development (NOT for production).

### Option 3: Backend Update (Recommended)

Contact your backend team to add proper CORS headers to `https://eventhub.tigerjeshy.live`.

## Production Considerations

1. **Whitelist Specific Origins**: Don't use `*` for `Access-Control-Allow-Origin` in production
2. **HTTPS Only**: Ensure all production traffic uses HTTPS
3. **CSP Headers**: Add Content Security Policy headers
4. **Rate Limiting**: Implement rate limiting on CORS endpoints

## Next Steps

1. ✅ Frontend CORS handling implemented
2. ⏳ Backend server needs CORS configuration at `https://eventhub.tigerjeshy.live`
3. ⏳ Test with updated backend
4. ⏳ Deploy with proper production CORS settings
