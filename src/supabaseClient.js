import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hkjzrqsesrktsfagyxwl.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhranpycXNlc3JrdHNmYWd5eHdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3NjIxMjEsImV4cCI6MjA5MzMzODEyMX0.Pyuan3eKMbFk4zHzKjWFXMGiUA8lwsghOdF3XXqN9fw'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)