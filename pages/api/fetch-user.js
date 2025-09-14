import https from 'https';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { user_json_url } = req.body;

  if (!user_json_url) {
    return res.status(400).json({ error: 'Missing user_json_url' });
  }

  https.get(user_json_url, (response) => {
    let data = '';

    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      try {
        const jsonData = JSON.parse(data);
        const { user_country_code, user_phone_number, user_first_name, user_last_name } = jsonData;
        res.status(200).json({
          user_country_code,
          user_phone_number,
          user_first_name,
          user_last_name,
        });
      } catch (error) {
        res.status(500).json({ error: 'Failed to parse user data' });
      }
    });
  }).on('error', (err) => {
    res.status(500).json({ error: 'Failed to fetch user data: ' + err.message });
  });
}
