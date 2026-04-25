export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
}

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
                  'Content-Type': 'application/json',
            },
    body: JSON.stringify({
            from: 'halliewho <noreply@halliewho.com>',
            to: ['halliegracehm@gmail.com'],
            subject: `New collab inquiry from ${name}`,
      html: `
        <h2>New Work With Me submission</h2>
        <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Message:</strong></p>
              <p>${message}</p>
            `,
      }),
      });

  if (response.ok) {
    return res.status(200).json({ success: true });
  } else {
    const err = await response.json();
    return res.status(400).json({ error: err.message || 'Something went wrong' });
  }
}
