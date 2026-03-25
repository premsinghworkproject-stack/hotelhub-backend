# Authentication System Documentation

## 🔐 **Complete Authentication Implementation**

A comprehensive authentication system with signup, login, OTP verification, email templates, and configuration management.

## 📋 **Features Overview**

### **✅ User Authentication**
- **Signup**: New user registration with email verification
- **Login**: User authentication with OTP support
- **OTP Verification**: Email-based one-time password verification
- **Token Generation**: JWT-based authentication tokens

### **✅ Email Services**
- **OTP Emails**: Professional HTML email templates
- **Welcome Emails**: New user onboarding emails
- **Password Reset**: Secure password reset functionality
- **Template System**: Scalable email template management

### **✅ Security Features**
- **GraphQL Error Handling**: Native GraphQL errors with proper codes
- **Input Validation**: Comprehensive validation for all inputs
- **OTP Security**: Time-limited, attempt-limited OTPs
- **JWT Tokens**: Secure token-based authentication

## 🏗️ **Architecture Overview**

```
Auth Module Structure:
├── auth.module.ts          # Module configuration
├── auth.resolver.ts        # GraphQL mutations
├── auth.service.ts         # Business logic
├── otp.service.ts          # OTP management
├── otp.repository.ts       # OTP data storage
├── email.service.ts        # Email sending
├── email-templates.ts     # Email templates
├── auth.model.ts          # GraphQL models
└── dto/auth.input.ts       # Input types
```

## 🔧 **GraphQL Mutations**

### **1. Signup Mutation**
```graphql
mutation {
  signup(input: {
    name: "John Doe",
    email: "john.doe@example.com",
    password: "password123"
  }) {
    success
    token
    message
  }
}
```

**Response Examples:**

**New User Success:**
```json
{
  "data": {
    "signup": {
      "success": true,
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "message": "User created successfully"
    }
  }
}
```

**Existing User:**
```json
{
  "data": {
    "signup": {
      "success": false,
      "message": "User already exists. OTP sent to your email for verification."
    }
  }
}
```

### **2. Login Mutation**
```graphql
mutation {
  login(input: {
    email: "john.doe@example.com",
    password: "password123"
  }) {
    success
    token
    message
    requiresOTP
  }
}
```

**Response Examples:**

**Successful Login:**
```json
{
  "data": {
    "login": {
      "success": true,
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "message": "Login successful"
    }
  }
}
```

**OTP Required:**
```json
{
  "data": {
    "login": {
      "success": false,
      "message": "OTP verification required",
      "requiresOTP": true
    }
  }
}
```

### **3. Verify OTP Mutation**
```graphql
mutation {
  verifyOTP(input: {
    email: "john.doe@example.com",
    otp: "123456"
  }) {
    success
    message
  }
}
```

**Response Examples:**

**Successful Verification:**
```json
{
  "data": {
    "verifyOTP": {
      "success": true,
      "message": "OTP verified successfully"
    }
  }
}
```

**Invalid OTP:**
```json
{
  "errors": [
    {
      "message": "Invalid OTP",
      "extensions": {
        "code": "BAD_REQUEST",
        "field": "otp"
      }
    }
  ]
}
```

### **4. Complete OTP Verification Mutation**
```graphql
mutation {
  completeOTPVerification(input: {
    email: "john.doe@example.com",
    otp: "123456"
  }) {
    success
    token
    message
  }
}
```

**Response:**
```json
{
  "data": {
    "completeOTPVerification": {
      "success": true,
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "message": "OTP verified successfully"
    }
  }
}
```

### **5. Resend OTP Mutation**
```graphql
mutation {
  resendOTP(input: {
    email: "john.doe@example.com"
  }) {
    success
    message
  }
}
```

## 📧 **Service Implementation**

### **AuthService Methods**

