import { ValidationError } from '../types/investor';

export class InvestorValidationUtils {
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
    if (!phone) {
      return { field: 'phone_number', message: 'Phone number is required' };
    }
    
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

  static validateName(name: string, fieldName: string): ValidationError | null {
    if (!name || name.trim().length < 1) {
      return { 
        field: fieldName, 
        message: `${fieldName.replace('_', ' ')} is required` 
      };
    }
    
    if (name.trim().length > 50) {
      return { 
        field: fieldName, 
        message: `${fieldName.replace('_', ' ')} must be less than 50 characters` 
      };
    }
    
    // Check for potentially dangerous characters
    const dangerousChars = /[<>\"';&]/;
    if (dangerousChars.test(name)) {
      return { 
        field: fieldName, 
        message: `${fieldName.replace('_', ' ')} contains invalid characters` 
      };
    }
    
    return null;
  }

  static validateDescription(description: string): ValidationError | null {
    if (!description) return null; // Optional field
    
    if (description.length > 500) {
      return { 
        field: 'self_description', 
        message: 'Description must be less than 500 characters' 
      };
    }
    
    if (description.trim().length === 0) {
      return { 
        field: 'self_description', 
        message: 'Description cannot be empty if provided' 
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
    
    const firstNameError = this.validateName(data.first_name, 'first_name');
    if (firstNameError) errors.push(firstNameError);
    
    const lastNameError = this.validateName(data.last_name, 'last_name');
    if (lastNameError) errors.push(lastNameError);
    
    if (data.middle_name) {
      const middleNameError = this.validateName(data.middle_name, 'middle_name');
      if (middleNameError) errors.push(middleNameError);
    }
    
    const phoneError = this.validatePhoneNumber(data.phone_number);
    if (phoneError) errors.push(phoneError);
    
    const descriptionError = this.validateDescription(data.self_description);
    if (descriptionError) errors.push(descriptionError);
    
    return errors;
  }

  static validateStep2Data(data: any): ValidationError[] {
    const errors: ValidationError[] = [];
    
    if (!data.house_number || data.house_number.trim().length < 1) {
      errors.push({ 
        field: 'house_number', 
        message: 'House/Building number is required' 
      });
    }
    
    if (!data.street_name || data.street_name.trim().length < 1) {
      errors.push({ 
        field: 'street_name', 
        message: 'Street name is required' 
      });
    }
    
    if (!data.city || data.city.trim().length < 1) {
      errors.push({ 
        field: 'city', 
        message: 'City is required' 
      });
    }
    
    if (!data.postal_code || data.postal_code.trim().length < 1) {
      errors.push({ 
        field: 'postal_code', 
        message: 'Postal code is required' 
      });
    }
    
    if (!data.country || data.country.trim().length < 1) {
      errors.push({ 
        field: 'country', 
        message: 'Country is required' 
      });
    }
    
    return errors;
  }

  static validateStep3Data(data: any): ValidationError[] {
    const errors: ValidationError[] = [];
    
    const validExperience = ['beginner', 'intermediate', 'advanced', 'expert'];
    if (!data.investment_experience || !validExperience.includes(data.investment_experience)) {
      errors.push({ 
        field: 'investment_experience', 
        message: 'Please select a valid investment experience level' 
      });
    }
    
    const validRiskTolerance = ['conservative', 'moderate', 'aggressive'];
    if (!data.risk_tolerance || !validRiskTolerance.includes(data.risk_tolerance)) {
      errors.push({ 
        field: 'risk_tolerance', 
        message: 'Please select a valid risk tolerance level' 
      });
    }
    
    const validTimeline = ['1-2 years', '3-5 years', '5-10 years', '10+ years'];
    if (!data.investment_timeline || !validTimeline.includes(data.investment_timeline)) {
      errors.push({ 
        field: 'investment_timeline', 
        message: 'Please select a valid investment timeline' 
      });
    }
    
    if (data.investment_goals && (!Array.isArray(data.investment_goals) || data.investment_goals.length === 0)) {
      errors.push({ 
        field: 'investment_goals', 
        message: 'Please select at least one investment goal' 
      });
    }
    
    if (data.preferred_sectors && (!Array.isArray(data.preferred_sectors) || data.preferred_sectors.length === 0)) {
      errors.push({ 
        field: 'preferred_sectors', 
        message: 'Please select at least one preferred sector' 
      });
    }
    
    return errors;
  }
}