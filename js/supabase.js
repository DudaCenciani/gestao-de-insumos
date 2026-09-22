import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

export const SUPABASE_URL = 'https://ctzimdejjqoxhamkgcpg.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_T8XQ3nfVs2awDwQ_tzJVeQ_yICmPje2';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
