import { createClient } from '@supabase/supabase-js'

let client: any | undefined

export function getSupabase() {
  if (!client) {
    const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
    const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined
    if (!url || !anon) throw new Error('Missing Supabase env')
    client = createClient<any>(url, anon)
  }
  return client!
}
