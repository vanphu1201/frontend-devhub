-- Create product_reviews table
CREATE TABLE IF NOT EXISTS product_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(product_id, user_id)
);

-- Enable RLS for product_reviews
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;

-- product_reviews policies
CREATE POLICY "Reviews are viewable by everyone" ON product_reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can create reviews for products they own" ON product_reviews
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND 
    EXISTS (
      SELECT 1 FROM purchases 
      WHERE user_id = auth.uid() AND product_id = product_reviews.product_id
    )
  );

CREATE POLICY "Users can edit their own reviews" ON product_reviews
  FOR UPDATE USING (auth.uid() = user_id);

-- Update tickets/ticket_messages for RLS
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_messages ENABLE ROW LEVEL SECURITY;

-- tickets policies
CREATE POLICY "Users can view their own tickets" ON tickets
  FOR SELECT USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "Users can create their own tickets" ON tickets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ticket_messages policies
CREATE POLICY "Users can view messages of their own tickets" ON ticket_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM tickets 
      WHERE id = ticket_messages.ticket_id AND (user_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true))
    )
  );

CREATE POLICY "Users can send messages to their own tickets" ON ticket_messages
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM tickets 
      WHERE id = ticket_messages.ticket_id AND (user_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true))
    )
  );

-- Add missing columns if they don't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ticket_messages' AND column_name = 'is_staff_reply') THEN
    ALTER TABLE ticket_messages ADD COLUMN is_staff_reply BOOLEAN DEFAULT FALSE;
  END IF;
  
  -- Add stats columns to products if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'reviews_count') THEN
    ALTER TABLE products ADD COLUMN reviews_count INTEGER DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'rating_avg') THEN
    ALTER TABLE products ADD COLUMN rating_avg DECIMAL DEFAULT 0;
  END IF;
END $$;
