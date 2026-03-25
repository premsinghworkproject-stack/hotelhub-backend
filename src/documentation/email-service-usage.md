# Email Service Usage Examples

## 🚀 **How to Use the Common Email Service**

### **✅ Import the Service**
```typescript
import { EmailService, EmailTemplateType } from '../../common/email/email.service';
```

### **✅ Inject in Your Service**
```typescript
@Injectable()
export class AuthService {
  constructor(
    private readonly emailService: EmailService,
  ) {}
}
```

### **✅ Send Emails Using the Common Method**

#### **The Only Way: Using sendEmailTemplate**
```typescript
// Send OTP email
await this.emailService.sendEmailTemplate({
  to: 'user@example.com',
  templateType: EmailTemplateType.OTP,
  context: {
    otp: '123456',
    userName: 'John Doe' // Optional
  }
});

// Send welcome email
await this.emailService.sendEmailTemplate({
  to: 'user@example.com',
  templateType: EmailTemplateType.WELCOME,
  context: {
    userName: 'John Doe',
    userEmail: 'user@example.com'
  }
});

// Send password reset email
await this.emailService.sendEmailTemplate({
  to: 'user@example.com',
  templateType: EmailTemplateType.PASSWORD_RESET,
  context: {
    resetToken: 'abc123',
    userName: 'John Doe' // Optional
  }
});
```

### **✅ Context Data Structure**

#### **OTP Email Context**
```typescript
{
  otp: string;           // Required: The OTP code
  userName?: string;      // Optional: User's name for personalization
}
```

#### **Welcome Email Context**
```typescript
{
  userName: string;       // Required: User's name
  userEmail: string;      // Required: User's email
}
```

#### **Password Reset Context**
```typescript
{
  resetToken: string;     // Required: Password reset token
  userName?: string;      // Optional: User's name for personalization
}
```

### **✅ Error Handling**

The email service will throw errors if:
- Invalid template type is provided
- Required context fields are missing
- SMTP configuration is incorrect
- Email sending fails

```typescript
try {
  await this.emailService.sendEmailTemplate({
    to: 'user@example.com',
    templateType: EmailTemplateType.OTP,
    context: { otp: '123456' }
  });
} catch (error) {
  console.error('Failed to send email:', error.message);
  // Handle error appropriately
}
```

### **✅ Benefits of This Approach**

#### **🎯 Single Method**
- **One API**: Only `sendEmailTemplate` method to remember
- **Consistent**: Same method signature everywhere
- **Simple**: No confusion about which method to use

#### **🔄 Dynamic Content**
- **Context-based**: Pass any data needed for template generation
- **Flexible**: Easy to add new context fields
- **Reusable**: Same service works across all modules

#### **🏗️ Scalable Architecture**
- **Single Service**: One email service for entire application
- **Common Templates**: Shared template logic
- **Easy Maintenance**: Update templates in one place

### **✅ Best Practices**

#### **✅ Always Use sendEmailTemplate**
```typescript
// ✅ Good: The only way to send emails
await this.emailService.sendEmailTemplate({
  to: email,
  templateType: EmailTemplateType.OTP,
  context: { otp, userName }
});
```

#### **✅ Provide All Required Context**
```typescript
// ✅ Good: All required fields present
await this.emailService.sendEmailTemplate({
  to: email,
  templateType: EmailTemplateType.WELCOME,
  context: { userName, userEmail }
});
```

#### **✅ Handle Errors Gracefully**
```typescript
// ✅ Good: Proper error handling
try {
  await this.emailService.sendEmailTemplate(emailData);
} catch (error) {
  // Log and handle error
  this.logger.error('Email sending failed', error);
  throw new GraphQLError('Failed to send email', {
    extensions: { code: 'INTERNAL_SERVER_ERROR' }
  });
}
```

#### **✅ Import Both EmailService and EmailTemplateType**
```typescript
// ✅ Good: Import everything you need
import { EmailService, EmailTemplateType } from '../../common/email/email.service';
```

### **✅ Real-World Examples**

#### **✅ In Auth Service**
```typescript
// Send OTP for existing user
const otp = await this.otpService.generateOTP(email);
await this.emailService.sendEmailTemplate({
  to: email,
  templateType: EmailTemplateType.OTP,
  context: { otp }
});

// Send welcome email to new user
await this.emailService.sendEmailTemplate({
  to: newUser.email,
  templateType: EmailTemplateType.WELCOME,
  context: { userName: newUser.name, userEmail: newUser.email }
});
```

#### **✅ In Other Services**
```typescript
// Send password reset email
await this.emailService.sendEmailTemplate({
  to: user.email,
  templateType: EmailTemplateType.PASSWORD_RESET,
  context: { resetToken: token, userName: user.name }
});
```

**This single-method approach makes your email system consistent and easy to maintain!** 🚀
