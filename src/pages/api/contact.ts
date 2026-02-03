import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { name, email, subject, message } = data;

    if (!email || !name || !message) {
      return new Response(JSON.stringify({ error: 'Name, email, and message are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const API_SECRET = process.env.CONVERTKIT_API_SECRET
      || import.meta.env.CONVERTKIT_API_SECRET
      || (globalThis as any).process?.env?.CONVERTKIT_API_SECRET;

    if (!API_SECRET) {
      console.error('CONVERTKIT_API_SECRET not configured');
      return new Response(JSON.stringify({
        error: 'Server configuration error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Contact inquiry tag ID - you may need to create this in ConvertKit
    // and update this ID
    const CONTACT_TAG_ID = '15471216'; // contact-inquiry tag

    // Subscribe to ConvertKit with the contact-inquiry tag
    // The message will be stored in custom fields
    const response = await fetch(`https://api.convertkit.com/v3/tags/${CONTACT_TAG_ID}/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_secret: API_SECRET,
        email,
        first_name: name,
        fields: {
          contact_subject: subject || 'General Inquiry',
          contact_message: message
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ConvertKit API error:', response.status, errorText);
      return new Response(JSON.stringify({ error: 'Failed to send message' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Message sent successfully!'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return new Response(JSON.stringify({ error: 'An error occurred' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const prerender = false;
