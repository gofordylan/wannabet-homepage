export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { address } = req.query

  if (!address) {
    return res.status(400).json({ error: 'Address parameter is required' })
  }

  try {
    const response = await fetch(
      `https://namestone.com/api/public_v1/get-names?domain=wannabet.eth&address=${encodeURIComponent(address)}`,
      {
        headers: {
          'Authorization': process.env.NAMESTONE_API_KEY,
        },
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to get names' })
    }

    return res.status(200).json({ names: data })
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' })
  }
}
