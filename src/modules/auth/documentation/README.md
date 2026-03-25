# Auth Module Documentation

## 🚀 **Authentication GraphQL API**

### 📋 **Available Mutations**

#### **✅ signup**
Creates a new user account and sends verification OTP.

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

**Response (New User):**
```json
{
  "data": {
    "signup": {
      "success": false,
      "token": null,
      "message": "Account created successfully! Please check your email for verification OTP to complete registration."
    }
  }
}
```

**Response (User Exists):**
```json
{
  "data": {
    "signup": {
      "success": false,
      "token": null,
      "message": "User already exists. OTP sent to your email for verification."
    }
  }
}
```

---

#### **✅ login**
Authenticates user and returns JWT token or requires OTP.

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

**Response (Success):**
```json
{
  "data": {
    "login": {
      "success": true,
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "message": "Login successful",
      "requiresOTP": false
    }
  }
}
```

**Response (OTP Required):**
```json
{
  "data": {
    "login": {
      "success": false,
      "token": null,
      "message": "OTP verification required",
      "requiresOTP": true
    }
  }
}
```

---

#### **✅ completeOTPVerification**
Verifies OTP and returns JWT token for authentication.

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

**Response (Success):**
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

**Response (Failed):**
```json
{
  "data": {
    "completeOTPVerification": {
      "success": false,
      "token": null,
      "message": "Invalid or expired OTP"
    }
  }
}
```

---

#### **✅ resendOTP**
Sends new OTP to user's email address.

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

**Response:**
```json
{
  "data": {
    "resendOTP": {
      "success": true,
      "message": "OTP sent to your email"
    }
  }
}
```

---

#### **✅ forgotPassword**
Sends password reset OTP to user's email with edge case handling.

```graphql
mutation {
  forgotPassword(input: {
    email: "john.doe@example.com"
  }) {
    success
    message
    accountDeleted
    requiresEmailVerification
  }
}
```

**Response (Success - Password Reset OTP Sent):**
```json
{
  "data": {
    "forgotPassword": {
      "success": true,
      "message": "Password reset OTP sent to your email",
      "accountDeleted": false,
      "requiresEmailVerification": false
    }
  }
}
```

**Response (Account Deleted):**
```json
{
  "data": {
    "forgotPassword": {
      "success": false,
      "message": "Account has been deleted",
      "accountDeleted": true,
      "requiresEmailVerification": false
    }
  }
}
```

**Response (Email Not Verified):**
```json
{
  "data": {
    "forgotPassword": {
      "success": false,
      "message": "Account not verified. Please verify your email first",
      "accountDeleted": false,
      "requiresEmailVerification": true
    }
  }
}
```

**Response (User Not Found):**
```json
{
  "data": {
    "forgotPassword": {
      "success": false,
      "message": "If an account with this email exists, a password reset OTP has been sent",
      "accountDeleted": false,
      "requiresEmailVerification": false
    }
  }
}
```

---

#### **✅ verifyForgotPasswordOTP**
Verifies password reset OTP and returns reset token.

```graphql
mutation {
  verifyForgotPasswordOTP(input: {
    email: "john.doe@example.com",
    otp: "123456"
  }) {
    success
    message
    resetToken
  }
}
```

