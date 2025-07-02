import { supabase } from '../lib/supabase';
import { Investor, InvestorAddress, InvestmentProfile, InvestorOnboardingData } from '../types/investor';
import { InvestorValidationUtils } from '../utils/investorValidation';

export class InvestorService {
  static async getInvestorProfile(userId: string): Promise<{
    investor?: Investor;
    address?: InvestorAddress;
    investmentProfile?: InvestmentProfile;
  }> {
    try {
      // Get investor data
      const { data: investor, error: investorError } = await supabase
        .from('investors')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (investorError) {
        throw investorError;
      }

      if (!investor) {
        return {};
      }

      // Get address data
      const { data: address, error: addressError } = await supabase
        .from('investor_addresses')
        .select('*')
        .eq('investor_id', investor.investor_id)
        .maybeSingle();

      if (addressError) {
        throw addressError;
      }

      // Get investment profile data
      const { data: investmentProfile, error: profileError } = await supabase
        .from('investment_profiles')
        .select('*')
        .eq('investor_id', investor.investor_id)
        .maybeSingle();

      if (profileError) {
        throw profileError;
      }

      return {
        investor,
        address: address || undefined,
        investmentProfile: investmentProfile || undefined
      };
    } catch (error) {
      console.error('Error fetching investor profile:', error);
      throw error;
    }
  }

  static async saveStep1Data(userId: string, data: InvestorOnboardingData['step1']): Promise<Investor> {
    if (!data) {
      throw new Error('Step 1 data is required');
    }

    // Validate data
    const errors = InvestorValidationUtils.validateStep1Data(data);
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.map(e => e.message).join(', ')}`);
    }

    // Sanitize inputs
    const sanitizedData = {
      user_id: userId,
      first_name: InvestorValidationUtils.sanitizeInput(data.first_name),
      middle_name: data.middle_name ? InvestorValidationUtils.sanitizeInput(data.middle_name) : null,
      last_name: InvestorValidationUtils.sanitizeInput(data.last_name),
      phone_number: InvestorValidationUtils.sanitizeInput(data.phone_number),
      email: InvestorValidationUtils.sanitizeInput(data.email),
      self_description: data.self_description ? InvestorValidationUtils.sanitizeInput(data.self_description) : null
    };

    try {
      // Check if investor already exists
      const { data: existingInvestor } = await supabase
        .from('investors')
        .select('investor_id')
        .eq('user_id', userId)
        .maybeSingle();

      if (existingInvestor) {
        // Update existing investor
        const { data: updatedInvestor, error } = await supabase
          .from('investors')
          .update(sanitizedData)
          .eq('user_id', userId)
          .select()
          .single();

        if (error) throw error;
        return updatedInvestor;
      } else {
        // Create new investor
        const { data: newInvestor, error } = await supabase
          .from('investors')
          .insert(sanitizedData)
          .select()
          .single();

        if (error) throw error;
        return newInvestor;
      }
    } catch (error) {
      console.error('Error saving step 1 data:', error);
      throw error;
    }
  }

  static async saveStep2Data(userId: string, data: InvestorOnboardingData['step2']): Promise<InvestorAddress> {
    if (!data) {
      throw new Error('Step 2 data is required');
    }

    // Validate data
    const errors = InvestorValidationUtils.validateStep2Data(data);
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.map(e => e.message).join(', ')}`);
    }

    try {
      // Get investor ID
      const { data: investor, error: investorError } = await supabase
        .from('investors')
        .select('investor_id')
        .eq('user_id', userId)
        .single();

      if (investorError || !investor) {
        throw new Error('Investor profile not found. Please complete step 1 first.');
      }

      // Sanitize inputs
      const sanitizedData = {
        investor_id: investor.investor_id,
        house_number: InvestorValidationUtils.sanitizeInput(data.house_number),
        street_name: InvestorValidationUtils.sanitizeInput(data.street_name),
        village: data.village ? InvestorValidationUtils.sanitizeInput(data.village) : null,
        town: data.town ? InvestorValidationUtils.sanitizeInput(data.town) : null,
        city: InvestorValidationUtils.sanitizeInput(data.city),
        postal_code: InvestorValidationUtils.sanitizeInput(data.postal_code),
        country: InvestorValidationUtils.sanitizeInput(data.country)
      };

      // Check if address already exists
      const { data: existingAddress } = await supabase
        .from('investor_addresses')
        .select('address_id')
        .eq('investor_id', investor.investor_id)
        .maybeSingle();

      if (existingAddress) {
        // Update existing address
        const { data: updatedAddress, error } = await supabase
          .from('investor_addresses')
          .update(sanitizedData)
          .eq('investor_id', investor.investor_id)
          .select()
          .single();

        if (error) throw error;
        return updatedAddress;
      } else {
        // Create new address
        const { data: newAddress, error } = await supabase
          .from('investor_addresses')
          .insert(sanitizedData)
          .select()
          .single();

        if (error) throw error;
        return newAddress;
      }
    } catch (error) {
      console.error('Error saving step 2 data:', error);
      throw error;
    }
  }

  static async saveStep3Data(userId: string, data: InvestorOnboardingData['step3']): Promise<InvestmentProfile> {
    if (!data) {
      throw new Error('Step 3 data is required');
    }

    // Validate data
    const errors = InvestorValidationUtils.validateStep3Data(data);
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.map(e => e.message).join(', ')}`);
    }

    try {
      // Get investor ID
      const { data: investor, error: investorError } = await supabase
        .from('investors')
        .select('investor_id')
        .eq('user_id', userId)
        .single();

      if (investorError || !investor) {
        throw new Error('Investor profile not found. Please complete step 1 first.');
      }

      const sanitizedData = {
        investor_id: investor.investor_id,
        investment_experience: data.investment_experience,
        risk_tolerance: data.risk_tolerance,
        investment_timeline: data.investment_timeline,
        annual_income_range: data.annual_income_range || null,
        net_worth_range: data.net_worth_range || null,
        investment_goals: data.investment_goals || [],
        preferred_sectors: data.preferred_sectors || [],
        investment_amount_range: data.investment_amount_range || null,
        has_investment_advisor: data.has_investment_advisor,
        previous_investments: data.previous_investments || []
      };

      // Check if investment profile already exists
      const { data: existingProfile } = await supabase
        .from('investment_profiles')
        .select('profile_id')
        .eq('investor_id', investor.investor_id)
        .maybeSingle();

      if (existingProfile) {
        // Update existing profile
        const { data: updatedProfile, error } = await supabase
          .from('investment_profiles')
          .update(sanitizedData)
          .eq('investor_id', investor.investor_id)
          .select()
          .single();

        if (error) throw error;
        return updatedProfile;
      } else {
        // Create new profile
        const { data: newProfile, error } = await supabase
          .from('investment_profiles')
          .insert(sanitizedData)
          .select()
          .single();

        if (error) throw error;
        return newProfile;
      }
    } catch (error) {
      console.error('Error saving step 3 data:', error);
      throw error;
    }
  }

  static async deleteInvestorProfile(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('investors')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting investor profile:', error);
      throw error;
    }
  }
}