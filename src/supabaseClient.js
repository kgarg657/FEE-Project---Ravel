// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Aapka Supabase URL aur anon public key
const SUPABASE_URL = 'https://oodztldaeehyjflgjwtc.supabase.co'; //[cite: 2]
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9vZHp0bGRhZWVoeWpmbGdqd3RjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI5MDUwNDksImV4cCI6MjEwODQ4MTA0OX0.3zq41wnaMZhPEO9POk5oVPM83Jv_FoS2--plCHU_LL0'; // Yahan apni actual anon key daalein

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);