import "./globals.css";
import { DM_Sans } from "next/font/google";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-dm-sans",   // <- cria a CSS var
  display: "swap",
});

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      {/* note a ordem: variável + font-sans do Tailwind */}
      <body className={`${dmSans.variable} font-sans min-h-dvh bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100`}>
        {children}
      </body>
    </html>
  );
}
