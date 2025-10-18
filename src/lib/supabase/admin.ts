import { createClient } from '@supabase/supabase-js';

/**
 * Client Supabase Admin avec service_role_key
 * ⚠️ À utiliser UNIQUEMENT côté serveur pour les opérations admin
 * Ne JAMAIS exposer au client
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Supabase URL or Service Role Key is missing');
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}