**Response (Success):**
```json
{
  "data": {
    "verifyForgotPasswordOTP": {
      "success": true,
      "message": "OTP verified successfully. Use the reset token to reset your password",
      "resetToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

**Response (Failed):**
```json
{
  "data": {
    "verifyForgotPasswordOTP": {
      "success": false,
      "message": "Invalid or expired OTP",
      "resetToken": null
    }
  }
}
```

---

#### **✅ resetPassword**
Resets password using reset token from OTP verification.

```graphql
mutation {
  resetPassword(input: {
    email: "john.doe@example.com",
    newPassword: "newpassword123",
    resetToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }) {
    success
    token
    message
  }
}
```

**Response (Success):**
```json
{
  "data": {
    "resetPassword": {
      "success": true,
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "message": "Password reset successful"
    }
  }
}
```

**Response (Failed):**
```json
{
  "data": {
    "resetPassword": {
      "success": false,
      "token": null,
      "message": "Invalid or expired reset token"
    }
  }
}
```

---

### 🔒 **Authentication Flow**

#### **✅ New User Registration**
1. **signup** → Creates user, sends verification OTP
2. **completeOTPVerification** → Verifies email, returns JWT token
3. **login** → Can now login with email/password

#### **✅ Existing User Login**
1. **login** → May require OTP verification
2. **completeOTPVerification** → If required, verifies OTP and returns JWT token
3. **resendOTP** → If OTP expired/lost, request new OTP

#### **✅ Forgot Password Flow**
1. **forgotPassword** → Send password reset OTP (handles edge cases)
2. **verifyForgotPasswordOTP** → Verify OTP and get reset token
3. **resetPassword** → Use reset token to set new password

---

### 📋 **Input Types**

#### **✅ SignupInput**
```typescript
{
  name: string      // User's full name
  email: string     // User's email address (unique)
  password: string  // User's password (min 6 chars)
}
```

#### **✅ LoginInput**
```typescript
{
  email: string     // User's email address
  password: string  // User's password
}
```

#### **✅ VerifyOTPInput**
```typescript
{
  email: string     // User's email address
  otp: string       // 6-digit OTP code
}
```

#### **✅ ResendOTPInput**
```typescript
{
  email: string     // User's email address
}
```

#### **✅ ForgotPasswordInput**
```typescript
{
  email: string     // User's email address
}
```

#### **✅ VerifyForgotPasswordOTPInput**
```typescript
{
  email: string     // User's email address
  otp: string       // 6-digit OTP code
}
```

#### **✅ ResetPasswordInput**
```typescript
{
  email: string         // User's email address
  newPassword: string   // New password (min 6 chars, strength requirements)
  resetToken: string    // JWT reset token from OTP verification
}
```

---

### 📋 **Response Types**

#### **✅ AuthResponse**
```typescript
{
  success: boolean   // Operation success status
  token?: string    // JWT authentication token
  message?: string  // Success/error message
}
```

#### **✅ LoginResponse**
```typescript
{
  success: boolean        // Operation success status
  token?: string         // JWT authentication token
  message?: string       // Success/error message
  requiresOTP?: boolean  // Whether OTP verification is required
}
```

#### **✅ OTPResponse**
```typescript
{
  success: boolean   // Operation success status
  message: string    // Success/error message
}
```

#### **✅ ForgotPasswordResponse**
```typescript
{
  success: boolean                    // Operation success status
  message: string                     // Success/error message
  accountDeleted: boolean             // Whether account is deleted
  requiresEmailVerification: boolean  // Whether email verification is required
}
```

#### **✅ VerifyForgotPasswordOTPResponse**
```typescript
{
  success: boolean   // Operation success status
  message: string    // Success/error message
  resetToken?: string // JWT reset token for password reset
}
```

---

### 🛡️ **Security Features**

#### **✅ OTP Security**
- **6-digit codes**: Randomly generated
- **10-minute expiry**: Automatic expiration
- **3 attempts limit**: Prevents brute force
- **Database storage**: Persistent and secure

#### **✅ JWT Security**
- **24-hour expiry**: Token lifetime
- **User data**: Contains user ID, email, name
- **Secure signing**: HMAC-SHA256 algorithm

#### **✅ Input Validation**
- **Email validation**: Proper email format
- **Password requirements**: Minimum length validation
- **OTP format**: 6-digit numeric validation

---

### 🚨 **Error Handling**

#### **✅ Common Errors**
- **User already exists**: Signup with existing email
- **Invalid credentials**: Login with wrong password
- **Invalid OTP**: Wrong or expired OTP code
- **Too many attempts**: OTP attempt limit exceeded
- **User not found**: Email doesn't exist in system

#### **✅ Error Response Format**
```json
{
  "errors": [
    {
      "message": "User already exists",
      "code": "USER_EXISTS",
      "extensions": {
        "field": "email"
      }
    }
  ]
}
```

---

### 📧 **Email Integration**

#### **✅ Email Service**
- **SMTP Configuration**: Gmail SMTP with app passwords
- **Dynamic Templates**: TypeScript-based templates
- **HTML & Text**: Both formats supported
- **Error Handling**: Failed email logging

#### **✅ Template Types**
- **EmailTemplateType.OTP**: OTP verification emails
- **Dynamic Content**: User names, OTP codes included

---

### 🔧 **Technical Implementation**

#### **✅ Database Schema**
```sql
users table:
- id (PK, auto-increment)
- name (string, not null)
- email (string, unique, not null)
- createdAt/updatedAt (timestamps)

