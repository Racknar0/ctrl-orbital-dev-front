import localFont from "next/font/local";
import "@/styles/globals.scss";

const satoshi = localFont({
  src: [
    { path: "../assets/fonts/satoshi/Satoshi-Variable.woff2", weight: "300 900", style: "normal" },
    { path: "../assets/fonts/satoshi/Satoshi-VariableItalic.woff2", weight: "300 900", style: "italic" },
  ],
  variable: "--font-satoshi",
  display: "swap",
  fallback: ["Arial", "sans-serif"],
});

export const metadata = {
  title: "Orbital Ctrl — Finanzas Compartidas | by Orbital Dev",
  description: "Control de gastos personales y compartidos. Organiza tus finanzas, coordina equipos y divide cuentas con Orbital Ctrl.",
  icons: { icon: "/equa-logo.png", apple: "/equa-logo.png" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={satoshi.variable} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
