import { ValidationError } from '../types/onboarding';

export class ValidationUtils {
  static validateEmail(email: string): ValidationError | null {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    
    if (!email) {
      return { field: 'email', message: 'Email is required' };
    }
    
    if (!emailRegex.test(email)) {
      return { field: 'email', message: 'Please enter a valid email address' };
    }
    
    return null;
  }

  static validatePhoneNumber(phone: string): ValidationError | null {
    if (!phone) return null; // Phone is optional
    
    // E.164 format validation
    const e164Regex = /^\+[1-9]\d{1,14}$/;
    
    if (!e164Regex.test(phone)) {
      return { 
        field: 'phone_number', 
        message: 'Phone number must be in E.164 format (e.g., +1234567890)' 
      };
    }
    
    return null;
  }

  static validateDateOfBirth(dateOfBirth: string): ValidationError | null {
    if (!dateOfBirth) {
      return { field: 'date_of_birth', message: 'Date of birth is required' };
    }
    
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      // Subtract 1 if birthday hasn't occurred this year
    }
    
    if (age < 18) {
      return { 
        field: 'date_of_birth', 
        message: 'You must be at least 18 years old to register' 
      };
    }
    
    if (birthDate > today) {
      return { 
        field: 'date_of_birth', 
        message: 'Date of birth cannot be in the future' 
      };
    }
    
    return null;
  }

  static validateFullName(fullName: string): ValidationError | null {
    if (!fullName || fullName.trim().length < 2) {
      return { 
        field: 'full_name', 
        message: 'Full name must be at least 2 characters long' 
      };
    }
    
    // Check for potentially dangerous characters
    const dangerousChars = /[<>\"';&]/;
    if (dangerousChars.test(fullName)) {
      return { 
        field: 'full_name', 
        message: 'Full name contains invalid characters' 
      };
    }
    
    return null;
  }

  static sanitizeInput(input: string): string {
    if (!input) return '';
    
    // Remove potentially dangerous characters and trim whitespace
    return input.replace(/[<>"';&]/g, '').trim();
  }

  static validateStep1Data(data: any): ValidationError[] {
    const errors: ValidationError[] = [];
    
    const emailError = this.validateEmail(data.email);
    if (emailError) errors.push(emailError);
    
    const nameError = this.validateFullName(data.full_name);
    if (nameError) errors.push(nameError);
    
    const phoneError = this.validatePhoneNumber(data.phone_number);
    if (phoneError) errors.push(phoneError);
    
    const dobError = this.validateDateOfBirth(data.date_of_birth);
    if (dobError) errors.push(dobError);
    
    return errors;
  }

  static validateStep2Data(data: any): ValidationError[] {
    const errors: ValidationError[] = [];
    
    if (!data.street_address || data.street_address.trim().length < 5) {
      errors.push({ 
        field: 'street_address', 
        message: 'Street address must be at least 5 characters long' 
      });
    }
    
    if (!data.city || data.city.trim().length < 2) {
      errors.push({ 
        field: 'city', 
        message: 'City must be at least 2 characters long' 
      });
    }
    
    if (!data.state || data.state.trim().length < 2) {
      errors.push({ 
        field: 'state', 
        message: 'State must be at least 2 characters long' 
      });
    }
    
    if (!data.postal_code || data.postal_code.trim().length < 3) {
      errors.push({ 
        field: 'postal_code', 
        message: 'Postal code must be at least 3 characters long' 
      });
    }
    
    if (!data.country || data.country.trim().length < 2) {
      errors.push({ 
        field: 'country', 
        message: 'Country is required' 
      });
    }
    
    return errors;
  }

  static validateStep3Data(data: any): ValidationError[] {
    const errors: ValidationError[] = [];
    
    // Step 3 is optional, but validate if provided
    if (data.bio && data.bio.length > 500) {
      errors.push({ 
        field: 'bio', 
        message: 'Bio must be less than 500 characters' 
      });
    }
    
    if (data.avatar_url && !this.isValidUrl(data.avatar_url)) {
      errors.push({ 
        field: 'avatar_url', 
        message: 'Please enter a valid URL for your avatar' 
      });
    }
    
    return errors;
  }

  private static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}