-- SQL Script to fix Admin Support Permissions
-- Run this in your Supabase SQL Editor

-- 1. Ensure the 'role' column exists in profiles (for admin detection)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- 2. Update RLS policies for 'tickets' table
-- First, enable RLS
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own tickets
DROP POLICY IF EXISTS "Users can view own tickets" ON public.tickets;
CREATE POLICY "Users can view own tickets" ON public.tickets
FOR SELECT USING (auth.uid() = user_id);

-- Policy: Admins can view ALL tickets
DROP POLICY IF EXISTS "Admins can view all tickets" ON public.tickets;
CREATE POLICY "Admins can view all tickets" ON public.tickets
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Policy: Users can create tickets
DROP POLICY IF EXISTS "Users can create tickets" ON public.tickets;
CREATE POLICY "Users can create tickets" ON public.tickets
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Admins can update ALL tickets (IMPORTANT for resolving tickets)
DROP POLICY IF EXISTS "Admins can update all tickets" ON public.tickets;
CREATE POLICY "Admins can update all tickets" ON public.tickets
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- 3. Update RLS policies for 'ticket_messages' table
ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view messages of their own tickets
DROP POLICY IF EXISTS "Users can view messages of own tickets" ON public.ticket_messages;
CREATE POLICY "Users can view messages of own tickets" ON public.ticket_messages
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.tickets 
    WHERE tickets.id = ticket_id AND (tickets.user_id = auth.uid() OR 
      EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
      )
    )
  )
);

-- Policy: Anyone logged in can send a message (logic is handled by app)
DROP POLICY IF EXISTS "Anyone can send ticket messages" ON public.ticket_messages;
CREATE POLICY "Anyone can send ticket messages" ON public.ticket_messages
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 4. TIP: How to set yourself as an Admin
-- Replace 'admin@codeconnect.com' with your actual email if different
-- UPDATE public.profiles SET role = 'admin' WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@codeconnect.com' LIMIT 1);
