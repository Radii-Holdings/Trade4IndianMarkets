import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGO_URI || '');

async function storeToken(broker, token, profile) {
  await client.connect();
  const db = client.db('broker_auth');
  const collection = db.collection('tokens');
  await collection.updateOne(
    { broker, profile: profile.user_id || profile.client_id },
    { $set: { token, profile, updated: new Date() } },
    { upsert: true }
  );
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { request_token, code, auth_code } = req.query;

  if (request_token) {
    // Zerodha flow
    const response = await fetch('https://api.kite.trade/session/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        api_key: process.env.ZERODHA_API_KEY,
        request_token,
        checksum: '', // Optional: Add checksum logic if required
      }),
    });
    const data = await response.json();
    await storeToken('zerodha', data.data.access_token, data.data);
  } else if (code) {
    // Fyers flow
    const response = await fetch('https://api.fyers.in/api/v2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.FYERS_CLIENT_ID,
        secret_key: process.env.FYERS_SECRET_KEY,
        code,
        grant_type: 'authorization_code',
      }),
    });
    const data = await response.json();
    await storeToken('fyers', data.access_token, data);
  } else if (auth_code) {
    // Angel One flow
    const response = await fetch('https://apiconnect.angelbroking.com/rest/auth/angelbroking/user/v1/loginByPassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-ApiKey': process.env.ANGEL_API_KEY,
      },
      body: JSON.stringify({
        clientcode: process.env.ANGEL_CLIENT_CODE,
        password: process.env.ANGEL_SECRET,
      }),
    });
    const data = await response.json();
    await storeToken('angelone', data.data.jwtToken, data.data);
  }

  res.redirect('/');
}
