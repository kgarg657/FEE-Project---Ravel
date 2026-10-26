import { createClient } from '@supabase/supabase-js';

const defaultUrl = 'https://oodztldaeehyjflgjwtc.supabase.co';
const defaultKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9vZHp0bGRhZWVoeWpmbGdqd3RjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI5MDUwNDksImV4cCI6MjEwODQ4MTA0OX0.3zq41wnaMZhPEO9POk5oVPM83Jv_FoS2--plCHU_LL0';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || defaultUrl;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || defaultKey;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('placeholder')
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
