import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const body = req.body;
  console.log('Webhook received:', body);
  res.status(200).json({ status: 'received', data: body });
}
