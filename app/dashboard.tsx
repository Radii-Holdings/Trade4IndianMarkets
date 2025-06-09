'use client';
import { useState } from 'react';

export default function Dashboard() {
  const [broker, setBroker] = useState('zerodha');
  const [symbol, setSymbol] = useState('INFY');
  const [qty, setQty] = useState(1);
  const [result, setResult] = useState('');

  const placeTrade = async () => {
    const res = await fetch(`/api/broker/trade?broker=${broker}&symbol=${symbol}&qty=${qty}`);
    const data = await res.json();
    setResult(JSON.stringify(data));
  };

  return (
    <div className='p-10'>
      <h2 className='text-2xl font-bold mb-4'>📊 Trade Placement Dashboard</h2>
      <div className='space-y-4'>
        <div>
          <label>Broker:</label>
          <select value={broker} onChange={e => setBroker(e.target.value)} className='ml-2'>
            <option value='zerodha'>Zerodha</option>
            <option value='fyers'>Fyers</option>
            <option value='angelone'>Angel One</option>
          </select>
        </div>
        <div>
          <label>Symbol:</label>
          <input type='text' value={symbol} onChange={e => setSymbol(e.target.value)} className='ml-2 border p-1' />
        </div>
        <div>
          <label>Quantity:</label>
          <input type='number' value={qty} onChange={e => setQty(Number(e.target.value))} className='ml-2 border p-1' />
        </div>
        <button onClick={placeTrade} className='bg-blue-500 text-white px-4 py-2 rounded'>
          Place Trade
        </button>
        <div className='mt-4'>
          <h3 className='font-semibold'>Response:</h3>
          <pre className='bg-gray-100 p-4'>{result}</pre>
        </div>
      </div>
    </div>
  );
}
