"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Title from "@/components/Title";
import SearchBar from "@/components/SearchBar";
import GeoButton from "@/components/GeoButton";
import WeatherDeck from "@/components/WeatherDeck";

export default function ClientWeatherPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const city = sp.get("q") || "São Paulo";
  const lat = sp.get("lat");
  const lon = sp.get("lon");
  const temp = sp.get("temp") || "c";
  const wind = sp.get("wind") || "kmh";
  const precip = sp.get("precip") || "mm";

  const [inputValue, setInputValue] = useState(city);
  useEffect(() => setInputValue(city), [city]);

  function setQuery(next) {
    const params = new URLSearchParams(sp.toString());
    Object.entries(next).forEach(([k, v]) => {
      if (v == null || v === "") params.delete(k);
      else params.set(k, String(v));
    });
    router.replace(`/weather?${params.toString()}`);
  }

  const unitsFromQS = useMemo(
    () => ({
      temperature: temp === "f" ? "fahrenheit" : "celsius",
      windspeed: ["kmh", "mph", "ms", "kn"].includes(wind) ? wind : "kmh",
      precipitation: precip === "inch" ? "inch" : "mm",
    }),
    [temp, wind, precip]
  );

  return (
    <>
   <header>
				<Navbar />
				<Title className="mx-auto" title={"How’s the sky looking today?"} />
      </header>
			<main className="min-h-dvh px-4 py-8">
				<div className="mx-auto max-w-5xl space-y-6">
					<div className="flex flex-wrap items-center gap-2">
						<SearchBar
							className="mx-auto max-w-xl flex-1"
							defaultValue={inputValue}
							placeholder="Digite a cidade…"
							buttonText="Search"
							onSearch={(q) => setQuery({ q, lat: null, lon: null })}
						/>
						<GeoButton
							onPick={({ lat, lon }) => setQuery({ lat, lon, q: null })}
						/>
					</div>

					<WeatherDeck
						city={city}
						lat={lat}
						lon={lon}
						unitsFromQS={unitsFromQS}
						onUnitsChange={(u) =>
							setQuery({
								temp: u.temperature === "fahrenheit" ? "f" : "c",
								wind: u.windspeed,
								precip: u.precipitation,
							})
						}
					/>
				</div>
			</main>
            </>
  );
}
