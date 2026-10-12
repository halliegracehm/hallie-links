// Emails "Collabs and proposals" messages to Hallie through Resend.
// Needs RESEND_API_KEY set in Vercel.
const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Fill in your name, email, and message.' });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    return res.status(500).json({ error: 'The contact form is not set up yet.' });
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'halliewho <noreply@halliewho.com>',
      to: ['halliegracehm@gmail.com'],
      reply_to: email,
      subject: `New collab inquiry from ${String(name).slice(0, 80)}`,
      html: `
        <h2>New collab or proposal</h2>
        <p><strong>Name:</strong> ${esc(name)}</p>
        <p><strong>Email:</strong> ${esc(email)}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space:pre-wrap">${esc(message)}</p>
      `,
    }),
  });

  if (response.ok) {
    return res.status(200).json({ success: true });
  }
  const err = await response.json().catch(() => ({}));
  return res.status(400).json({ error: err.message || "That didn't go through." });
}
