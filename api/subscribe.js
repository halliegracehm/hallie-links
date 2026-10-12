// Adds an email to the Mailchimp audience, tagged with the topics they picked.
// Needs MAILCHIMP_API_KEY and MAILCHIMP_AUDIENCE_ID set in Vercel.
import crypto from 'node:crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, topics } = req.body || {};
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Enter a valid email address.' });
  }

  const API_KEY = process.env.MAILCHIMP_API_KEY;
  const AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;
  if (!API_KEY || !AUDIENCE_ID) {
    return res.status(500).json({ error: 'Signup is not set up yet.' });
  }

  const DATACENTER = API_KEY.split('-').pop(); // e.g. "us17"
  const base = `https://${DATACENTER}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members`;
  const headers = { Authorization: `apikey ${API_KEY}`, 'Content-Type': 'application/json' };
  const tags = ['links.halliewho.com', ...(Array.isArray(topics) ? topics : [])]
    .map((t) => String(t).slice(0, 60))
    .slice(0, 12);

  const response = await fetch(base, {
    method: 'POST',
    headers,
    body: JSON.stringify({ email_address: email, status: 'subscribed', tags }),
  });
  const data = await response.json();

  if (response.ok) {
    return res.status(200).json({ success: true });
  }

  // Already subscribed: just add the new topic tags.
  if (data.title === 'Member Exists') {
    const hash = crypto.createHash('md5').update(email.toLowerCase()).digest('hex');
    await fetch(`${base}/${hash}/tags`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ tags: tags.map((name) => ({ name, status: 'active' })) }),
    });
    return res.status(200).json({ success: true, existing: true });
  }

  return res.status(400).json({ error: data.detail || "That didn't go through." });
}
