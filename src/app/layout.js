import { Geist, Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata = {
  title: "Ishan Paharia | Full-Stack Developer",
  description: "Personal portfolio of Ishan Paharia, a Computer Science student at LNMIIT Jaipur specializing in backend systems design, WebSocket infrastructure, caching architectures, and real-time full-stack applications.",
  keywords: ["Ishan Paharia", "Full-Stack Developer", "Systems Design", "Software Engineer Portfolio", "LNMIIT", "LNMIIT Jaipur", "Competitive Programming"],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full bg-black text-zinc-100 font-sans selection:bg-brand-cyan/20 selection:text-brand-cyan"
        suppressHydrationWarning
      >
        {/* Ambient background glow */}
        <div className="fixed inset-0 bg-dot-matrix pointer-events-none z-0" />
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] bg-gradient-to-b from-brand-violet/5 via-transparent to-transparent blur-[120px] pointer-events-none z-0" />
        
        {/* Main Content */}
        <div className="relative z-10 flex min-h-screen flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
