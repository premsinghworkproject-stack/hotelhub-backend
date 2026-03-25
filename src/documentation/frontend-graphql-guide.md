# Frontend GraphQL API Guide

## 🚀 **How to Use the GraphQL API**

### **✅ Access the GraphQL Playground**

1. **Open your browser**
2. **Navigate to**: `http://localhost:8200/graphql` (or your server URL)
3. **You'll see the GraphQL Playground interface**

### **✅ Signup Mutation**

#### **📝 Mutation Query**
```graphql
mutation Signup($input: SignupInput!) {
  signup(input: $input) {
    success
    token
    message
  }
}
```

#### **📝 Query Variables**
```json
{
  "input": {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "password123"
  }
}
```

#### **📝 Full Request (in Playground)**
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

#### **📝 Expected Response**
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

### **✅ Login Mutation**

#### **📝 Mutation Query**
```graphql
mutation Login($input: LoginInput!) {
  login(input: $input) {
    success
    token
    message
    requiresOTP
  }
}
```

#### **📝 Query Variables**
```json
{
  "input": {
    "email": "john.doe@example.com",
    "password": "password123"
  }
}
```

#### **📝 Expected Response**
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

### **✅ OTP Verification**

#### **📝 Mutation Query**
```graphql
mutation VerifyOTP($input: VerifyOTPInput!) {
  verifyOTP(input: $input) {
    success
    token
    message
  }
}
```

#### **📝 Query Variables**
```json
{
  "input": {
    "email": "john.doe@example.com",
    "otp": "123456"
  }
}
```

#### **📝 Expected Response**
```json
{
  "data": {
    "verifyOTP": {
      "success": true,
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "message": "OTP verified successfully"
    }
  }
}
```

### **✅ Resend OTP**

#### **📝 Mutation Query**
```graphql
mutation ResendOTP($input: ResendOTPInput!) {
  resendOTP(input: $input) {
    success
    message
    otpId
  }
}
```

#### **📝 Query Variables**
```json
{
  "input": {
    "email": "john.doe@example.com"
  }
}
```

#### **📝 Expected Response**
```json
{
  "data": {
    "resendOTP": {
      "success": true,
      "message": "OTP sent to your email",
      "otpId": "abc123"
    }
  }
}
```

## 🎯 **How Frontend Can Use This**

### **✅ JavaScript/TypeScript Example**

#### **📝 Using Fetch API**
```javascript
const API_URL = 'http://localhost:8200/graphql';

async function signup(name, email, password) {
  const mutation = `
    mutation {
      signup(input: {
        name: "${name}",
        email: "${email}",
        password: "${password}"
      }) {
        success
        token
        message
      }
    }
  `;

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: mutation })
  });

  const result = await response.json();
  
  if (result.errors) {
    throw new Error(result.errors[0].message);
  }
  
  return result.data.signup;
}

// Usage
try {
  const result = await signup('John Doe', 'john@example.com', 'password123');
  if (result.success) {
    localStorage.setItem('token', result.token);
    console.log('Signup successful!');
  }
} catch (error) {
  console.error('Signup failed:', error.message);
}
```

#### **📝 Using Apollo Client**
```javascript
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:8200/graphql',
  cache: new InMemoryCache()
});

const SIGNUP_MUTATION = gql`
  mutation Signup($input: SignupInput!) {
    signup(input: $input) {
      success
      token
      message
    }
  }
`;

async function signup(name, email, password) {
  try {
    const { data } = await client.mutate({
      mutation: SIGNUP_MUTATION,
      variables: {
        input: { name, email, password }
      }
    });
    
    return data.signup;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
}
```

### **✅ React Example**

#### **📝 React Hook**
```javascript
import { useState } from 'react';
import { useMutation } from '@apollo/client';

const SIGNUP_MUTATION = gql`
  mutation Signup($input: SignupInput!) {
    signup(input: $input) {
      success
      token
      message
    }
  }
`;

function useSignup() {
  const [signup, { loading, error }] = useMutation(SIGNUP_MUTATION);
  
  const handleSignup = async (name, email, password) => {
    try {
      const { data } = await signup({
        variables: { input: { name, email, password } }
      });
      
      if (data.signup.success) {
        localStorage.setItem('token', data.signup.token);
        return data.signup;
      } else {
        throw new Error(data.signup.message);
      }
    } catch (err) {
      console.error('Signup failed:', err);
      throw err;
    }
  };
  
  return { handleSignup, loading, error };
}

// Usage in component
function SignupForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  
  const { handleSignup, loading, error } = useSignup();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleSignup(formData.name, formData.email, formData.password);
      alert('Signup successful!');
    } catch (err) {
      alert(err.message);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
      />
      <input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({...formData, password: e.target.value})}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Signing up...' : 'Sign Up'}
      </button>
      {error && <p>Error: {error.message}</p>}
    </form>
  );
}
```

## 🔧 **Authentication Flow**

### **✅ Complete Flow Example**

#### **📝 1. Signup**
```javascript
// First, signup
const signupResult = await signup('John Doe', 'john@example.com', 'password123');
```

#### **📝 2. Login (if needed)**
```javascript
// Login to get token
const loginResult = await login('john@example.com', 'password123');
```

#### **📝 3. Use Token**
```javascript
// Store token for future requests
localStorage.setItem('token', loginResult.token);

// Include token in subsequent requests
const response = await fetch(API_URL, {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  }
});
```

## 📚 **Available Mutations**

### **✅ Authentication**
- `signup(input: SignupInput!)` - Create new user
- `login(input: LoginInput!)` - User login
- `verifyOTP(input: VerifyOTPInput!)` - Verify OTP
- `resendOTP(input: ResendOTPInput!)` - Resend OTP

### **✅ Other Operations**
- `createHotel(input: CreateHotelInput!)` - Create hotel
- `createBooking(input: CreateBookingInput!)` - Create booking
- `getUserById(id: ID!)` - Get user by ID
- `getHotelById(id: ID!)` - Get hotel by ID

## 🎯 **Error Handling**

### **✅ Frontend Error Handling**
```javascript
try {
  const result = await signup('John', 'john@example.com', 'pass');
  if (result.success) {
    // Success handling
  }
} catch (error) {
  // Handle different error types
  if (error.message.includes('User already exists')) {
    // Handle existing user
  } else if (error.message.includes('Invalid email')) {
    // Handle invalid email
  } else {
    // Handle other errors
  }
}
```

**Frontend developers can now use the GraphQL API without knowing the backend code!** 🚀
