# Satstack

See the value of your satoshis over time.

A minimal, open source tool that takes a satoshi amount and shows its fiat value across any time range — last week, month, year, or all time. Black and white. No noise.

## Features

- Live BTC price and historical chart via [CoinGecko](https://coingecko.com) — no API key required
- 9 currencies: USD, EUR, GBP, JPY, CHF, AUD, CAD, BRL, SGD
- Time ranges: 1W, 1M, 1Y, ALL
- Chart value updates instantly as you type — no extra network calls
- Server-side caching (60s price, 5min history) — scales to real traffic
- Persists your sat amount and currency selection between visits

## Stack

- [Next.js 15](https://nextjs.org) (App Router)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Recharts](https://recharts.org)
- [CoinGecko API](https://www.coingecko.com/en/api)

## Local development

```bash
git clone https://github.com/khalillechelt/satstack.git
cd satstack
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). No environment variables required.

## Testing

```bash
npm test
```

20 tests covering the currency formatter, sat input, range selector, and currency dropdown.

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/khalillechelt/satstack)

Or: push to GitHub → import in [Vercel](https://vercel.com) → deploy. No environment variables needed.

## Contributing

PRs welcome. Keep it minimal — the goal is signal, not features.

1. Fork the repo
2. Create a branch: `git checkout -b my-change`
3. Make your change and add tests if relevant
4. Open a pull request

## License

[MIT](./LICENSE)
