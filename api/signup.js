import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.DATABASE_WEB,
  process.env.DATABASE_SECRET
)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email, password, newEmail } = req.body

  try {
    const { data, error } = await supabase.auth.signUp({ email, password })

    if (error) return res.status(400).json({ error: error.message })
    const { error: dbError } = await supabase
      .from('users')
      .insert({ id: data.user.id, newemail: newEmail })

    if (dbError) return res.status(400).json({ error: dbError.message })

    res.status(200).json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}