export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { name, address, avatar } = req.body

  if (!name || !address) {
    return res.status(400).json({ error: 'Name and address are required' })
  }

  const nameRegex = /^[a-z0-9-]+$/
  if (!nameRegex.test(name) || name.length < 1 || name.length > 32) {
    return res.status(400).json({ error: 'Name must be 1-32 characters, lowercase alphanumeric or hyphens' })
  }

  const textRecords = {}
  if (avatar) {
    textRecords.avatar = avatar
  }

  try {
    const response = await fetch('https://namestone.com/api/public_v1/claim-name?single_claim=1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': process.env.NAMESTONE_API_KEY,
      },
      body: JSON.stringify({
        name,
        domain: 'wannabet.eth',
        address,
        text_records: textRecords,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error || data.message || 'Failed to claim name' })
    }

    return res.status(200).json({ success: true, data })
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' })
  }
}
