# 📈 Broker Login & Trade Management System

This application allows users to securely log in to their trading accounts (Zerodha, Fyers, Angel One), authorize access, and place trades through a unified API backend. The platform is built with **Next.js (React + API routes)**, integrates with **MongoDB**, and is containerized using **Docker** for easy deployment.

---

## 🚀 Features Implemented

### ✅ Multi-Broker Login Support
- Zerodha Kite Connect API
- Fyers API
- Angel One SmartAPI

### ✅ Secure Token Storage
- OAuth tokens are securely stored in MongoDB
- Tokens are linked to individual user accounts
- MongoDB collection: `broker_auth.tokens`

### ✅ Trade Placement APIs
- Unified endpoint: `/api/broker/trade`
- Supports market order placement across:
  - Zerodha
  - Fyers
  - Angel One

### ✅ Full Docker Support
- Dockerfile for the Next.js app
- MongoDB included via Docker Compose
- `.env.local` file for secrets and broker API credentials

---

## 🔐 Login Workflow (Broker-wise)

### 🟢 Zerodha

1. User clicks `Login with Zerodha`.
2. Redirected to: `https://kite.zerodha.com/connect/login`
3. After login, redirected back to:
   ```
   http://localhost:3000/api/broker/callback?request_token=XYZ
   ```
4. Backend exchanges `request_token` for `access_token` via Kite Connect token API.
5. Token is stored in MongoDB.

### 🟠 Fyers

1. User clicks `Login with Fyers`.
2. Redirected to: `https://api.fyers.in/api/v2/generate-authcode`
3. After login, redirected to:
   ```
   https://<your-domain>/api/broker/callback?code=XYZ
   ```
4. Backend exchanges code for `access_token` using Fyers token API.
5. Token is stored in MongoDB.

### 🔵 Angel One

1. User clicks `Login with Angel One`.
2. Redirected to: `https://smartapi.angelbroking.com/publisher-login`
3. After login, receives `auth_code` and uses client credentials to generate a session.
4. JWT Token is stored in MongoDB.

---

## 📤 Trade Placement (Unified API)

Endpoint:
```
GET /api/broker/trade?broker=zerodha&symbol=INFY&qty=1
```

### 🔁 How It Works:
- System looks up the user's token in MongoDB
- Sends a **Market Order** to the respective broker's trade API
- Currently supports **Intraday Market Orders**

### 💼 Supported Brokers

| Broker     | Endpoint Used | Authorization Type | Notes |
|------------|----------------|--------------------|-------|
| Zerodha    | `kite.trade/orders/regular` | API Key + Access Token | Requires daily re-auth |
| Fyers      | `fyers.in/api/v2/place-order` | Bearer Token | OAuth2 flow |
| Angel One  | `placeOrder` via SmartAPI | JWT Token | Requires clientcode + secret |

---

## ⚙️ Environment Variables

`.env.local`:
```
ZERODHA_API_KEY=
ZERODHA_API_SECRET=
FYERS_CLIENT_ID=
FYERS_SECRET_KEY=
ANGEL_CLIENT_CODE=
ANGEL_API_KEY=
ANGEL_SECRET=
REDIRECT_URL=http://localhost:3000/api/broker/callback
MONGO_URI=mongodb://localhost:27017/broker_tokens
```

---

## 🐳 Run via Docker

```bash
docker-compose up --build
```

## 🧪 Run Locally without Docker

```bash
npm install
npm run dev
```

Ensure MongoDB is running at `localhost:27017`.

---

## ✅ Final Notes

- All brokers require **manual login from users** to authorize access.
- **No login credentials are stored**; only access tokens are stored.
- You may extend the system to support order status updates, postback URL handling, and multi-user dashboards.

---

Made with ❤️ to unify Indian broker APIs into one easy-to-use system.


---

## 🆕 Additional Features

### 🧑‍💻 Frontend Dashboard (Client UI)

Accessible at:
```
http://localhost:3000/dashboard
```

You can:
- Select a broker
- Enter symbol (e.g. INFY, RELIANCE)
- Enter quantity
- Place a market order
- View API response in real-time

---

### 🔁 Token Refresh (Fyers)

While Fyers tokens expire in 24 hours, you may extend support for:
- Refresh token handling
- Periodic background token updates

(Current implementation uses initial `code` for access token.)

---

### 📥 Postback Webhook Support

Fyers and Zerodha can POST order status updates to:
```
/api/broker/postback
```

These will be printed to the server logs for now and can be used to:
- Track order statuses
- Update dashboards
- Send alerts or reports

To enable, provide the Postback URL in broker settings.

---

