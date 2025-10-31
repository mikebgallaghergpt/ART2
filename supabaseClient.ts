// supabaseClient.ts  <-- This is the correct file content

import { createClient } from '@supabase/supabase-js'

// Get Supabase URL and Anon Key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Error handling: Make sure variables are loaded
if (!supabaseUrl) {
  throw new Error("Supabase URL not found. Make sure VITE_SUPABASE_URL is set in your .env file.");
}
if (!supabaseAnonKey) {
  throw new Error("Supabase Anon Key not found. Make sure VITE_SUPABASE_ANON_KEY is set in your .env file.");
}

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)