import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient, processLock } from '@supabase/supabase-js'
import 'react-native-url-polyfill/auto'

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL! || "https://qadmuevyrhcruytpavlq.supabase.co",
  process.env.EXPO_PUBLIC_SUPABASE_KEY! || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhZG11ZXZ5cmhjcnV5dHBhdmxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwNjQzODksImV4cCI6MjA2NzY0MDM4OX0.nRI51kFwlqHpZgvqsmA0OIz8_0OefJxQHJp_bBTWqTE",
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
      lock: processLock,
    },
  })
        