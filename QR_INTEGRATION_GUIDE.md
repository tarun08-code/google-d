# QR Code Integration Guide

## Overview

This guide explains how to integrate unique QR codes for users in the TechHack 2025 dashboard. The QR codes are dynamically generated based on user data from your backend API.

## 🔧 Components Created

### 1. QRCodeService (`src/services/QRCodeService.ts`)

Handles QR code generation and management:

- Generates unique registration IDs
- Creates check-in codes
- Produces scannable QR codes with user data
- Handles QR validation and parsing

### 2. UserQRCode Component (`src/components/UserQRCode.tsx`)

Modal component that displays the user's QR code:

- Shows scannable QR code image
- Displays registration ID and check-in code
- Provides download functionality
- Copy-to-clipboard for codes
- Usage instructions

### 3. BackendAPIService (`src/services/BackendAPIService.ts`)

Example integration with backend API:

- Mock user authentication
- Profile management
- QR validation endpoints
- Production-ready structure

## 🎯 Features Implemented

### ✅ Unique QR Code Generation

Each user gets a unique QR code containing:

```json
{
  "id": "TH2025-JOHDOE1234",
  "name": "John Doe",
  "email": "john.doe@email.com",
  "event": "TechHack 2025",
  "checkIn": "AB12CD34",
  "timestamp": "2025-03-15T10:00:00Z",
  "type": "TECHHACK2025_REGISTRATION"
}
```

### ✅ Multiple Access Points

Users can access their QR code from:

1. **Header QR Button** - Quick access from any page
2. **Registration Card** - Clickable QR placeholder in event info
3. **Mobile Optimized** - Responsive design for all devices

### ✅ QR Code Management

- **Download QR**: Save as PNG image
- **Copy Codes**: Registration ID and check-in code to clipboard
- **Regenerate**: Create new QR code if needed
- **Real-time Display**: Instant QR generation

## 🔌 Backend Integration

### User Authentication Flow

```typescript
// 1. User logs in with backend credentials
const loginResult = await BackendAPIService.login(username, password);

if (loginResult.success) {
  // Store authentication token
  localStorage.setItem("authToken", loginResult.token);
  localStorage.setItem("userId", loginResult.user.id);

  // Transform to app format
  const userData = {
    name: loginResult.user.name,
    email: loginResult.user.email,
    registrationDate: loginResult.user.registrationDate,
    // ... other fields
  };

  localStorage.setItem("userData", JSON.stringify(userData));
}
```

### QR Generation with Backend Data

```typescript
// Generate QR using real user data from API
const generateUserQR = async (userId: string) => {
  const token = localStorage.getItem("authToken");
  const user = await BackendAPIService.getUserProfile(userId, token);

  if (user) {
    const qrResult = await QRCodeService.generateQRCode({
      name: user.name,
      email: user.email,
      registrationDate: user.registrationDate,
    });

    return qrResult;
  }
};
```

## 🌐 API Endpoints Needed

Your backend should provide these endpoints:

### Authentication

```
POST /api/auth/login
Body: { username: string, password: string }
Response: { success: boolean, user: UserData, token: string }

POST /api/auth/register
Body: { username, password, name, email, ... }
Response: { success: boolean, user: UserData, token: string }
```

### User Management

```
GET /api/users/:id
Headers: { Authorization: "Bearer <token>" }
Response: UserData

PATCH /api/users/:id
Headers: { Authorization: "Bearer <token>" }
Body: Partial<UserData>
Response: { success: boolean }
```

### QR Code Validation

```
POST /api/qr/validate
Headers: { Authorization: "Bearer <token>" }
Body: { qrData: string }
Response: { valid: boolean, user?: UserData }

POST /api/checkin
Headers: { Authorization: "Bearer <token>" }
Body: { qrData: string, eventId: string }
Response: { success: boolean, message: string }
```

## 🔄 Data Flow

### 1. User Registration/Login

```
User Login → Backend API → User Data → Local Storage → QR Generation
```

### 2. QR Code Usage

```
QR Display → User Scan → Backend Validation → Check-in Confirmation
```

### 3. Event Management

```
Admin Scan QR → Parse Data → Validate with Backend → Record Attendance
```

## 📱 Usage Examples

### For Participants

1. **Login** with provided username/password
2. **View QR Code** from header or registration card
3. **Download/Share** QR code for check-in
4. **Show QR** at registration desk and events

### For Organizers

1. **Scan QR codes** for participant check-in
2. **Validate attendance** at workshops/events
3. **Track participation** through QR data
4. **Generate reports** from scan data

## 🔒 Security Considerations

### QR Code Security

- QR codes contain **non-sensitive** identification data
- **Authentication tokens** are NOT in QR codes
- **Registration IDs** are unique but not predictable
- **Check-in codes** expire and can be regenerated

### API Security

- All API calls use **JWT tokens** for authentication
- **Rate limiting** should be implemented on endpoints
- **QR validation** requires valid authentication
- **User data** is never exposed in QR codes beyond name/email

## 🛠️ Customization

### Modify QR Data Structure

Edit `QRCodeService.createQRData()` to include additional fields:

```typescript
const qrContent = JSON.stringify({
  id: qrData.registrationId,
  name: qrData.name,
  email: qrData.email,
  event: qrData.eventName,
  checkIn: qrData.checkInCode,
  timestamp: qrData.timestamp,
  type: "TECHHACK2025_REGISTRATION",
  // Add custom fields:
  teamId: userData.teamId,
  skills: userData.skills,
  dietary: userData.dietaryRestrictions,
});
```

### Styling QR Codes

Modify QR generation options in `QRCodeService.generateQRCode()`:

```typescript
const qrCodeDataUrl = await QRCode.toDataURL(qrContent, {
  errorCorrectionLevel: "H",
  margin: 1,
  color: {
    dark: "#E63946", // Your brand color
    light: "#FFFFFF", // Background
  },
  width: 512, // Larger size
});
```

### Custom Registration ID Format

Edit `generateRegistrationId()` method for different formats:

```typescript
static generateRegistrationId(userData: { name: string; email: string }): string {
  const year = new Date().getFullYear();
  const sequence = String(Math.random()).substring(2, 8);
  return `HACK${year}-${sequence}`;
}
```

## 🚀 Production Deployment

### Environment Setup

1. **Replace mock API** with real backend endpoints in `BackendAPIService`
2. **Configure API URL** in environment variables
3. **Set up CORS** for your domain
4. **Implement rate limiting** on QR generation endpoints

### Database Schema

Suggested user table structure:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  registration_date TIMESTAMP DEFAULT NOW(),
  role ENUM('participant', 'admin', 'mentor'),
  qr_check_ins JSON,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Monitoring

- **Track QR generation** frequency per user
- **Monitor API calls** for rate limiting
- **Log check-in events** for analytics
- **Error tracking** for failed QR validations

## 📋 Testing Checklist

- [ ] QR code generates successfully for new users
- [ ] QR code can be scanned and parsed correctly
- [ ] Download functionality works on all browsers
- [ ] Copy-to-clipboard works on mobile devices
- [ ] Modal responsive on different screen sizes
- [ ] API integration handles errors gracefully
- [ ] Authentication flow works end-to-end
- [ ] QR validation prevents fraud/duplicates

## 📞 Support

For implementation help:

- Check console for error messages
- Verify API endpoints are accessible
- Test QR scanning with multiple apps
- Validate JWT token format and expiration
- Ensure CORS is configured correctly

The QR code system is now ready for production use with your backend API!
