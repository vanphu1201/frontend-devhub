// Supabase client wrapper with hardcoded credentials
// This file ensures the client works even if env vars fail to load
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

const SUPABASE_URL = "https://xetqzgvlvmemragtugjr.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhldHF6Z3Zsdm1lbXJhZ3R1Z2pyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5OTMwMjksImV4cCI6MjA4MzU2OTAyOX0.1Y9XojErguLs9PSf_DNB-CCUiHKQfZxvqiLI4k2w3sg";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: typeof window !== 'undefined' ? localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
  }
});
