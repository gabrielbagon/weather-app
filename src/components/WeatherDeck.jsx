"use client";
import { useEffect, useMemo, useState } from "react";
import UnitsSelect from "./UnitsSelect";
import { conditionFromWMO, iconFromWMO, formatHourLocal, formatDayShort } from "@/lib/weather-icons";
import AnimatedSky from "@/components/AnimatedSky";



export default function WeatherDeck({ city = "São Paulo" }) {
  const [units, setUnits] = useState({ temperature: "celsius", windspeed: "kmh", precipitation: "mm" });
  const [daysIndex, setDaysIndex] = useState(0);
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("idle"); // idle|loading|ok|error
  const [error, setError] = useState("");

  async function load() {
    setStatus("loading");
    setError("");
    const qs = new URLSearchParams({
      q: city,
      temp: units.temperature === "fahrenheit" ? "f" : "c",
      wind: units.windspeed,
      precip: units.precipitation,
    });
    const res = await fetch(`/api/meteo?${qs}`, { cache: "no-store" });
    const json = await res.json();
    if (!res.ok) { setError(json?.error || "Erro"); setStatus("error"); return; }
    setData(json);
    setStatus("ok");
    setDaysIndex(0);
  }

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [city, units]);

  // agrupa hourly por dia (array de arrays)
  const hourlyByDay = useMemo(() => {
    if (!data?.hourly?.time?.length) return [];
    const tz = data.location?.timezone;
    const buckets = {};
    data.hourly.time.forEach((iso, i) => {
      const d = tz ? new Date(new Date(iso).toLocaleString("en-US", { timeZone: tz })) : new Date(iso);
      const key = d.toISOString().slice(0,10);
      (buckets[key] ||= []).push({
        iso,
        hour: formatHourLocal(iso, tz),
        temp: Math.round(data.hourly.temp[i]),
        precip: data.hourly.precip[i],
        code: data.hourly.code[i],
      });
    });
    return Object.values(buckets);
  }, [data]);

  const uT = units.temperature === "fahrenheit" ? "°F" : "°C";
  const uW = { kmh: "km/h", mph: "mph", ms: "m/s", kn: "kn" }[units.windspeed];
  const uP = units.precipitation;
  const cond = status === "ok" ? conditionFromWMO(data.current.code) : "clear";

// dia/noite com base em timezone local
function toLocal(iso, tz) {
  if (!iso) return null;
  return new Date(new Date(iso).toLocaleString("en-US", { timeZone: data.location?.timezone || "UTC" }));
}
const now = toLocal(data?.current?.timeISO, data?.location?.timezone);
const sr  = toLocal(data?.current?.sunrise, data?.location?.timezone);
const ss  = toLocal(data?.current?.sunset,  data?.location?.timezone);
const isDay = now && sr && ss ? now >= sr && now <= ss : true;
const timeOfDay = isDay ? "day" : "night";

  return (
    <section className="w-full space-y-6">
      {/* header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">
            {status==="ok" ? `${data.location.name}${data.location.country ? `, ${data.location.country}` : ""}` : "Clima"}
          </h2>
          {status==="loading" && <p role="status" className="text-sm text-slate-500">Carregando…</p>}
          {status==="error" && <p role="alert" className="text-sm text-red-600">{error}</p>}
        </div>
        <UnitsSelect value={units} onChange={setUnits} />
      </div>

      {/* destaque atual */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 p-5 shadow-sm dark:border-slate-700">
  {/* fundo animado */}
  <AnimatedSky condition={cond} timeOfDay={timeOfDay} />

  {/* (opcional) véu para legibilidade do texto */}
  <div className="pointer-events-none absolute inset-0 bg-white/10 dark:bg-slate-900/20 backdrop-blur-[1px]" />

  {/* conteúdo acima do fundo */}
  <div className="relative z-10">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-slate-700/80 dark:text-slate-200/80 text-sm">Agora</p>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-5xl font-bold tracking-tight">
            {status === "ok" ? `${data.current.temp}${uT}` : "—"}
          </span>
          <span className="text-2xl">{status === "ok" ? iconFromWMO(data.current.code) : ""}</span>
        </div>
        <p className="mt-2 text-sm">
          Sensação {status==="ok" ? `${data.current.feels_like}${uT}` : "—"} ·
          Umidade {status==="ok" ? `${data.current.humidity}%` : "—"} ·
          Vento {status==="ok" ? `${Math.round(data.current.wind)} ${uW}` : "—"} ·
          Chuva {status==="ok" ? `${data.current.precipitation} ${uP}` : "—"}
        </p>
      </div>
      <div className="text-sm">
        <div>Nascer: {status==="ok" ? formatHourLocal(data.current.sunrise, data.location.timezone) : "--:--"}</div>
        <div>Pôr: {status==="ok" ? formatHourLocal(data.current.sunset,  data.location.timezone) : "--:--"}</div>
      </div>
    </div>
  </div>
</div>


      {/* 7 dias */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-7">
        {(data?.daily || Array.from({length:7})).map((d, i) => (
          <button
            key={d?.date ?? i}
            onClick={()=>setDaysIndex(i)}
            className={`rounded-xl border p-4 text-left shadow-sm bg-white/70 dark:bg-slate-900/60 dark:border-slate-700
                        ${i===daysIndex ? "ring-2 ring-indigo-500" : ""}`}
            aria-pressed={i===daysIndex}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">{d?.date ? formatDayShort(d.date) : "—"}</span>
              <span className="text-lg">{d?.code!=null ? iconFromWMO(d.code) : "·"}</span>
            </div>
            <div className="mt-2 font-semibold">
              {d?.tmax!=null ? `${d.tmax}${uT}` : "—"} <span className="text-slate-500">/ {d?.tmin!=null ? `${d.tmin}${uT}` : "—"}</span>
            </div>
            <div className="text-sm text-slate-500">Chuva: {d?.precip!=null ? `${d.precip} ${uP}` : "—"}</div>
          </button>
        ))}
      </div>

      {/* hourly do dia selecionado */}
      <div className="rounded-2xl border p-4 shadow-sm bg-white/70 dark:bg-slate-900/60 dark:border-slate-700">
        <p className="mb-3 text-sm text-slate-500">Próximas horas</p>
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8" role="list">
          {(hourlyByDay[daysIndex] || []).map((h, i) => (
            <li key={h.iso ?? i} className="rounded-xl bg-slate-50 p-3 text-center text-sm dark:bg-slate-800/50">
              <p className="font-medium">{h.hour}</p>
              <p className="mt-1 text-lg font-semibold">{`${h.temp}${uT}`}</p>
              <p className="mt-1">{iconFromWMO(h.code)} · {h.precip} {uP}</p>
            </li>
          ))}
          {!hourlyByDay[daysIndex]?.length && (
            <li className="text-sm text-slate-500">Sem dados para este dia.</li>
          )}
        </ul>
      </div>
    </section>
  );
}
