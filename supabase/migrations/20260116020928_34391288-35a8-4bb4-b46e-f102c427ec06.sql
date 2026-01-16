-- Fix 1: Allow sellers to view purchases of their products
DROP POLICY IF EXISTS "Users can view their own purchases" ON public.purchases;

CREATE POLICY "Users can view own purchases or sellers view their product purchases"
ON public.purchases
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id 
  OR auth.uid() IN (SELECT user_id FROM products WHERE id = purchases.product_id)
);

-- Fix 2: Allow sellers to view tickets for their products
DROP POLICY IF EXISTS "Users can view their own tickets" ON public.tickets;

CREATE POLICY "Users can view own tickets or sellers view product tickets"
ON public.tickets
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id 
  OR (product_id IS NOT NULL AND auth.uid() IN (SELECT user_id FROM products WHERE id = tickets.product_id))
);

-- Fix 3: Allow sellers to view and respond to ticket messages
DROP POLICY IF EXISTS "Users can view messages of their tickets" ON public.ticket_messages;
DROP POLICY IF EXISTS "Users can create messages on their tickets" ON public.ticket_messages;

CREATE POLICY "Users or sellers can view ticket messages"
ON public.ticket_messages
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM tickets t 
    LEFT JOIN products p ON t.product_id = p.id 
    WHERE t.id = ticket_messages.ticket_id 
    AND (t.user_id = auth.uid() OR p.user_id = auth.uid())
  )
);

CREATE POLICY "Users or sellers can create ticket messages"
ON public.ticket_messages
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id 
  AND EXISTS (
    SELECT 1 FROM tickets t 
    LEFT JOIN products p ON t.product_id = p.id 
    WHERE t.id = ticket_messages.ticket_id 
    AND (t.user_id = auth.uid() OR p.user_id = auth.uid())
  )
);