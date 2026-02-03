-- SQL script to remove Tribes-related tables
-- Run this in your Supabase SQL Editor

-- Drop tribe_members table first due to foreign key
DROP TABLE IF EXISTS public.tribe_members CASCADE;

-- Drop tribes table
DROP TABLE IF EXISTS public.tribes CASCADE;

-- Remove any related stats columns if they exist (optional, depends on if they were added to profiles etc)
-- ALTER TABLE public.profiles DROP COLUMN IF EXISTS tribes_count;
