import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const createDummySupabaseClient = () => {
  const emptyResponse = Promise.resolve({ data: null, error: null });

  const chainable = new Proxy(
    {},
    {
      get(_target, prop: string) {
        if (prop === 'then') {
          return emptyResponse.then.bind(emptyResponse);
        }
        if (prop === 'catch') {
          return emptyResponse.catch.bind(emptyResponse);
        }
        if (prop === 'finally') {
          return emptyResponse.finally.bind(emptyResponse);
        }
        if (prop === 'auth') {
          return {
            getSession: async () => ({ data: { session: null }, error: null }),
            getUser: async () => ({ data: { user: null }, error: null }),
            signInWithPassword: async () => ({ data: null, error: null }),
            signOut: async () => ({ error: null }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
          };
        }
        return (..._args: unknown[]) => chainable;
      },
    }
  );

  return chainable;
};

const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = hasSupabaseConfig
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (createDummySupabaseClient() as any);

export interface UserProfile {
  id: string;
  user_name: string;
  higher_self_name: string;
  created_at: string;
  updated_at: string;
}
