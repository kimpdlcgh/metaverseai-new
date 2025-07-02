/*
  # Create Investor Profile Tables

  1. New Tables
    - `investors` - Core investor personal information
    - `investor_addresses` - Residential address information  
    - `investment_profiles` - Investment knowledge and preferences
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage own data
  3. Features
    - Proper foreign key relationships
    - Updated timestamp triggers
    - Data validation constraints
*/

-- Create investors table
CREATE TABLE IF NOT EXISTS investors (
    investor_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name VARCHAR(50) NOT NULL,
    middle_name VARCHAR(50),
    last_name VARCHAR(50) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    self_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT valid_phone CHECK (phone_number ~* '^\+[1-9]\d{1,14}$'),
    CONSTRAINT valid_names CHECK (
        length(trim(first_name)) >= 1 AND 
        length(trim(last_name)) >= 1 AND
        (middle_name IS NULL OR length(trim(middle_name)) >= 1)
    ),
    CONSTRAINT valid_description CHECK (
        self_description IS NULL OR 
        (length(self_description) <= 500 AND length(trim(self_description)) > 0)
    )
);

-- Create investor_addresses table
CREATE TABLE IF NOT EXISTS investor_addresses (
    address_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    investor_id uuid REFERENCES investors(investor_id) ON DELETE CASCADE,
    house_number VARCHAR(20) NOT NULL,
    street_name VARCHAR(100) NOT NULL,
    village VARCHAR(100),
    town VARCHAR(100),
    city VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT valid_address_fields CHECK (
        length(trim(house_number)) >= 1 AND
        length(trim(street_name)) >= 1 AND
        length(trim(city)) >= 1 AND
        length(trim(postal_code)) >= 1 AND
        length(trim(country)) >= 1 AND
        (village IS NULL OR length(trim(village)) >= 1) AND
        (town IS NULL OR length(trim(town)) >= 1)
    )
);

-- Create investment_profiles table
CREATE TABLE IF NOT EXISTS investment_profiles (
    profile_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    investor_id uuid REFERENCES investors(investor_id) ON DELETE CASCADE,
    investment_experience VARCHAR(20) NOT NULL DEFAULT 'beginner',
    risk_tolerance VARCHAR(20) NOT NULL DEFAULT 'moderate',
    investment_timeline VARCHAR(20) NOT NULL DEFAULT '5-10 years',
    annual_income_range VARCHAR(30),
    net_worth_range VARCHAR(30),
    investment_goals TEXT[],
    preferred_sectors TEXT[],
    investment_amount_range VARCHAR(30),
    has_investment_advisor BOOLEAN DEFAULT false,
    previous_investments TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT valid_experience CHECK (
        investment_experience IN ('beginner', 'intermediate', 'advanced', 'expert')
    ),
    CONSTRAINT valid_risk_tolerance CHECK (
        risk_tolerance IN ('conservative', 'moderate', 'aggressive')
    ),
    CONSTRAINT valid_timeline CHECK (
        investment_timeline IN ('1-2 years', '3-5 years', '5-10 years', '10+ years')
    )
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_investors_user_id ON investors(user_id);
CREATE INDEX IF NOT EXISTS idx_investors_email ON investors(email);
CREATE INDEX IF NOT EXISTS idx_investor_addresses_investor_id ON investor_addresses(investor_id);
CREATE INDEX IF NOT EXISTS idx_investment_profiles_investor_id ON investment_profiles(investor_id);

-- Enable RLS
ALTER TABLE investors ENABLE ROW LEVEL SECURITY;
ALTER TABLE investor_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE investment_profiles ENABLE ROW LEVEL SECURITY;

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS investors_updated_at ON investors;
CREATE TRIGGER investors_updated_at
    BEFORE UPDATE ON investors
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS investor_addresses_updated_at ON investor_addresses;
CREATE TRIGGER investor_addresses_updated_at
    BEFORE UPDATE ON investor_addresses
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS investment_profiles_updated_at ON investment_profiles;
CREATE TRIGGER investment_profiles_updated_at
    BEFORE UPDATE ON investment_profiles
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

-- Create RLS policies for investors table
CREATE POLICY "Users can create own investor profile"
    ON investors
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own investor profile"
    ON investors
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own investor profile"
    ON investors
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own investor profile"
    ON investors
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Create RLS policies for investor_addresses table
CREATE POLICY "Users can manage own addresses"
    ON investor_addresses
    FOR ALL
    TO authenticated
    USING (
        investor_id IN (
            SELECT investor_id FROM investors WHERE user_id = auth.uid()
        )
    )
    WITH CHECK (
        investor_id IN (
            SELECT investor_id FROM investors WHERE user_id = auth.uid()
        )
    );

-- Create RLS policies for investment_profiles table
CREATE POLICY "Users can manage own investment profiles"
    ON investment_profiles
    FOR ALL
    TO authenticated
    USING (
        investor_id IN (
            SELECT investor_id FROM investors WHERE user_id = auth.uid()
        )
    )
    WITH CHECK (
        investor_id IN (
            SELECT investor_id FROM investors WHERE user_id = auth.uid()
        )
    );