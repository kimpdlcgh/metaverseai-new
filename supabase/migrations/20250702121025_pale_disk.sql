/*
  # Add Dividend Tracking System

  1. New Tables
    - `company_dividends` - Records company dividend announcements
      - `id` (uuid, primary key)
      - `company_id` (uuid, references companies)
      - `ex_dividend_date` (date, when stock trades ex-dividend)
      - `record_date` (date, when company determines shareholders eligible for dividends)
      - `payment_date` (date, when dividends are paid)
      - `amount_per_share` (numeric, dividend amount per share)
      - `dividend_type` (text, e.g., regular, special)
      - `announcement_date` (date, when dividend was announced)
      - `currency` (text, currency of dividend payment)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `user_dividend_payments` - Records dividend payments to users
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `company_id` (uuid, references companies)
      - `dividend_id` (uuid, references company_dividends)
      - `shares_owned` (numeric, shares owned at record date)
      - `amount_per_share` (numeric, dividend amount per share)
      - `total_amount` (numeric, total dividend payment)
      - `payment_date` (date, when dividend was paid)
      - `status` (text, payment status)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  2. Security
    - Enable RLS on all tables
    - Add policies to control access
*/

-- Create company_dividends table
CREATE TABLE IF NOT EXISTS public.company_dividends (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE,
  ex_dividend_date date NOT NULL,
  record_date date NOT NULL,
  payment_date date NOT NULL,
  amount_per_share numeric NOT NULL,
  dividend_type text NOT NULL DEFAULT 'regular',
  announcement_date date NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Constraints
  CONSTRAINT valid_dividend_type CHECK (dividend_type IN ('regular', 'special', 'supplemental')),
  CONSTRAINT positive_amount CHECK (amount_per_share > 0),
  CONSTRAINT valid_date_sequence CHECK (
    announcement_date <= ex_dividend_date AND
    ex_dividend_date <= record_date AND
    record_date <= payment_date
  )
);

-- Create user_dividend_payments table
CREATE TABLE IF NOT EXISTS public.user_dividend_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE,
  dividend_id uuid REFERENCES public.company_dividends(id) ON DELETE CASCADE,
  shares_owned numeric NOT NULL,
  amount_per_share numeric NOT NULL,
  total_amount numeric NOT NULL,
  payment_date date NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Constraints
  CONSTRAINT positive_shares CHECK (shares_owned > 0),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'paid', 'canceled', 'failed')),
  CONSTRAINT unique_user_dividend UNIQUE (user_id, dividend_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_company_dividends_company_id ON public.company_dividends(company_id);
CREATE INDEX IF NOT EXISTS idx_company_dividends_payment_date ON public.company_dividends(payment_date);
CREATE INDEX IF NOT EXISTS idx_company_dividends_ex_date ON public.company_dividends(ex_dividend_date);
CREATE INDEX IF NOT EXISTS idx_user_dividend_payments_user_id ON public.user_dividend_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_user_dividend_payments_dividend_id ON public.user_dividend_payments(dividend_id);
CREATE INDEX IF NOT EXISTS idx_user_dividend_payments_status ON public.user_dividend_payments(status);

-- Enable RLS
ALTER TABLE public.company_dividends ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_dividend_payments ENABLE ROW LEVEL SECURITY;

-- Create triggers for updated_at
CREATE TRIGGER company_dividends_updated_at
BEFORE UPDATE ON public.company_dividends
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER user_dividend_payments_updated_at
BEFORE UPDATE ON public.user_dividend_payments
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

-- Create RLS policies for company_dividends
CREATE POLICY "Public can view company dividends"
ON public.company_dividends
FOR SELECT
TO public
USING (true);

-- Create RLS policies for user_dividend_payments
CREATE POLICY "Users can view their own dividend payments"
ON public.user_dividend_payments
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Function to process dividend payments for a company
CREATE OR REPLACE FUNCTION public.process_company_dividend_payments(
  p_dividend_id uuid
)
RETURNS int
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_company_id uuid;
  v_record_date date;
  v_payment_date date;
  v_amount_per_share numeric;
  v_processed_count int := 0;
  v_user_record record;
BEGIN
  -- Get dividend information
  SELECT 
    company_id, 
    record_date, 
    payment_date, 
    amount_per_share 
  INTO 
    v_company_id, 
    v_record_date, 
    v_payment_date, 
    v_amount_per_share
  FROM public.company_dividends
  WHERE id = p_dividend_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Dividend record not found';
  END IF;
  
  -- Process dividend payments for eligible users
  FOR v_user_record IN
    SELECT 
      user_id, 
      shares_owned
    FROM public.user_portfolios
    WHERE 
      company_id = v_company_id AND 
      shares_owned > 0
  LOOP
    -- Insert dividend payment record
    INSERT INTO public.user_dividend_payments (
      user_id,
      company_id,
      dividend_id,
      shares_owned,
      amount_per_share,
      total_amount,
      payment_date,
      status
    ) VALUES (
      v_user_record.user_id,
      v_company_id,
      p_dividend_id,
      v_user_record.shares_owned,
      v_amount_per_share,
      v_user_record.shares_owned * v_amount_per_share,
      v_payment_date,
      'pending'
    )
    ON CONFLICT (user_id, dividend_id) DO NOTHING;
    
    -- Count processed records
    v_processed_count := v_processed_count + 1;
    
    -- Create notification for user
    PERFORM create_user_notification(
      v_user_record.user_id,
      'Dividend Payment Scheduled',
      'You will receive a dividend payment of $' || 
        (v_user_record.shares_owned * v_amount_per_share) || 
        ' (' || v_user_record.shares_owned || ' shares at $' || 
        v_amount_per_share || ' per share) on ' || 
        v_payment_date,
      'info',
      NULL,
      v_payment_date + interval '30 days'
    );
  END LOOP;
  
  RETURN v_processed_count;
EXCEPTION
  WHEN others THEN
    RAISE EXCEPTION 'Error processing dividend payments: %', SQLERRM;
END;
$$;

-- Function to mark dividend payments as paid
CREATE OR REPLACE FUNCTION public.mark_dividend_payments_as_paid(
  p_dividend_id uuid
)
RETURNS int
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_processed_count int := 0;
  v_user_id uuid;
  v_company_name text;
  v_total_amount numeric;
BEGIN
  -- Update payment status
  UPDATE public.user_dividend_payments
  SET status = 'paid', updated_at = now()
  WHERE dividend_id = p_dividend_id AND status = 'pending'
  RETURNING user_id, total_amount INTO v_user_id, v_total_amount;
  
  GET DIAGNOSTICS v_processed_count = ROW_COUNT;
  
  -- Get company name for notification
  SELECT c.name INTO v_company_name
  FROM public.company_dividends d
  JOIN public.companies c ON d.company_id = c.id
  WHERE d.id = p_dividend_id;
  
  -- Create notification for each user
  IF v_user_id IS NOT NULL AND v_company_name IS NOT NULL AND v_total_amount IS NOT NULL THEN
    PERFORM create_user_notification(
      v_user_id,
      'Dividend Payment Received',
      'You have received a dividend payment of $' || v_total_amount || 
      ' from ' || v_company_name,
      'success',
      NULL,
      now() + interval '30 days'
    );
  END IF;
  
  RETURN v_processed_count;
EXCEPTION
  WHEN others THEN
    RAISE EXCEPTION 'Error marking dividend payments as paid: %', SQLERRM;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.process_company_dividend_payments TO authenticated;
GRANT EXECUTE ON FUNCTION public.mark_dividend_payments_as_paid TO authenticated;