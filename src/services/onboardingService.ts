import { supabase } from '../lib/supabase';
import { UserProfile, OnboardingProgress } from '../types/onboarding';
import { ValidationUtils } from '../utils/validation';

export class OnboardingService {
  static async checkRateLimit(userId: string, actionType: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('check_rate_limit', {
        p_user_id: userId,
        p_action_type: actionType,
        p_max_attempts: 5,
        p_window_minutes: 60
      });

      if (error) {
        console.error('Rate limit check error:', error);
        return false;
      }

      return data;
    } catch (error) {
      console.error('Rate limit check failed:', error);
      return false;
    }
  }

  static async getOnboardingProgress(userId: string): Promise<OnboardingProgress | null> {
    try {
      const { data, error } = await supabase
        .from('onboarding_progress')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching onboarding progress:', error);
      return null;
    }
  }

  static async updateOnboardingProgress(
    userId: string, 
    step: number, 
    stepData: any
  ): Promise<OnboardingProgress> {
    // Check rate limit
    const canProceed = await this.checkRateLimit(userId, 'onboarding_update');
    if (!canProceed) {
      throw new Error('Too many attempts. Please try again later.');
    }

    try {
      const currentProgress = await this.getOnboardingProgress(userId);
      
      const updatedStepData = {
        ...currentProgress?.step_data,
        [`step${step}`]: stepData
      };

      const completedSteps = currentProgress?.completed_steps || [];
      if (!completedSteps.includes(step)) {
        completedSteps.push(step);
      }

      const { data, error } = await supabase
        .from('onboarding_progress')
        .upsert({
          user_id: userId,
          current_step: step + 1,
          completed_steps: completedSteps,
          step_data: updatedStepData,
          last_activity: new Date().toISOString(),
          completed_at: step === 3 ? new Date().toISOString() : null
        }, {
          onConflict: 'user_id'
        })
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error updating onboarding progress:', error);
      throw error;
    }
  }

  static async saveStep1Data(userId: string, data: any): Promise<void> {
    // Validate data
    const errors = ValidationUtils.validateStep1Data(data);
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.map(e => e.message).join(', ')}`);
    }

    // Sanitize inputs
    const sanitizedData = {
      email: ValidationUtils.sanitizeInput(data.email),
      full_name: ValidationUtils.sanitizeInput(data.full_name),
      phone_number: data.phone_number ? ValidationUtils.sanitizeInput(data.phone_number) : null,
      date_of_birth: data.date_of_birth
    };

    try {
      // Check if profile exists
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      if (existingProfile) {
        // Update existing profile
        const { error } = await supabase
          .from('user_profiles')
          .update(sanitizedData)
          .eq('user_id', userId);

        if (error) throw error;
      } else {
        // Create new profile
        const { error } = await supabase
          .from('user_profiles')
          .insert({
            user_id: userId,
            ...sanitizedData
          });

        if (error) throw error;
      }

      // Update onboarding progress
      await this.updateOnboardingProgress(userId, 1, sanitizedData);
    } catch (error) {
      console.error('Error saving step 1 data:', error);
      throw error;
    }
  }

  static async saveStep2Data(userId: string, data: any): Promise<void> {
    // Validate data
    const errors = ValidationUtils.validateStep2Data(data);
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.map(e => e.message).join(', ')}`);
    }

    // Sanitize inputs
    const sanitizedData = {
      location: {
        street_address: ValidationUtils.sanitizeInput(data.street_address),
        city: ValidationUtils.sanitizeInput(data.city),
        state: ValidationUtils.sanitizeInput(data.state),
        postal_code: ValidationUtils.sanitizeInput(data.postal_code),
        country: ValidationUtils.sanitizeInput(data.country)
      }
    };

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update(sanitizedData)
        .eq('user_id', userId);

      if (error) throw error;

      // Update onboarding progress
      await this.updateOnboardingProgress(userId, 2, data);
    } catch (error) {
      console.error('Error saving step 2 data:', error);
      throw error;
    }
  }

  static async saveStep3Data(userId: string, data: any): Promise<void> {
    // Validate data
    const errors = ValidationUtils.validateStep3Data(data);
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.map(e => e.message).join(', ')}`);
    }

    // Sanitize inputs
    const sanitizedData = {
      bio: data.bio ? ValidationUtils.sanitizeInput(data.bio) : null,
      avatar_url: data.avatar_url ? ValidationUtils.sanitizeInput(data.avatar_url) : null
    };

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          ...sanitizedData,
          onboarding_completed: true
        })
        .eq('user_id', userId);

      if (error) throw error;

      // Update onboarding progress
      await this.updateOnboardingProgress(userId, 3, data);
    } catch (error) {
      console.error('Error saving step 3 data:', error);
      throw error;
    }
  }

  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  static async uploadAvatar(userId: string, file: File): Promise<string> {
    try {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size must be less than 5MB');
      }

      // Check file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Only JPEG, PNG, and WebP images are allowed');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(data.path);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw error;
    }
  }

  static async deleteUserProfile(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting user profile:', error);
      throw error;
    }
  }
}