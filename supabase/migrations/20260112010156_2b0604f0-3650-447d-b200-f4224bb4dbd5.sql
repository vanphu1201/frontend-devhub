-- Drop the existing public SELECT policy
DROP POLICY IF EXISTS "Tribe members are viewable by everyone" ON public.tribe_members;

-- Create a new policy that restricts SELECT to authenticated users only
CREATE POLICY "Tribe members are viewable by authenticated users"
ON public.tribe_members
FOR SELECT
TO authenticated
USING (true);