import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase credentials not configured');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export const callEdgeFunction = async (functionName: string, payload?: any) => {
  const apiUrl = `${supabaseUrl}/functions/v1/${functionName}`;

  const headers = {
    'Authorization': `Bearer ${supabaseKey}`,
    'Content-Type': 'application/json',
  };

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers,
    body: payload ? JSON.stringify(payload) : undefined,
  });

  if (!response.ok) {
    throw new Error(`Edge function error: ${response.statusText}`);
  }

  return await response.json();
};