#### **signup(signupInput: SignupInput)**
- Validates input (name, email, password)
- Checks if user already exists
- Creates new user or sends OTP for existing user
- Generates JWT token for successful signup
- Sends welcome email

#### **login(loginInput: LoginInput)**
- Validates input (email, password)
- Finds user by email
- Checks if OTP verification is required
- Verifies password credentials
- Generates JWT token for successful login

#### **verifyOTP(verifyOTPInput: VerifyOTPInput)**
- Validates OTP and email
- Checks OTP expiry (10 minutes)
- Limits maximum attempts (3)
- Marks OTP as verified

#### **completeOTPVerification(verifyOTPInput: VerifyOTPInput)**
- Verifies OTP and generates JWT token
- Combines OTP verification with authentication

#### **resendOTP(resendOTPInput: ResendOTPInput)**
- Generates new OTP for existing user
- Sends OTP email
- Validates user exists

### **OTPService Methods**

#### **generateOTP(email: string)**
- Generates 6-digit OTP
- Sets 10-minute expiry
- Handles existing OTP records
- Validates email format

#### **verifyOTP(email: string, otp: string)**
- Finds OTP record by email and OTP
- Validates expiry and attempts
- Marks as verified on success

#### **needsOTPVerification(email: string)**
- Checks if user has pending OTP verification
- Returns boolean for OTP requirement

### **EmailService Interface**

#### **sendOTPEmail(email: string, otp: string)**
- Sends OTP verification email
- Uses professional HTML templates
- Logs email sending for debugging

#### **sendWelcomeEmail(email: string, name: string)**
- Sends welcome email to new users
- Professional onboarding template
- Includes user account details

## 🎨 **Email Templates**

### **OTP Verification Template**
- **Professional Design**: Modern, responsive HTML
- **Clear Instructions**: Step-by-step verification guide
- **Security Features**: OTP expiry warning, security notice
- **Brand Consistency**: Consistent with booking system theme

### **Welcome Email Template**
- **Personalization**: User name and email included
- **Account Details**: Clear display of user information
- **Call-to-Action**: "Get Started" button
- **Professional Design**: Modern, branded layout

### **Password Reset Template**
- **Security Focus**: Clear security notices
- **Expiration Warning**: Link expiry information
- **Professional Layout**: Consistent branding
- **Accessibility**: Text-only version available

## 🔐 **Security Features**

### **OTP Security**
- **Time-Limited**: 10-minute expiry
- **Attempt-Limited**: Maximum 3 attempts
- **Unique Codes**: Cryptographically secure OTP generation
- **Email Validation**: Proper email format checking

### **JWT Security**
- **Secure Secret**: Environment-based secret key
- **Token Expiry**: 24-hour token lifetime
- **Payload Protection**: User ID, email, name only
- **Algorithm**: HS256 for token signing

### **Input Validation**
- **GraphQL Errors**: Native GraphQL error handling
- **Field Context**: Specific field error identification
- **Error Codes**: Standardized error response codes
- **Sanitization**: Input trimming and validation

## 📋 **Configuration Management**

### **Environment Variables**
```bash
# JWT Configuration
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=24h

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Application Configuration
NODE_ENV=development
PORT=3000

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=booking_db
```

### **ConfigService Features**
- **Centralized Configuration**: Single source for all settings
- **Environment-Specific**: Development vs production settings
- **Type Safety**: TypeScript interfaces for all configs
- **Validation**: Default values and validation

## 🚀 **Usage Examples**

### **Frontend Integration**

#### **React/Angular Example**
```typescript
// Signup
const signupResponse = await apolloClient.mutate({
  mutation: SIGNUP_MUTATION,
  variables: {
    input: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123'
    }
  }
});

if (signupResponse.data.signup.success) {
  localStorage.setItem('token', signupResponse.data.signup.token);
  // Redirect to dashboard
} else {
  // Show error message
  alert(signupResponse.data.signup.message);
}

// Login
const loginResponse = await apolloClient.mutate({
  mutation: LOGIN_MUTATION,
  variables: {
    input: {
      email: 'john.doe@example.com',
      password: 'password123'
    }
  }
});

if (loginResponse.data.login.requiresOTP) {
  // Redirect to OTP verification
  window.location.href = '/verify-otp';
} else if (loginResponse.data.login.success) {
  localStorage.setItem('token', loginResponse.data.login.token);
  // Redirect to dashboard
}
```

