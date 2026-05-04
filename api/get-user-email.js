import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.DATABASE_WEB,
  process.env.DATABASE_SECRET
)

export default async function handler(req, res) {
  const { userId } = req.body

  try {
    const { data, error } = await supabase
      .from('users')
      .select('NewEmail')
      .eq('id', userId)
      .single()

    if (error) return res.status(400).json({ error: error.message })

    res.status(200).json({ newEmail: data.NewEmail })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}