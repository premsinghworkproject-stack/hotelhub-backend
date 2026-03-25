import * as bcrypt from 'bcrypt';

export class PasswordUtil {
  private static readonly SALT_ROUNDS = 12;

  /**
   * Hash a password using bcrypt
   * 
   * @param password - Plain text password
   * @returns Hashed password
   */
  static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.SALT_ROUNDS);
    return bcrypt.hash(password, salt);
  }

  /**
   * Compare a plain text password with a hashed password
   * 
   * @param password - Plain text password
   * @param hashedPassword - Hashed password to compare against
   * @returns True if passwords match, false otherwise
   */
  static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  /**
   * Validate password strength
   * 
   * @param password - Password to validate
   * @returns Validation result with message
   */
  static validatePasswordStrength(password: string): { isValid: boolean; message: string } {
    if (!password || password.length < 6) {
      return { isValid: false, message: 'Password must be at least 6 characters long' };
    }

    if (password.length > 128) {
      return { isValid: false, message: 'Password must be less than 128 characters' };
    }

    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one uppercase letter' };
    }

    // Check for at least one lowercase letter
    if (!/[a-z]/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one lowercase letter' };
    }

    // Check for at least one number
    if (!/\d/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one number' };
    }

    // Check for at least one special character
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one special character' };
    }

    return { isValid: true, message: 'Password meets strength requirements' };
  }
}
