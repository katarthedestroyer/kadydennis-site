import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { email, firstName, formId, tags } = data;

    if (!email) {
      return new Response(JSON.stringify({ error: 'Email is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Try multiple ways to get the env var
    const API_SECRET = process.env.CONVERTKIT_API_SECRET
      || import.meta.env.CONVERTKIT_API_SECRET
      || (globalThis as any).process?.env?.CONVERTKIT_API_SECRET;

    if (!API_SECRET) {
      console.error('CONVERTKIT_API_SECRET not configured. Available env:', Object.keys(process.env || {}).filter(k => !k.startsWith('npm')).join(', '));
      return new Response(JSON.stringify({
        error: 'Server configuration error',
        debug: 'API_SECRET not found'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // If a specific form ID is provided, subscribe to that form
    // Otherwise, just add the subscriber with tags
    let response;

    if (formId) {
      // Subscribe to a specific form
      response = await fetch(`https://api.convertkit.com/v3/forms/${formId}/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_secret: API_SECRET,
          email,
          first_name: firstName || '',
          tags: tags || []
        })
      });
    } else {
      // Just add subscriber (requires at least one tag or form)
      // We'll use the tags endpoint
      if (tags && tags.length > 0) {
        response = await fetch(`https://api.convertkit.com/v3/tags/${tags[0]}/subscribe`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            api_secret: API_SECRET,
            email,
            first_name: firstName || ''
          })
        });
      } else {
        return new Response(JSON.stringify({ error: 'Form ID or tag required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ConvertKit API error:', response.status, errorText);
      return new Response(JSON.stringify({ error: 'Subscription failed', details: errorText }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const result = await response.json();

    return new Response(JSON.stringify({
      success: true,
      message: 'Successfully subscribed!',
      subscriber: result.subscription
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Subscribe error:', error);
    return new Response(JSON.stringify({ error: 'An error occurred' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const prerender = false;
