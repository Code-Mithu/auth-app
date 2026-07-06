import { createBrowserClient } from '@supabase/ssr'

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  return {
    url: url || '',
    key: key || ''
  }
}

export const createBrowserSupabaseClient = () => {
  const { url, key } = getSupabaseConfig()
  return createBrowserClient(url, key)
}
