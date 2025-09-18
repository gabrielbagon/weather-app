

## Weather App — Frontend Mentor Challenge

Solution for the [Frontend Mentor – Weather app challenge](https://www.frontendmentor.io/challenges/weather-app-K1FhddVm49).  
Built with **Next.js 15**, **React 19**, **Tailwind CSS v4**, and the **Open‑Meteo** APIs (no key required).

---

## Live

- **Live Site URL:** https://weather-app-gabriel-bagons-projects.vercel.app/weather
---

## Features

- 🔎 **City search** with URL sync (`/weather?q=Osasco`)  
- 📍 **Use my location** (geolocation) → `/weather?lat=…&lon=…`
- 🌡️ **Units toggle** (°C/°F, km/h/mph/m/s/kn, mm/inch) persisted in URL + localStorage
- 🗓️ **7‑day forecast** + **hourly** by selected day
- 🌈 **Animated weather backgrounds** (clear/partly/clouds/rain/snow/fog/thunder + day/night)
- ♿ **A11y**: landmarks, keyboard navigation, focus states, `aria-*` for status/alerts
- 🌓 **Dark mode** via system preference
- ⚙️ **Type‑safe endpoints** (Route Handlers) without exposing keys (Open‑Meteo does not require key)
- 💨 **Fast**: Next 15 + Turbopack dev, small payloads, no client key exchange

---

## Tech Stack

- **Next.js** 15 (App Router) + **React** 19
- **Tailwind CSS** v4 (via `@tailwindcss/postcss`)
- **Open‑Meteo** APIs: Geocoding, Reverse Geocoding & Forecast
- Font: **DM Sans** with `next/font`

---

## Project Structure

```
src/
  app/
    api/
      meteo/
        route.js          # GET handler -> Open‑Meteo (geocoding + forecast)
    weather/
      page.jsx            # page with SearchBar + GeoButton + WeatherDeck (URL-driven)
    layout.js
    globals.css
  components/
    AnimatedSky.jsx       # animated backgrounds based on conditions + time of day
    DropdownMenu.jsx      # accessible dropdown (Esc/click-out/arrow keys)
    GeoButton.jsx         # gets geolocation and updates URL (lat/lon)
    SearchBar.jsx         # rounded input + button, role="search", a11y labels
    UnitsSelect.jsx       # temperature/wind/precipitation select
    WeatherDeck.jsx       # main deck with Current, 7-day, Hourly
  lib/
    weather-icons.js      # icon + condition helpers (WMO -> emoji/condition)
public/
  # place static assets here (favicons, preview images, etc.)
```

---

## Getting Started

### Prerequisites
- Node.js 18+ (recommended 20+)
- npm / pnpm / yarn

### 1) Install
```bash
npm i
```

### 2) Dev server
```bash
npm run dev
# http://localhost:3000
```

> No environment variables are required (Open‑Meteo has no API key).

### 3) Tailwind v4 setup (already wired)
- `postcss.config.mjs`
  ```js
  export default { plugins: { "@tailwindcss/postcss": {} } };
  ```
- `app/globals.css`
  ```css
  @import "tailwindcss";
  ```

### 4) Global font (DM Sans)
`app/layout.js`
```js
import { DM_Sans } from "next/font/google";
const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400","500","700"], display: "swap" });
export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={`${dmSans.className} min-h-dvh`}>{children}</body>
    </html>
  );
}
```

---

## How it works

### API (server) — `GET /api/meteo`
- Accepts either a city name (`q`) **or** coordinates (`lat`, `lon`)
- Supports unit params: `temp=c|f`, `wind=kmh|mph|ms|kn`, `precip=mm|inch`
- Pipeline:
  1. Geocoding (or Reverse Geocoding if `lat/lon` are provided)
  2. Forecast (`current`, `hourly`, `daily`) with chosen units
  3. Normalizes the payload for the UI

### UI (client)
- `/weather` reads and writes query string
- `SearchBar` updates `?q=`; `GeoButton` sets `?lat=&lon=`
- `WeatherDeck` consumes `/api/meteo` and renders:
  - **Current**: temp, feels like, humidity, wind, precipitation, sunrise/sunset
  - **7‑day cards** (select day) → **Hourly** grid for the chosen day
  - **UnitsSelect** persists selection in URL and localStorage
  - **AnimatedSky** picks background via WMO code + day/night calculation

---

## Accessibility

- Proper landmarks (`header/main/section/footer`) and heading hierarchy
- Search has `role="search"`, label invisível (`sr-only`)
- Loading uses `role="status"`, errors use `role="alert"`
- Dropdown menu (if used) closes on Esc/click‑outside and supports arrow keys

---

## Deployment (Vercel)

1. Push this repository to GitHub (main branch)
2. Import the repo on [Vercel](https://vercel.com/import)
3. Framework preset: **Next.js** — no env vars needed
4. Deploy

---

## Useful Links

- Open‑Meteo Forecast API – https://open-meteo.com/en/docs
- Open‑Meteo Geocoding – https://open-meteo.com/en/docs/geocoding-api
- Frontend Mentor – https://www.frontendmentor.io/

---

## Roadmap (nice-to-have)

- PWA (installable offline shell + caching strategies)
- Unit tests (Vitest/RTL) for components and API route
- Replace emoji icons with an SVG icon set
- Add charts (temperature/precipitation) for hourly/daily
- i18n (pt/en) via `next-intl` or `next-i18n-router`

---

## License

This template is unlicensed.  
If you want to open‑source it, consider adding an MIT `LICENSE` file.
