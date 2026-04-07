import { corsHeaders } from '@supabase/supabase-js/cors';

const SIGNALIFY_API_BASE = 'https://ecgbkytzisotjbqwfjzd.supabase.co/functions/v1';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const SIGNALIFY_API_KEY = Deno.env.get('SIGNALIFY_API_KEY');
    if (!SIGNALIFY_API_KEY) {
      throw new Error('SIGNALIFY_API_KEY is not configured');
    }

    const { action, address, signature, message } = await req.json();

    if (action === 'login') {
      // Verify wallet signature with Signalify
      const response = await fetch(`${SIGNALIFY_API_BASE}/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': SIGNALIFY_API_KEY,
        },
        body: JSON.stringify({ address, signature, message }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(`Signalify auth failed [${response.status}]: ${JSON.stringify(data)}`);
      }

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'notify') {
      const { to, title, notifyMessage } = await req.json();
      const response = await fetch(`${SIGNALIFY_API_BASE}/notify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': SIGNALIFY_API_KEY,
        },
        body: JSON.stringify({
          to,
          app: 'STX Tip Jar',
          title,
          message: notifyMessage,
        }),
      });

      const data = await response.json();
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Signalify auth error:', error);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
