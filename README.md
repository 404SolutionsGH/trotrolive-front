
# 🚐 Trotro.Live Frontend

**Digitising Ghana’s Trotro Transport System — One Route at a Time**

This is the **frontend** of [Trotro.Live]([https://trotroweb3.onrender.com/]), a web application aimed at making transportation information more accessible, efficient, and connected for over 3.5 million commuters across Accra, Kumasi, and Obuasi.

Built with **Next.js**, this frontend connects to a Django backend and integrates with **Civic Auth Web3 Authentication** to enable decentralized community participation in the Trotro ecosystem.

---

## ⚙️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org)
- **Styling**: Tailwind CSS
- **Font**: [Geist](https://vercel.com/font)
- **Web3 Auth**: [Civic Pass](https://www.civic.com/)
- **API**: External Django Backend (`NEXT_PUBLIC_API_URL`)
- **Blockchain**: Solana (DAO integration coming soon)

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/trotro-frontend.git
cd trotro-front
```

### 2. Install Dependencies

Using your preferred package manager:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

---

## 🧪 Local Development

Start the development server:

```bash
npm run dev
# or
yarn dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Environment Variables

Create a `.env` file in the project root with the following:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Replace the value with your actual **Django API** endpoint.

✅ **Pro Tip**: Add `.env` to your `.gitignore`.

---

---

## 📦 Build for Production

```bash
npm run build
```

To preview the production build locally:

```bash
npm run start
```

---

## 🌐 Deployment

The easiest way to deploy is with [TrotroLive]([Trotro.live](https://trotroweb3.onrender.com/).  
Push your repo and follow their steps to get it live.

---

## 📌 Features in Progress

- ⚠️ **Civic Role Upgrade** (Drivers, Mates, Passengers, Station Masters)
- 🔜 **Solana DAO Program** (via Anchor)
- 🔜 **Django API Integration** for real-time transport data

---

## 👐 Contribute

We’re open to contributions! Please fork the repo and create a PR — let’s build a better commute together.

---

**Trotro.Live** – Making Ghana’s transport smarter, safer, and on-chain.

🚌 🇬🇭 🛠️

---

