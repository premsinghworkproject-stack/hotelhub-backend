# Authentication System Setup Guide

## 🚀 **Quick Setup Instructions**

Follow these steps to get your authentication system running with actual email sending.

### 📋 **Prerequisites**

- Node.js 16+ installed
- npm or yarn package manager
- Gmail account for SMTP access
- PostgreSQL database (optional for full functionality)

### 🔧 **Step 1: Environment Configuration**

1. **Copy environment file:**
   ```bash
   cp .env.example.backup .env
   ```

2. **Update .env with your Gmail credentials:**
   ```bash
   # Open .env file
   nano .env
   
   # Update these values:
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-specific-password
   JWT_SECRET=your-super-secret-jwt-key
   ```

3. **Generate Gmail App Password:**
   - Go to [Google Account Settings](https://myaccount.google.com/)
   - Security → 2-Step Verification → App passwords
   - Generate new app password
   - Use this password in SMTP_PASS

### 📧 **Step 2: Install Dependencies**

```bash
npm install
```

All dependencies are already installed from previous steps.

### 🗄️ **Step 3: Database Setup (Optional)**

If you want to persist OTP records:

1. **Create OTP table:**
   ```sql
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
   
   CREATE INDEX idx_otp_email ON otps(email);
   CREATE INDEX idx_otp_expires_at ON otps(expiresAt);
   ```

2. **Update database configuration:**
   ```bash
   # In .env file
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your-password
   DB_DATABASE=booking_db
   ```

### 🚀 **Step 4: Start the Application**

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

### 📧 **Step 5: Test the Authentication**

#### **GraphQL Playground**
Open: http://localhost:3000/graphql

#### **Test Signup:**
```graphql
mutation {
  signup(input: {
    name: "John Doe",
    email: "your-email@gmail.com",
    password: "password123"
  }) {
    success
    token
    message
  }
}
```

#### **Test Login:**
```graphql
mutation {
  login(input: {
    email: "your-email@gmail.com",
    password: "password123"
  }) {
    success
    token
    message
    requiresOTP
  }
}
```

#### **Test OTP Verification:**
```graphql
mutation {
  verifyOTP(input: {
    email: "your-email@gmail.com",
    otp: "123456"
  }) {
    success
    message
  }
}
```

## 📧 **Configuration Options**

### **Gmail SMTP Settings**
```bash
# For Gmail
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-character-app-password
```

### **Other SMTP Providers**

**Outlook:**
```bash
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
```

**SendGrid:**
```bash
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=true
```

### **Security Configuration**
```bash
# Strong JWT secret (generate with: openssl rand -base64 32)
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Bcrypt rounds for password hashing
BCRYPT_ROUNDS=12
```

## 📨 **Email Templates Location**

Templates are located at:
```
src/modules/auth/email-templates/
├── otp.hbs          # OTP verification template
└── welcome.hbs       # Welcome email template
```

### **Customizing Templates**

Edit the `.hbs` files to customize:
- Colors and styling
- Logo and branding
- Footer information
- Subject lines

## 🔍 **Testing Email Sending**

### **Development Testing**
```bash
# Start with debug logging
DEBUG=npm:* npm run start:dev
```

### **Check Email Logs**
```bash
# Console will show:
# OTP sent successfully to email: user@example.com
# Welcome email sent successfully to user@example.com
```

### **Common Issues & Solutions**

#### **Gmail Authentication Error**
```
Error: 535-5.7.8 Username and Password not accepted
```
**Solution:**
1. Enable 2-Step Verification in Gmail
2. Generate App Password (not regular password)
3. Use App Password in SMTP_PASS

#### **SMTP Connection Error**
```
Error: connect ECONNREFUSED
```
**Solution:**
1. Check SMTP_HOST and SMTP_PORT
2. Verify network connectivity
3. Check firewall settings

#### **Template Not Found**
```
Error: ENOENT: template not found
```
**Solution:**
1. Verify template files exist in email-templates/
2. Check template path in mailer.module.ts
3. Ensure Handlebars syntax is correct

## 🚀 **Production Deployment**

### **Environment Variables**
```bash
# Production .env
NODE_ENV=production
JWT_SECRET=your-production-secret-key
SMTP_HOST=your-smtp-provider.com
SMTP_PORT=587
SMTP_SECURE=true
```

### **Security Best Practices**
1. **Use environment variables** for all secrets
2. **Enable TLS/SSL** in production
3. **Set up reverse proxy** (nginx/Apache)
4. **Configure rate limiting**
5. **Monitor email deliverability**

### **Monitoring**
```bash
# Check logs
tail -f logs/application.log

# Monitor email delivery
# Check SMTP provider dashboard
```

## 📚 **API Documentation**

Complete API documentation is available at:
- **GraphQL Schema**: http://localhost:3000/graphql
- **Auth Guide**: `src/documentation/auth-system-guide.md`
- **Error Handling**: `src/documentation/graphql-error-handling.md`

## 🎯 **Next Steps**

1. **Test all mutations** in GraphQL Playground
2. **Verify email delivery** by checking your inbox
3. **Test error scenarios** (invalid OTP, wrong password, etc.)
4. **Implement password hashing** with bcrypt
5. **Add rate limiting** for OTP requests
6. **Set up monitoring** for production

## 🆘 **Support**

If you encounter issues:

1. **Check console logs** for detailed error messages
2. **Verify SMTP credentials** are correct
3. **Ensure Gmail App Password** is used (not regular password)
4. **Check network connectivity** and firewall settings
5. **Review template syntax** if emails aren't sending

**Your authentication system is now ready with full email functionality!** 🚀
