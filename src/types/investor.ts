export interface Investor {
  investor_id: string;
  user_id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  phone_number: string;
  email: string;
  self_description?: string;
  created_at: string;
  updated_at: string;
}

export interface InvestorAddress {
  address_id: string;
  investor_id: string;
  house_number: string;
  street_name: string;
  village?: string;
  town?: string;
  city: string;
  postal_code: string;
  country: string;
  created_at: string;
  updated_at: string;
}

export interface InvestmentProfile {
  profile_id: string;
  investor_id: string;
  investment_experience: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  risk_tolerance: 'conservative' | 'moderate' | 'aggressive';
  investment_timeline: '1-2 years' | '3-5 years' | '5-10 years' | '10+ years';
  annual_income_range?: string;
  net_worth_range?: string;
  investment_goals?: string[];
  preferred_sectors?: string[];
  investment_amount_range?: string;
  has_investment_advisor: boolean;
  previous_investments?: string[];
  created_at: string;
  updated_at: string;
}

export interface InvestorOnboardingData {
  step1?: {
    first_name: string;
    middle_name?: string;
    last_name: string;
    phone_number: string;
    email: string;
    self_description?: string;
  };
  step2?: {
    house_number: string;
    street_name: string;
    village?: string;
    town?: string;
    city: string;
    postal_code: string;
    country: string;
  };
  step3?: {
    investment_experience: string;
    risk_tolerance: string;
    investment_timeline: string;
    annual_income_range?: string;
    net_worth_range?: string;
    investment_goals?: string[];
    preferred_sectors?: string[];
    investment_amount_range?: string;
    has_investment_advisor: boolean;
    previous_investments?: string[];
  };
}

export interface ValidationError {
  field: string;
  message: string;
}

export const COUNTRIES = [
  'United States',
  'Canada',
  'United Kingdom',
  'Australia',
  'Germany',
  'France',
  'Japan',
  'Singapore',
  'Hong Kong',
  'Switzerland',
  'Netherlands',
  'Sweden',
  'Norway',
  'Denmark',
  'Other'
];

export const INCOME_RANGES = [
  'Under $25,000',
  '$25,000 - $50,000',
  '$50,000 - $75,000',
  '$75,000 - $100,000',
  '$100,000 - $150,000',
  '$150,000 - $250,000',
  '$250,000 - $500,000',
  '$500,000 - $1,000,000',
  'Over $1,000,000'
];

export const NET_WORTH_RANGES = [
  'Under $50,000',
  '$50,000 - $100,000',
  '$100,000 - $250,000',
  '$250,000 - $500,000',
  '$500,000 - $1,000,000',
  '$1,000,000 - $5,000,000',
  '$5,000,000 - $10,000,000',
  'Over $10,000,000'
];

export const INVESTMENT_GOALS = [
  'Retirement Planning',
  'Wealth Building',
  'Income Generation',
  'Capital Preservation',
  'Education Funding',
  'Emergency Fund',
  'Major Purchase',
  'Tax Optimization',
  'Estate Planning',
  'Passive Income'
];

export const INVESTMENT_SECTORS = [
  'Technology',
  'Healthcare',
  'Financial Services',
  'Real Estate',
  'Energy',
  'Consumer Goods',
  'Industrial',
  'Telecommunications',
  'Utilities',
  'Materials',
  'Cryptocurrency',
  'Commodities',
  'International Markets',
  'ESG/Sustainable Investing'
];

export const INVESTMENT_AMOUNT_RANGES = [
  'Under $1,000',
  '$1,000 - $5,000',
  '$5,000 - $10,000',
  '$10,000 - $25,000',
  '$25,000 - $50,000',
  '$50,000 - $100,000',
  '$100,000 - $250,000',
  '$250,000 - $500,000',
  'Over $500,000'
];

export const PREVIOUS_INVESTMENTS = [
  'Stocks',
  'Bonds',
  'Mutual Funds',
  'ETFs',
  'Real Estate',
  'Commodities',
  'Cryptocurrency',
  'Options',
  'Futures',
  'Private Equity',
  'Hedge Funds',
  'REITs',
  'CDs',
  'Savings Accounts',
  'None'
];