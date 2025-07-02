/*
  # Add Stock Transactions Tables

  1. New Tables
    - `stock_transactions` - Records user stock purchases and sales
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `company_id` (uuid, references companies)
      - `transaction_type` (text, 'buy' or 'sell')
      - `quantity` (numeric, number of shares)
      - `price_per_share` (numeric, price at transaction time)
      - `total_amount` (numeric, total transaction amount)
      - `fees` (numeric, transaction fees)
      - `transaction_date` (timestamptz, when transaction occurred)
      - `status` (text, transaction status)
      - `notes` (text, optional transaction notes)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `user_portfolios` - Summarizes users' current holdings
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `company_id` (uuid, references companies)
      - `shares_owned` (numeric, current number of shares)
      - `average_purchase_price` (numeric, average purchase price)
      - `total_investment` (numeric, total amount invested)
      - `last_updated` (timestamptz, when record was last updated)
  
  2. Security
    - Enable RLS on all tables
    - Add policies to control access
    - Ensure proper constraints and indexes
    
  3. Functions
    - Create functions to record stock transactions
    - Update portfolio automatically when transactions occur
*/

-- Create stock_transactions table
CREATE TABLE IF NOT EXISTS public.stock_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id uuid REFERENCES public.companies(id) ON DELETE RESTRICT,
  transaction_type text NOT NULL,
  quantity numeric NOT NULL,
  price_per_share numeric NOT NULL,
  total_amount numeric NOT NULL,
  fees numeric DEFAULT 0,
  transaction_date timestamptz DEFAULT now(),
  status text NOT NULL DEFAULT 'completed',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Constraints
  CONSTRAINT valid_transaction_type CHECK (transaction_type IN ('buy', 'sell')),
  CONSTRAINT valid_quantity CHECK (quantity > 0),
  CONSTRAINT valid_price_per_share CHECK (price_per_share > 0),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'completed', 'canceled', 'failed'))
);

