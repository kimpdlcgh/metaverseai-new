export interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  phone_number?: string;
  date_of_birth?: string;
  avatar_url?: string;
  bio?: string;
  location?: {
    street_address?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  email_verified: boolean;
  phone_verified: boolean;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface OnboardingProgress {
  id: string;
  user_id: string;
  current_step: number;
  completed_steps: number[];
  step_data: {
    step1?: {
      full_name?: string;
      phone_number?: string;
      date_of_birth?: string;
    };
    step2?: {
      street_address?: string;
      city?: string;
      state?: string;
      postal_code?: string;
      country?: string;
    };
    step3?: {
      bio?: string;
      avatar_url?: string;
      interests?: string[];
    };
  };
  started_at: string;
  completed_at?: string;
  last_activity: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface OnboardingStep {
  step: number;
  title: string;
  description: string;
  fields: string[];
  isOptional?: boolean;
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    step: 1,
    title: "Basic Information",
    description: "Tell us about yourself",
    fields: ["full_name", "phone_number", "date_of_birth"]
  },
  {
    step: 2,
    title: "Contact Details",
    description: "Where can we reach you?",
    fields: ["street_address", "city", "state", "postal_code", "country"]
  },
  {
    step: 3,
    title: "Optional Information",
    description: "Help us personalize your experience",
    fields: ["bio", "avatar_url"],
    isOptional: true
  }
];