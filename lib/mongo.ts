import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGO_URI || '');
export default async function getDb() {
  if (!client.isConnected) await client.connect();
  return client.db('broker_auth');
}