-- Create user_portfolios table
CREATE TABLE IF NOT EXISTS public.user_portfolios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id uuid REFERENCES public.companies(id) ON DELETE RESTRICT,
  shares_owned numeric NOT NULL DEFAULT 0,
  average_purchase_price numeric,
  total_investment numeric,
  last_updated timestamptz DEFAULT now(),
  
  -- Constraints
  CONSTRAINT positive_shares CHECK (shares_owned >= 0),
  CONSTRAINT unique_user_company_portfolio UNIQUE (user_id, company_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_stock_transactions_user_id ON public.stock_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_stock_transactions_company_id ON public.stock_transactions(company_id);
CREATE INDEX IF NOT EXISTS idx_stock_transactions_date ON public.stock_transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_stock_transactions_type ON public.stock_transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_user_portfolios_user_id ON public.user_portfolios(user_id);
CREATE INDEX IF NOT EXISTS idx_user_portfolios_company_id ON public.user_portfolios(company_id);

-- Enable RLS
ALTER TABLE public.stock_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_portfolios ENABLE ROW LEVEL SECURITY;

-- Create triggers for updated_at
CREATE TRIGGER stock_transactions_updated_at
BEFORE UPDATE ON public.stock_transactions
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

-- Create RLS policies for stock_transactions
CREATE POLICY "Users can manage their own stock transactions"
ON public.stock_transactions
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for user_portfolios
CREATE POLICY "Users can view their own portfolio"
ON public.user_portfolios
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "System can update user portfolios"
ON public.user_portfolios
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Function to record stock transaction and update portfolio
CREATE OR REPLACE FUNCTION public.record_stock_transaction(
  p_user_id uuid,
  p_company_id uuid,
  p_transaction_type text,
  p_quantity numeric,
  p_price_per_share numeric,
  p_fees numeric DEFAULT 0,
  p_notes text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_transaction_id uuid;
  v_total_amount numeric;
  v_current_shares numeric;
  v_current_avg_price numeric;
  v_current_total_investment numeric;
  v_new_shares numeric;
  v_new_avg_price numeric;
  v_new_total_investment numeric;
BEGIN
  -- Validate parameters
  IF p_user_id IS NULL OR p_company_id IS NULL OR p_transaction_type IS NULL OR p_quantity IS NULL OR p_price_per_share IS NULL THEN
    RAISE EXCEPTION 'Required parameters cannot be null: user_id, company_id, transaction_type, quantity, price_per_share';
  END IF;
  
  IF p_transaction_type NOT IN ('buy', 'sell') THEN
    RAISE EXCEPTION 'Invalid transaction type: %. Must be "buy" or "sell"', p_transaction_type;
  END IF;
  
  IF p_quantity <= 0 THEN
    RAISE EXCEPTION 'Quantity must be greater than 0';
  END IF;
  
  IF p_price_per_share <= 0 THEN
    RAISE EXCEPTION 'Price per share must be greater than 0';
  END IF;
  
  -- Calculate total amount
  v_total_amount := p_quantity * p_price_per_share;
  
  -- Check if user has enough shares when selling
  IF p_transaction_type = 'sell' THEN
    SELECT shares_owned INTO v_current_shares
    FROM public.user_portfolios
    WHERE user_id = p_user_id AND company_id = p_company_id;
    
    IF v_current_shares IS NULL OR v_current_shares < p_quantity THEN
      RAISE EXCEPTION 'Not enough shares to sell. Available: %, Requested: %', COALESCE(v_current_shares, 0), p_quantity;
    END IF;
  END IF;
  
  -- Record transaction
  INSERT INTO public.stock_transactions (
    user_id,
    company_id,
    transaction_type,
    quantity,
    price_per_share,
    total_amount,
    fees,
    notes
  ) VALUES (
    p_user_id,
    p_company_id,
    p_transaction_type,
    p_quantity,
    p_price_per_share,
    v_total_amount,
    p_fees,
    p_notes
  )
  RETURNING id INTO v_transaction_id;
  
  -- Update portfolio
  -- First get current portfolio data
  SELECT 
    COALESCE(shares_owned, 0),
    COALESCE(average_purchase_price, 0),
    COALESCE(total_investment, 0)
  INTO 
    v_current_shares,
    v_current_avg_price,
    v_current_total_investment
  FROM public.user_portfolios
  WHERE user_id = p_user_id AND company_id = p_company_id;
  
  -- Calculate new portfolio values
  IF p_transaction_type = 'buy' THEN
    -- Calculate new shares owned
    v_new_shares := COALESCE(v_current_shares, 0) + p_quantity;
    
    -- Calculate new total investment
    v_new_total_investment := COALESCE(v_current_total_investment, 0) + v_total_amount;
    
    -- Calculate new average purchase price
    IF v_new_shares > 0 THEN
      v_new_avg_price := v_new_total_investment / v_new_shares;
    ELSE
      v_new_avg_price := 0;
    END IF;
  ELSE -- sell
    -- Calculate new shares owned
    v_new_shares := v_current_shares - p_quantity;
    
    -- When selling, we reduce the total investment proportionally
    IF v_current_shares > 0 THEN
      v_new_total_investment := v_current_total_investment * (v_new_shares / v_current_shares);
    ELSE
      v_new_total_investment := 0;
    END IF;
    
    -- Keep average purchase price the same unless all shares are sold
    IF v_new_shares > 0 THEN
      v_new_avg_price := v_current_avg_price;
    ELSE
      v_new_avg_price := NULL;
    END IF;
  END IF;
  
  -- Insert or update portfolio
  INSERT INTO public.user_portfolios (
    user_id,
    company_id,
    shares_owned,
    average_purchase_price,
    total_investment,
    last_updated
  ) VALUES (
    p_user_id,
    p_company_id,
    v_new_shares,
    v_new_avg_price,
    v_new_total_investment,
    now()
  )
  ON CONFLICT (user_id, company_id) DO UPDATE SET
    shares_owned = EXCLUDED.shares_owned,
    average_purchase_price = EXCLUDED.average_purchase_price,
    total_investment = EXCLUDED.total_investment,
    last_updated = EXCLUDED.last_updated;
  
  -- Create notification
  PERFORM create_user_notification(
    p_user_id,
    CASE p_transaction_type
      WHEN 'buy' THEN 'Stock Purchase Confirmed'
      WHEN 'sell' THEN 'Stock Sale Confirmed'
    END,
    CASE p_transaction_type
      WHEN 'buy' THEN 'You have successfully purchased ' || p_quantity || ' shares at $' || p_price_per_share || ' per share.'
      WHEN 'sell' THEN 'You have successfully sold ' || p_quantity || ' shares at $' || p_price_per_share || ' per share.'
    END,
    'success',
    NULL,
    now() + interval '30 days'
  );
  
  RETURN v_transaction_id;
EXCEPTION
  WHEN others THEN
    -- Create error notification
    PERFORM create_user_notification(
      p_user_id,
      'Transaction Error',
      'Error processing your ' || p_transaction_type || ' transaction: ' || SQLERRM,
      'error',
      NULL,
      now() + interval '30 days'
    );
    
    RAISE EXCEPTION 'Error recording stock transaction: %', SQLERRM;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.record_stock_transaction TO authenticated;