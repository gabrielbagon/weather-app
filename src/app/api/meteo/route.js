export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  const tempUnit = (searchParams.get("temp") || "c").toLowerCase() === "f" ? "fahrenheit" : "celsius";
  const windUnit = ["kmh","mph","ms","kn"].includes((searchParams.get("wind")||"kmh").toLowerCase())
    ? (searchParams.get("wind")||"kmh").toLowerCase() : "kmh";
  const precipUnit = (searchParams.get("precip") || "mm").toLowerCase() === "inch" ? "inch" : "mm";

  // 1) Resolver localização (coords diretas OU geocoding por nome)
  let latitude, longitude, name, country_code, admin1, timezone;

  if (lat && lon) {
    latitude = Number(lat);
    longitude = Number(lon);
    // reverse geocoding só pra exibir nome legal
    const r = await fetch(
      `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${latitude}&longitude=${longitude}&count=1&language=pt&format=json`,
      { next: { revalidate: 0 } }
    );
    if (r.ok) {
      const jr = await r.json();
      const loc = jr?.results?.[0];
      if (loc) {
        name = loc.name; country_code = loc.country_code; admin1 = loc.admin1; timezone = loc.timezone;
      }
    }
    if (!name) { name = "Minha localização"; }
  } else {
    const gRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q || "São Paulo")}&count=1&language=pt&format=json`,
      { next: { revalidate: 0 } }
    );
    if (!gRes.ok) return Response.json({ error: "Falha no geocoding" }, { status: gRes.status });
    const g = await gRes.json();
    const loc = g?.results?.[0];
    if (!loc) return Response.json({ error: "Local não encontrado" }, { status: 404 });
    ({ latitude, longitude, name, country_code, admin1, timezone } = loc);
  }

  // 2) Forecast
  const params = new URLSearchParams({
    latitude, longitude,
    current: ["temperature_2m","apparent_temperature","relative_humidity_2m","wind_speed_10m","precipitation","weather_code"].join(","),
    hourly: ["temperature_2m","precipitation","weather_code"].join(","),
    daily: ["temperature_2m_max","temperature_2m_min","precipitation_sum","sunrise","sunset","weather_code"].join(","),
    timezone: "auto",
    temperature_unit: tempUnit,
    windspeed_unit: windUnit,
    precipitation_unit: precipUnit,
  });

  const fRes = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, { next: { revalidate: 0 } });
  if (!fRes.ok) return Response.json({ error: "Falha ao obter previsão" }, { status: fRes.status });
  const f = await fRes.json();

  const out = {
    location: {
      name,
      region: admin1 || null,
      country: country_code || null,
      latitude, longitude,
      timezone: f.timezone || timezone || "auto",
    },
    units: {
      temperature: tempUnit,
      windspeed: windUnit,
      precipitation: precipUnit,
    },
    current: {
      temp: Math.round(f.current?.temperature_2m ?? 0),
      feels_like: Math.round(f.current?.apparent_temperature ?? 0),
      humidity: f.current?.relative_humidity_2m ?? null,
      wind: f.current?.wind_speed_10m ?? null,
      precipitation: f.current?.precipitation ?? 0,
      code: f.current?.weather_code ?? null,
      timeISO: f.current?.time ?? null,
      sunrise: f.daily?.sunrise?.[0] ?? null,
      sunset: f.daily?.sunset?.[0] ?? null,
    },
    daily: (f.daily?.time || []).map((iso, i) => ({
      date: iso,
      tmax: Math.round(f.daily.temperature_2m_max[i]),
      tmin: Math.round(f.daily.temperature_2m_min[i]),
      precip: f.daily.precipitation_sum[i],
      code: f.daily.weather_code[i],
      sunrise: f.daily.sunrise[i],
      sunset: f.daily.sunset[i],
    })),
    hourly: {
      time: f.hourly?.time || [],
      temp: f.hourly?.temperature_2m || [],
      precip: f.hourly?.precipitation || [],
      code: f.hourly?.weather_code || [],
    },
  };

  return Response.json(out, { status: 200 });
}
