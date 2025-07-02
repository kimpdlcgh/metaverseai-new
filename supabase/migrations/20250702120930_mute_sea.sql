/*
  # Add Companies Table for Investment Platform

  1. New Tables
    - `companies` - Stores information about companies available for investment
      - `id` (uuid, primary key)
      - `name` (text, company name)
      - `ticker` (text, stock ticker symbol)
      - `description` (text, company description)
      - `sector` (text, business sector)
      - `logo_url` (text, company logo URL)
      - `website` (text, company website)
      - `founding_date` (date, when company was founded)
      - `market_cap` (numeric, current market capitalization)
      - `current_price` (numeric, current stock price)
      - `price_change_24h` (numeric, 24-hour price change percentage)
      - `volume_24h` (numeric, 24-hour trading volume)
      - `is_featured` (boolean, whether company is featured on platform)
      - `is_active` (boolean, whether company is active for investment)
      - `created_at` (timestamptz, when record was created)
      - `updated_at` (timestamptz, when record was last updated)
    
    - `user_watchlists` - Tracks companies users are watching
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `company_id` (uuid, references companies)
      - `added_at` (timestamptz, when company was added to watchlist)
      - `notes` (text, user's private notes about the company)
  
  2. Security
    - Enable RLS on all tables
    - Add policies to control access
    - Ensure proper constraints and indexes
*/

-- Create companies table
CREATE TABLE IF NOT EXISTS public.companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  ticker text UNIQUE NOT NULL,
  description text,
  sector text,
  logo_url text,
  website text,
  founding_date date,
  market_cap numeric,
  current_price numeric,
  price_change_24h numeric,
  volume_24h numeric,
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Constraints
  CONSTRAINT valid_ticker CHECK (ticker ~ '^[A-Z0-9\.\-]{1,10}$')
);

-- Create user watchlists table
CREATE TABLE IF NOT EXISTS public.user_watchlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE,
  added_at timestamptz DEFAULT now(),
  notes text,
  
  -- Constraints
  CONSTRAINT unique_user_company UNIQUE (user_id, company_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_companies_sector ON public.companies(sector);
CREATE INDEX IF NOT EXISTS idx_companies_is_featured ON public.companies(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_companies_is_active ON public.companies(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_user_watchlists_user_id ON public.user_watchlists(user_id);
CREATE INDEX IF NOT EXISTS idx_user_watchlists_company_id ON public.user_watchlists(company_id);

-- Enable RLS
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_watchlists ENABLE ROW LEVEL SECURITY;

-- Create triggers for updated_at
CREATE TRIGGER companies_updated_at
BEFORE UPDATE ON public.companies
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

-- Create RLS policies for companies
CREATE POLICY "Public can view active companies"
ON public.companies
FOR SELECT
TO public
USING (is_active = true);

-- Create RLS policies for user watchlists
CREATE POLICY "Users can manage their own watchlist"
ON public.user_watchlists
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create function to add company to watchlist
CREATE OR REPLACE FUNCTION public.add_to_watchlist(
  p_user_id uuid,
  p_company_id uuid,
  p_notes text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_watchlist_id uuid;
BEGIN
  -- Validate parameters
  IF p_user_id IS NULL OR p_company_id IS NULL THEN
    RAISE EXCEPTION 'User ID and Company ID cannot be null';
  END IF;
  
  -- Check if company exists and is active
  IF NOT EXISTS (SELECT 1 FROM public.companies WHERE id = p_company_id AND is_active = true) THEN
    RAISE EXCEPTION 'Company does not exist or is not active';
  END IF;
  
  -- Insert into watchlist
  INSERT INTO public.user_watchlists (
    user_id,
    company_id,
    notes
  ) VALUES (
    p_user_id,
    p_company_id,
    p_notes
  )
  ON CONFLICT (user_id, company_id) 
  DO UPDATE SET notes = EXCLUDED.notes
  RETURNING id INTO v_watchlist_id;
  
  RETURN v_watchlist_id;
EXCEPTION
  WHEN others THEN
    RAISE EXCEPTION 'Error adding company to watchlist: %', SQLERRM;
END;
$$;

-- Create function to remove company from watchlist
CREATE OR REPLACE FUNCTION public.remove_from_watchlist(
  p_user_id uuid,
  p_company_id uuid
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_affected_rows int;
BEGIN
  -- Validate parameters
  IF p_user_id IS NULL OR p_company_id IS NULL THEN
    RAISE EXCEPTION 'User ID and Company ID cannot be null';
  END IF;
  
  -- Delete from watchlist
  DELETE FROM public.user_watchlists
  WHERE user_id = p_user_id AND company_id = p_company_id
  RETURNING 1 INTO v_affected_rows;
  
  RETURN v_affected_rows IS NOT NULL;
EXCEPTION
  WHEN others THEN
    RAISE EXCEPTION 'Error removing company from watchlist: %', SQLERRM;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.add_to_watchlist TO authenticated;
GRANT EXECUTE ON FUNCTION public.remove_from_watchlist TO authenticated;