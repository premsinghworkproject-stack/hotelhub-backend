import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignupInput, LoginInput, VerifyOTPInput, ResendOTPInput, ForgotPasswordInput, VerifyForgotPasswordOTPInput, ResetPasswordInput } from './dto/auth.input';
import { AuthResponse, LoginResponse, OTPResponse, ForgotPasswordResponse, VerifyForgotPasswordOTPResponse } from './auth.types';

/**
 * Auth Resolver - Handles all authentication-related GraphQL operations
 * 
 * This resolver provides user authentication operations including signup, login,
 * OTP verification, and email services with proper GraphQL error handling.
 */
@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {
    console.log('AuthResolver initialized');
  }

  /**
   * Health check mutation for testing
   */
  @Mutation(() => String, {
    name: 'healthCheck',
    description: 'Health check for auth resolver'
  })
  async healthCheck(): Promise<string> {
    console.log('=== HEALTH CHECK CALLED ===');
    return 'Auth resolver is working!';
  }

  /**
   * Simple query for testing
   */
  @Query(() => String, {
    name: 'authTest',
    description: 'Test query for auth resolver'
  })
  async authTest(): Promise<string> {
    console.log('=== AUTH TEST QUERY CALLED ===');
    return 'Auth resolver query is working!';
  }

  /**
   * User signup mutation
   * 
   * @param signupInput - User signup data including name, email, and password
   * @returns Authentication response with token or error message
   * 
   * @example
   * ```graphql
   * mutation {
   *   signup(input: {
   *     name: "John Doe",
   *     email: "john.doe@example.com",
   *     password: "password123"
   *   }) {
   *     success
   *     token
   *     message
   *   }
   * }
   * ```
   */
  @Mutation(() => AuthResponse, {
    name: 'signup',
    description: 'Signup a new user with name, email, and password'
  })
  async signup(@Args('input') signupInput: SignupInput): Promise<AuthResponse> {
    console.log('=== SIGNUP MUTATION CALLED ===');
    console.log('Received input:', JSON.stringify(signupInput, null, 2));
    console.log('Input validation:', {
      name: typeof signupInput.name,
      email: typeof signupInput.email,
      password: typeof signupInput.password
    });
    
    try {
      const res = await this.authService.signup(signupInput);
      console.log('Signup response:', res);
      return res;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }

  /**
   * User login mutation
   * 
   * @param loginInput - User login data including email and password
   * @returns Login response with token or error message
   * 
   * @example
   * ```graphql
   * mutation {
   *   login(input: {
   *     email: "john.doe@example.com",
   *     password: "password123"
   *   }) {
   *     success
   *     token
   *     message
   *     requiresOTP
   *   }
   * }
   * ```
   */
  @Mutation(() => LoginResponse, {
    name: 'login',
    description: 'Login user with email and password'
  })
  async login(@Args('input') loginInput: LoginInput): Promise<LoginResponse> {
    return this.authService.login(loginInput);
  }

  /**
   * Resend OTP mutation
   * 
   * @param resendOTPInput - Email for OTP resend
   * @returns OTP response
   * 
   * @example
   * ```graphql
   * mutation {
   *   resendOTP(input: {
   *     email: "john.doe@example.com"
   *   }) {
   *     success
   *     message
   *   }
   * }
   * ```
   */
  @Mutation(() => OTPResponse, {
    name: 'resendOTP',
    description: 'Resend OTP to email'
  })
  async resendOTP(@Args('input') resendOTPInput: ResendOTPInput): Promise<OTPResponse> {
    return this.authService.resendOTP(resendOTPInput);
  }

  /**
   * Complete OTP verification and receive authentication token
   * 
   * @param verifyOTPInput - OTP verification data including email and OTP
   * @returns Login response with token or error message
   * 
   * @example
   * ```graphql
   * mutation {
   *   completeOTPVerification(input: {
   *     email: "john.doe@example.com",
   *     otp: "123456"
   *   }) {
   *     success
   *     token
   *     message
   *   }
   * }
   * ```
   */
  @Mutation(() => LoginResponse, {
    name: 'completeOTPVerification',
    description: 'Complete OTP verification and receive authentication token'
  })
  async completeOTPVerification(@Args('input') verifyOTPInput: VerifyOTPInput): Promise<LoginResponse> {
    return this.authService.completeOTPVerification(verifyOTPInput);
  }

  /**
   * Forgot password mutation
   * 
   * @param forgotPasswordInput - User email for password reset
   * @returns Forgot password response with appropriate error handling
   * 
   * @example
   * ```graphql
   * mutation {
   *   forgotPassword(input: {
   *     email: "john.doe@example.com"
   *   }) {
   *     success
   *     message
   *     requiresEmailVerification
   *     accountDeleted
   *   }
   * }
   * ```
   */
  @Mutation(() => ForgotPasswordResponse, {
    name: 'forgotPassword',
    description: 'Send password reset OTP to email with edge case handling'
  })
  async forgotPassword(@Args('input') forgotPasswordInput: ForgotPasswordInput): Promise<ForgotPasswordResponse> {
    return this.authService.forgotPassword(forgotPasswordInput);
  }

  /**
   * Verify forgot password OTP mutation
   * 
   * @param verifyForgotPasswordOTPInput - Email and OTP for verification
   * @returns Verification response with reset token
   * 
   * @example
   * ```graphql
   * mutation {
   *   verifyForgotPasswordOTP(input: {
   *     email: "john.doe@example.com",
   *     otp: "123456"
   *   }) {
   *     success
   *     message
   *     resetToken
   *   }
   * }
   * ```
   */
  @Mutation(() => VerifyForgotPasswordOTPResponse, {
    name: 'verifyForgotPasswordOTP',
    description: 'Verify password reset OTP and get reset token'
  })
  async verifyForgotPasswordOTP(@Args('input') verifyForgotPasswordOTPInput: VerifyForgotPasswordOTPInput): Promise<VerifyForgotPasswordOTPResponse> {
    return this.authService.verifyForgotPasswordOTP(verifyForgotPasswordOTPInput);
  }

  /**
   * Reset password mutation
   * 
   * @param resetPasswordInput - Email, new password, and reset token
   * @returns Authentication response
   * 
   * @example
   * ```graphql
   * mutation {
   *   resetPassword(input: {
   *     email: "john.doe@example.com",
   *     newPassword: "newpassword123",
   *     resetToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   *   }) {
   *     success
   *     token
   *     message
   *   }
   * }
   * ```
   */
  @Mutation(() => AuthResponse, {
    name: 'resetPassword',
    description: 'Reset password using reset token from OTP verification'
  })
  async resetPassword(@Args('input') resetPasswordInput: ResetPasswordInput): Promise<AuthResponse> {
    return this.authService.resetPassword(resetPasswordInput);
  }
}
