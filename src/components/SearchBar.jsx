// app/components/SearchBar.jsx
"use client";
import { useState } from "react";

export default function SearchBar({
  onSearch = (q) => console.log("Searching:", q),
  placeholder = "Buscar...",
  defaultValue = "",
  buttonText = "Buscar",
  className = "",
}) {
  const [query, setQuery] = useState(defaultValue);

  function handleSubmit(e) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    onSearch(q);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex self-center  gap-2 w-full max-w-xl ${className}`}
      role="search"
      aria-label="Search input"
    >
      <div className="relative flex-1">
        <label htmlFor="search-input" className="sr-only">
          Buscar
        </label>

        {/* Ícone de lupa */}
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"
        >
          <path
            fill="currentColor"
            d="M15.5 14h-.79l-.28-.27a6.471 6.471 0 0 0 1.57-4.23 6.5 6.5 0 1 0-6.5 6.5c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0s.41-1.08 0-1.49L15.5 14Zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14Z"
          />
        </svg>

        {/* Input */}
        <input
          id="search-input"
          name="q"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-full border border-slate-300 bg-white pl-10 pr-4 py-2
                     text-slate-900 placeholder-slate-400
                     shadow-sm
                     focus-visible:outline-none focus-visible:ring-2 focus-visible: white
                     dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700 dark:placeholder-slate-500"
        />
      </div>

      {/* Botão ao lado */}
      <button
        type="submit"
        disabled={!query.trim()}
        className="rounded-full px-4 py-2 font-medium
                   bg-indigo-500 text-white shadow-sm
                   hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        aria-label="Executar busca"
      >
        {buttonText}
      </button>
    </form>
  );
}
