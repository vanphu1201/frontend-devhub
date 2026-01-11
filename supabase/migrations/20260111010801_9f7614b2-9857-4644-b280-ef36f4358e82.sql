-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create tribe_members table FIRST (without FK to tribes initially)
CREATE TABLE public.tribe_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tribe_id UUID NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'moderator', 'member')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create tribes table
CREATE TABLE public.tribes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  avatar TEXT,
  cover_image TEXT,
  is_private BOOLEAN DEFAULT false,
  members_count INTEGER DEFAULT 0,
  posts_count INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add foreign key to tribe_members
ALTER TABLE public.tribe_members
ADD CONSTRAINT tribe_members_tribe_id_fkey
FOREIGN KEY (tribe_id) REFERENCES public.tribes(id) ON DELETE CASCADE;

-- Add unique constraint
ALTER TABLE public.tribe_members
ADD CONSTRAINT tribe_members_tribe_user_unique UNIQUE(tribe_id, user_id);

-- Enable RLS on tribe_members
ALTER TABLE public.tribe_members ENABLE ROW LEVEL SECURITY;

-- Enable RLS on tribes
ALTER TABLE public.tribes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tribe_members
CREATE POLICY "Tribe members are viewable by everyone"
ON public.tribe_members FOR SELECT
USING (true);

CREATE POLICY "Users can join tribes"
ON public.tribe_members FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave tribes"
ON public.tribe_members FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for tribes
CREATE POLICY "Tribes are viewable by everyone"
ON public.tribes FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can create tribes"
ON public.tribes FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Tribe admins can update tribes"
ON public.tribes FOR UPDATE
USING (created_by = auth.uid());

-- Create products table for marketplace
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT,
  price INTEGER DEFAULT 0,
  original_price INTEGER,
  demo_url TEXT,
  preview_images TEXT[] DEFAULT '{}',
  tech_stack TEXT[] DEFAULT '{}',
  category TEXT,
  version TEXT DEFAULT '1.0.0',
  documentation_url TEXT,
  support_duration TEXT DEFAULT '3 months',
  downloads_count INTEGER DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- RLS Policies for products
CREATE POLICY "Published products are viewable by everyone"
ON public.products FOR SELECT
USING (is_published = true OR auth.uid() = user_id);

CREATE POLICY "Users can create their own products"
ON public.products FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own products"
ON public.products FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own products"
ON public.products FOR DELETE
USING (auth.uid() = user_id);

-- Create purchases table
CREATE TABLE public.purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  price_paid INTEGER NOT NULL,
  download_count INTEGER DEFAULT 0,
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Enable RLS
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

-- RLS Policies for purchases
CREATE POLICY "Users can view their own purchases"
ON public.purchases FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create purchases"
ON public.purchases FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create badges table for gamification
CREATE TABLE public.badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  type TEXT CHECK (type IN ('gold', 'silver', 'bronze')),
  points_required INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;

-- RLS Policies for badges
CREATE POLICY "Badges are viewable by everyone"
ON public.badges FOR SELECT
USING (true);

-- Create user_badges junction table
CREATE TABLE public.user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  badge_id UUID REFERENCES public.badges(id) ON DELETE CASCADE NOT NULL,
  awarded_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

-- Enable RLS
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_badges
CREATE POLICY "User badges are viewable by everyone"
ON public.user_badges FOR SELECT
USING (true);

-- Create triggers for updated_at
CREATE TRIGGER update_tribes_updated_at
  BEFORE UPDATE ON public.tribes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();