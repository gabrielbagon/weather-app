// src/components/DropdownMenu.jsx
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function DropdownMenu() {
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  const menuRef = useRef(null);

  // Fechar clicando fora
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        open &&
        !menuRef.current?.contains(e.target) &&
        !btnRef.current?.contains(e.target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Fechar com Esc
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Foco inicial + navegação por setas no menu
  useEffect(() => {
    if (!open) return;
    const items = menuRef.current?.querySelectorAll("[data-menuitem]");
    items?.[0]?.focus();

    function onArrows(e) {
      const arr = Array.from(items || []);
      const i = arr.indexOf(document.activeElement);
      if (e.key === "ArrowDown") {
        e.preventDefault();
        arr[(i + 1) % arr.length]?.focus();
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        arr[(i - 1 + arr.length) % arr.length]?.focus();
      }
    }
    menuRef.current?.addEventListener("keydown", onArrows);
    return () => menuRef.current?.removeEventListener("keydown", onArrows);
  }, [open]);

  return (
    <div className="relative inline-block text-left">
      <button
        ref={btnRef}
        type="button"
        className="p-2 rounded-md bg-gray-200 dark:bg-gray-700"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls="main-menu"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        &#9776;
      </button>

      {/* Dropdown */}
      <div
        ref={menuRef}
        id="main-menu"
        role="menu"
        className={`absolute right-0 mt-2 w-48 rounded-md border border-gray-200 dark:border-gray-700 
                    bg-white dark:bg-gray-800 shadow-lg 
                    ${open ? "block" : "hidden"}`}
      >
        <Link
          href="/weather"
          role="menuitem"
          data-menuitem
          className="block px-4 py-2 text-gray-800 dark:text-gray-200 
                     hover:bg-gray-100 dark:hover:bg-gray-700 
                     focus:bg-gray-100 dark:focus:bg-gray-700 outline-none"
          onClick={() => setOpen(false)}
        >
          Home
        </Link>
        <Link
          href="/about"
          role="menuitem"
          data-menuitem
          className="block px-4 py-2 text-gray-800 dark:text-gray-200 
                     hover:bg-gray-100 dark:hover:bg-gray-700 
                     focus:bg-gray-100 dark:focus:bg-gray-700 outline-none"
          onClick={() => setOpen(false)}
        >
          About
        </Link>
        <Link
          href="/contact"
          role="menuitem"
          data-menuitem
          className="block px-4 py-2 text-gray-800 dark:text-gray-200 
                     hover:bg-gray-100 dark:hover:bg-gray-700 
                     focus:bg-gray-100 dark:focus:bg-gray-700 outline-none"
          onClick={() => setOpen(false)}
        >
          Contact
        </Link>
      </div>
    </div>
  );
}
