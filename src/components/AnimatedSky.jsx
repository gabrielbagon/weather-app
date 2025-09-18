// src/components/AnimatedSky.jsx
"use client";
import { useMemo } from "react";

export default function AnimatedSky({ condition = "clear", timeOfDay = "day" }) {
  // Gradiente de fundo por condição + período do dia
  const bg = useMemo(() => {
    const day = {
      clear:   "linear-gradient(180deg,#7ec8ff 0%,#cbe9ff 60%,#ffffff 100%)",
      partly:  "linear-gradient(180deg,#8fc1ee 0%,#cfe3f8 60%,#ffffff 100%)",
      clouds:  "linear-gradient(180deg,#9fb6cc 0%,#c4d4e1 60%,#e9eef3 100%)",
      rain:    "linear-gradient(180deg,#5e7a94 0%,#6f8aa3 50%,#a9b7c5 100%)",
      snow:    "linear-gradient(180deg,#cfe8ff 0%,#eaf6ff 70%,#ffffff 100%)",
      fog:     "linear-gradient(180deg,#bdc6cf 0%,#d5dde5 70%,#eef2f6 100%)",
      thunder: "linear-gradient(180deg,#1a2330 0%,#242f40 60%,#2e3a4f 100%)",
    };
    const night = {
      clear:   "linear-gradient(180deg,#0b1020 0%,#151b33 60%,#1b213d 100%)",
      partly:  "linear-gradient(180deg,#0f1426 0%,#1a2238 60%,#232d4a 100%)",
      clouds:  "linear-gradient(180deg,#1a2230 0%,#222d3e 60%,#2b3750 100%)",
      rain:    "linear-gradient(180deg,#17212c 0%,#1f2a38 60%,#2a3748 100%)",
      snow:    "linear-gradient(180deg,#152033 0%,#20304a 60%,#2b3d5d 100%)",
      fog:     "linear-gradient(180deg,#1b2431 0%,#242f3f 60%,#2e3a4d 100%)",
      thunder: "linear-gradient(180deg,#0c121b 0%,#141c28 60%,#1d2737 100%)",
    };
    return (timeOfDay === "night" ? night : day)[condition] || day.clear;
  }, [condition, timeOfDay]);

  // elementos “randômicos” determinísticos por condição (quantidades pequenas por performance)
  const drops = Array.from({ length: condition === "rain" ? 24 : 0 });
  const flakes = Array.from({ length: condition === "snow" ? 20 : 0 });
  const stars = Array.from({ length: timeOfDay === "night" ? 30 : 0 });
  const clouds = Array.from({ length: ["partly","clouds","rain","thunder","fog","snow"].includes(condition) ? 3 : 0 });

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ background: bg }}
    >
      {/* Sol (dia limpo ou parcialmente nublado) */}
      {(timeOfDay === "day" && (condition === "clear" || condition === "partly")) && (
        <div className="absolute right-6 top-6 h-16 w-16 rounded-full bg-yellow-300/90 shadow-[0_0_60px_10px_rgba(255,204,0,.5)] animate-[sun-spin_60s_linear_infinite]" />
      )}

      {/* Estrelas (noite) */}
      {stars.map((_, i) => (
        <span
          key={`star-${i}`}
          className="absolute h-[2px] w-[2px] rounded-full bg-white animate-[star-twinkle_3s_ease-in-out_infinite]"
          style={{
            top: `${(i * 37) % 95}%`,
            left: `${(i * 53) % 95}%`,
            opacity: 0.9,
            animationDelay: `${(i % 10) * 0.2}s`,
          }}
        />
      ))}

      {/* Nuvens */}
      {clouds.map((_, i) => (
        <div
          key={`cloud-${i}`}
          className="absolute -top-4 left-[-25%] h-12 w-32 rounded-full bg-white/85 dark:bg-white/60 shadow-sm animate-[cloud-move_45s_linear_infinite]"
          style={{ top: `${8 + i * 18}%`, animationDelay: `${i * 6}s` }}
        >
          <div className="absolute -top-3 left-3 h-8 w-10 rounded-full bg-white/85 dark:bg-white/60" />
          <div className="absolute -top-5 left-10 h-12 w-12 rounded-full bg-white/85 dark:bg-white/60" />
        </div>
      ))}

      {/* Chuva */}
      {drops.map((_, i) => (
        <span
          key={`drop-${i}`}
          className="absolute top-0 h-10 w-px bg-white/70 animate-[rain-fall_1.2s_linear_infinite]"
          style={{
            left: `${(i * 97) % 100}%`,
            animationDelay: `${(i % 12) * 0.1}s`,
            opacity: 0.7,
          }}
        />
      ))}

      {/* Neve */}
      {flakes.map((_, i) => (
        <span
          key={`flake-${i}`}
          className="absolute top-0 h-2 w-2 rounded-full bg-white animate-[snow-fall_6s_linear_infinite]"
          style={{
            left: `${(i * 83) % 100}%`,
            animationDelay: `${(i % 10) * 0.4}s`,
            opacity: 0.9,
          }}
        />
      ))}

      {/* Névoa */}
      {condition === "fog" && (
        <>
          <div className="absolute inset-x-0 top-10 h-10 bg-white/30 blur-md animate-[fog-drift_10s_ease-in-out_infinite]" />
          <div className="absolute inset-x-0 top-24 h-10 bg-white/25 blur-md animate-[fog-drift_12s_ease-in-out_infinite]" style={{ animationDelay: "1s" }} />
        </>
      )}

      {/* Relâmpagos */}
      {condition === "thunder" && (
        <div className="absolute inset-0 bg-white/90 mix-blend-overlay animate-[lightning-flash_6s_steps(1,_end)_infinite]" />
      )}
    </div>
  );
}
