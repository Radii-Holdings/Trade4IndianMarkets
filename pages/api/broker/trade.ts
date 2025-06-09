import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGO_URI || '');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { broker, symbol, qty } = req.query;

  await client.connect();
  const db = client.db('broker_auth');
  const tokens = db.collection('tokens');
  const user = await tokens.findOne({ broker });

  if (!user) return res.status(404).json({ error: 'User not found for broker' });

  if (broker === 'zerodha') {
    const response = await fetch('https://api.kite.trade/orders/regular', {
      method: 'POST',
      headers: {
        'X-Kite-Version': '3',
        'Authorization': `token ${process.env.ZERODHA_API_KEY}:${user.token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        exchange: 'NSE',
        tradingsymbol: symbol,
        transaction_type: 'BUY',
        order_type: 'MARKET',
        quantity: qty,
        product: 'MIS',
        validity: 'DAY',
      }),
    });
    const data = await response.json();
    return res.status(200).json(data);
  }

  if (broker === 'fyers') {
    const response = await fetch('https://api.fyers.in/api/v2/place-order', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${user.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        symbol: `NSE:${symbol}`,
        qty: parseInt(qty),
        type: 2, // MARKET
        side: 1, // BUY
        productType: 'INTRADAY',
        limitPrice: 0,
        stopPrice: 0,
        disclosedQty: 0,
        validity: 'DAY',
        offlineOrder: 'False',
        stopLoss: 0,
        takeProfit: 0
      }),
    });
    const data = await response.json();
    return res.status(200).json(data);
  }

  if (broker === 'angelone') {
    const response = await fetch('https://apiconnect.angelbroking.com/rest/secure/angelbroking/order/v1/placeOrder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-PrivateKey': process.env.ANGEL_API_KEY,
        'X-SourceID': 'WEB',
        'X-ClientLocalIP': '127.0.0.1',
        'X-ClientPublicIP': '127.0.0.1',
        'X-MACAddress': '00:00:5e:00:53:af',
        'Authorization': `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        variety: 'NORMAL',
        tradingsymbol: symbol,
        symboltoken: '3045',  // Placeholder, must be fetched based on symbol
        transactiontype: 'BUY',
        exchange: 'NSE',
        ordertype: 'MARKET',
        producttype: 'INTRADAY',
        duration: 'DAY',
        quantity: qty,
        price: '0',
        squareoff: '0',
        stoploss: '0',
        trailingStopLoss: '0'
      }),
    });
    const data = await response.json();
    return res.status(200).json(data);
  }

  res.status(400).json({ error: 'Broker not supported' });
}
