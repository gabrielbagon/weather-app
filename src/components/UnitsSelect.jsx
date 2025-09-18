"use client";
export default function UnitsSelect({ value, onChange }) {
  // value = { temperature: "celsius"|"fahrenheit", windspeed: "kmh"|"mph"|"ms"|"kn", precipitation:"mm"|"inch" }
  return (
    <fieldset className="flex flex-wrap gap-2 items-center text-sm">
      <legend className="sr-only">Unidades</legend>
      <select
        aria-label="Temperatura"
        value={value.temperature}
        onChange={(e)=>onChange({ ...value, temperature: e.target.value })}
        className="rounded-full border px-3 py-1"
      >
        <option value="celsius">°C</option>
        <option value="fahrenheit">°F</option>
      </select>
      <select
        aria-label="Vento"
        value={value.windspeed}
        onChange={(e)=>onChange({ ...value, windspeed: e.target.value })}
        className="rounded-full border px-3 py-1"
      >
        <option value="kmh">km/h</option>
        <option value="mph">mph</option>
        <option value="ms">m/s</option>
        <option value="kn">kn</option>
      </select>
      <select
        aria-label="Precipitação"
        value={value.precipitation}
        onChange={(e)=>onChange({ ...value, precipitation: e.target.value })}
        className="rounded-full border px-3 py-1"
      >
        <option value="mm">mm</option>
        <option value="inch">inch</option>
      </select>
    </fieldset>
  );
}
