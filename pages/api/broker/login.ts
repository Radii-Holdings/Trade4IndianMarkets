import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { broker } = req.query;

  if (broker === 'zerodha') {
    const url = `https://kite.zerodha.com/connect/login?v=3&api_key=${process.env.ZERODHA_API_KEY}`;
    res.redirect(url);
  } else if (broker === 'fyers') {
    const url = `https://api.fyers.in/api/v2/generate-authcode?client_id=${process.env.FYERS_CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URL}&response_type=code&state=state`;
    res.redirect(url);
  } else if (broker === 'angelone') {
    const url = `https://smartapi.angelbroking.com/publisher-login?api_key=${process.env.ANGEL_API_KEY}`;
    res.redirect(url);
  } else {
    res.status(400).json({ error: 'Invalid broker' });
  }
}
