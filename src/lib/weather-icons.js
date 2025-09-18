export function iconFromWMO(code) {
  // mapa mínimo dos códigos WMO -> emoji/SVG simples
  if (code === 0) return "☀️";
  if ([1,2,3].includes(code)) return "⛅";
  if ([45,48].includes(code)) return "🌫️";
  if ([51,53,55,56,57].includes(code)) return "🌦️";
  if ([61,63,65,66,67,80,81,82].includes(code)) return "🌧️";
  if ([71,73,75,77,85,86].includes(code)) return "❄️";
  if ([95,96,99].includes(code)) return "⛈️";
  return "🌡️";
}

export function formatHourLocal(iso, tz = undefined) {
  if (!iso) return "--:--";
  const d = tz ? new Date(new Date(iso).toLocaleString("en-US", { timeZone: tz })) : new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function formatDayShort(iso, locale = "pt-BR") {
  const d = new Date(iso);
  return d.toLocaleDateString(locale, { weekday: "short", day: "2-digit" });
}
// src/lib/weather-icons.js
export function conditionFromWMO(code) {
  if (code === 0) return "clear";                         // céu limpo
  if (code === 1) return "partly";                        // pouco nublado
  if (code === 2 || code === 3) return "clouds";          // nublado
  if (code === 45 || code === 48) return "fog";           // nevoeiro
  if ((code >= 51 && code <= 57) || (code >= 61 && code <= 67) || (code >= 80 && code <= 82))
    return "rain";                                         // garoa/chuva
  if ((code >= 71 && code <= 77) || code === 85 || code === 86)
    return "snow";                                         // neve
  if (code === 95 || code === 96 || code === 99)
    return "thunder";                                      // tempestade
  return "clouds";
}
