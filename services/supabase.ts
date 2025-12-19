
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rmchiwrooicdgxaebtxd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtY2hpd3Jvb2ljZGd4YWVidHhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxNDUwMTQsImV4cCI6MjA4MTcyMTAxNH0.c2rGe0NKULriu2KXAPZ9O9T5BH8SdE9ShAdYAp6ZIQ0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