otps table:
- id (PK, auto-increment)
- email (string, indexed)
- otp (string, 6-digit)
- attempts (integer, default 0)
- isVerified (boolean, default false)
- expiresAt (datetime, indexed)
- userId (FK to users, nullable)
- createdAt/updatedAt (timestamps)
```

#### **✅ Services Architecture**
- **AuthService**: Main authentication logic
- **OTPService**: OTP generation and verification
- **EmailService**: Email sending functionality
- **UserRepository**: User data operations
- **OTPRepository**: OTP data operations

---

### 🎯 **Usage Examples**

#### **✅ Complete New User Registration**
```graphql
# Step 1: Create account
mutation {
  signup(input: {
    name: "Alice Smith",
    email: "alice@example.com",
    password: "alice123"
  }) {
    success
    message
  }
}

# Step 2: Verify email (check email for OTP)
mutation {
  completeOTPVerification(input: {
    email: "alice@example.com",
    otp: "123456"  # OTP from email
  }) {
    success
    token
    message
  }
}
```

#### **✅ Existing User Login**
```graphql
# Step 1: Try login
mutation {
  login(input: {
    email: "bob@example.com",
    password: "bob123"
  }) {
    success
    requiresOTP
    message
  }
}

# Step 2: If OTP required, verify it
mutation {
  completeOTPVerification(input: {
    email: "bob@example.com",
    otp: "654321"  # OTP from email
  }) {
    success
    token
    message
  }
}
```

#### **✅ Resend OTP**
```graphql
mutation {
  resendOTP(input: {
    email: "bob@example.com"
  }) {
    success
    message
  }
}
```

#### **✅ Forgot Password Flow**
```graphql
# Step 1: Request password reset
mutation {
  forgotPassword(input: {
    email: "bob@example.com"
  }) {
    success
    message
    accountDeleted
    requiresEmailVerification
  }
}

# Step 2: Verify the reset OTP (check email for OTP)
mutation {
  verifyForgotPasswordOTP(input: {
    email: "bob@example.com",
    otp: "123456"  # OTP from email
  }) {
    success
    message
    resetToken
  }
}

# Step 3: Reset password using the reset token
mutation {
  resetPassword(input: {
    email: "bob@example.com",
    newPassword: "newSecurePassword123",
    resetToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."  # Token from step 2
  }) {
    success
    token
    message
  }
}
```

---

### 🚀 **Quick Start**

#### **✅ For Frontend Developers**
1. **Use signup** to create new accounts
2. **Use completeOTPVerification** to verify emails
3. **Use login** for authenticated access
4. **Handle requiresOTP** flag in login responses
5. **Use forgotPassword** for password reset requests
6. **Use verifyForgotPasswordOTP** to verify reset OTPs
7. **Use resetPassword** to complete password reset with token

#### **✅ GraphQL Playground**
- **URL**: `http://localhost:8200/graphql`
- **Test**: Copy-paste examples above
- **Debug**: Check console for detailed logs

**This documentation covers all authentication operations!** 🎉