#### **Authentication Guard**
```typescript
const token = localStorage.getItem('token');
if (token) {
  // Set Authorization header
  apolloClient.setLink(
    new HttpLink({
      uri: 'http://localhost:3000/graphql',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  );
}
```

## 📊 **Error Handling**

### **GraphQL Error Codes**
- **`BAD_REQUEST`**: Input validation errors (400)
- **`NOT_FOUND`**: Resource not found (404)
- **`CONFLICT`**: Resource conflicts (409)
- **`INTERNAL_SERVER_ERROR`**: Server errors (500)
- **`FORBIDDEN`**: Authorization errors (403)
- **`UNAUTHORIZED`**: Authentication errors (401)

### **Error Response Format**
```json
{
  "errors": [
    {
      "message": "User name is required",
      "locations": [
        {
          "line": 2,
          "column": 3
        }
      ],
      "path": ["signup"],
      "extensions": {
        "code": "BAD_REQUEST",
        "field": "name",
        "timestamp": "2024-03-19T16:30:00.000Z"
      }
    }
  ],
  "data": null
}
```

## 🔧 **Development Setup**

### **Installation**
```bash
# Install required packages
npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt

# Environment setup
cp .env.example .env
# Edit .env with your configuration
```

### **Database Setup**
```sql
-- OTP table
CREATE TABLE otps (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  otp VARCHAR(10) NOT NULL,
  attempts INTEGER DEFAULT 0,
  isVerified BOOLEAN DEFAULT FALSE,
  expiresAt TIMESTAMP NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_otp_email ON otps(email);
CREATE INDEX idx_otp_expires_at ON otps(expiresAt);
```

### **Testing**
```bash
# Start development server
npm run start:dev

# GraphQL Playground will be available at:
http://localhost:3000/graphql

# Test mutations in GraphQL Playground
# Use the provided examples above
```

## 🎯 **Best Practices**

### **✅ Security**
- **Never log OTPs**: Avoid storing sensitive data
- **Rate Limiting**: Implement OTP request limits
- **Secure Headers**: Use HTTPS in production
- **Input Sanitization**: Always validate and sanitize inputs

### **✅ Performance**
- **Database Indexing**: Optimize OTP queries
- **Email Queue**: Use background job for emails
- **Caching**: Cache user sessions appropriately
- **Connection Pooling**: Optimize database connections

### **✅ User Experience**
- **Clear Error Messages**: User-friendly error descriptions
- **Progressive Disclosure**: Only reveal necessary information
- **Consistent Branding**: Maintain visual consistency
- **Mobile Responsive**: Ensure emails work on all devices

## 🚀 **Implementation Status**

### **✅ Completed Features**
- **Auth Module**: Complete authentication system
- **GraphQL Mutations**: All auth operations
- **OTP System**: Secure OTP generation and verification
- **Email Templates**: Professional HTML templates
- **Configuration**: Centralized config management
- **Error Handling**: GraphQL-native error handling

### **✅ Security Features**
- **JWT Authentication**: Secure token-based auth
- **OTP Security**: Time-limited, attempt-limited
- **Input Validation**: Comprehensive validation
- **GraphQL Errors**: Proper error codes and context

### **✅ Developer Experience**
- **TypeScript**: Full type safety
- **Documentation**: Comprehensive API documentation
- **Examples**: Ready-to-use code examples
- **Testing**: GraphQL Playground ready

**Complete authentication system with OTP verification, email templates, and GraphQL error handling!** 🔐
