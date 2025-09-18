"use client";
import { useState } from "react";

export default function GeoButton({ onPick }) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (!("geolocation" in navigator)) {
      alert("Geolocalização não suportada neste navegador.");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLoading(false);
        onPick?.({ lat: pos.coords.latitude, lon: pos.coords.longitude });
      },
      (err) => {
        setLoading(false);
        alert("Não foi possível obter a localização.");
        console.error(err);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="rounded-full border px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800"
    >
      {loading ? "Obtendo localização…" : "Usar minha localização"}
    </button>
  );
}
