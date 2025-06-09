export default function Home() {
  return (
    <div className='p-10'>
      <h1 className='text-3xl font-bold'>Broker Login Portal</h1>
      <ul className='mt-6 space-y-4'>
        <li><a href='/api/broker/login?broker=zerodha' className='text-blue-500'>Login with Zerodha</a></li>
        <li><a href='/api/broker/login?broker=fyers' className='text-green-500'>Login with Fyers</a></li>
        <li><a href='/api/broker/login?broker=angelone' className='text-red-500'>Login with Angel One</a></li>
      </ul>
    </div>
  )
}
