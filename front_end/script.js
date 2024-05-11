import { createClient } from '@supabase/supabase-js'

// Supabase initialization
const supabaseUrl = 'https://dezdfpmeuwlffovlxhdz.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)