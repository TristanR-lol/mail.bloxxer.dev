import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, subject, message } = req.body;

  try {
    const data = await resend.emails.send({
      from: 'tristan@bloxxer.dev',
      to: to,
      subject: subject,
      html: message
    });

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}