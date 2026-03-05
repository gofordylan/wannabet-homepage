export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { name } = req.query

  if (!name) {
    return res.status(400).json({ error: 'Name parameter is required' })
  }

  try {
    const response = await fetch(
      `https://namestone.com/api/public_v1/search-names?domain=wannabet.eth&name=${encodeURIComponent(name)}&exact_match=1`,
      {
        headers: {
          'Authorization': process.env.NAMESTONE_API_KEY,
        },
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to check name' })
    }

    const available = !Array.isArray(data) || data.length === 0
    return res.status(200).json({ available, existing: available ? null : data[0] })
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' })
  }
}
