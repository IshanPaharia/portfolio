"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { LuMenu, LuX } from "react-icons/lu";
import ChatExperience from "@/components/ChatExperience";
import PortfolioView from "@/components/PortfolioView";
import profileData from "@/data/profile.json";
import logoImg from "../../public/logo.png";

// Central pill navigation items (matches saddine.com layout exactly)
const navItems = [
  { label: "About", id: "about" },
  { label: "Projects", id: "projects" },
  { label: "Experience", id: "experience" },
  { label: "Stack", id: "stack" },
  { label: "Connect", id: "connect" }
];

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);
  
  // Mode can be either 'chat' or 'portfolio'
  // Defaults to 'chat' for every fresh load.
  const [mode, setMode] = useState("chat");
  const [activeSection, setActiveSection] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pendingScrollTarget, setPendingScrollTarget] = useState("");
  const portfolioRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setMobileMenuOpen(false);
  };

  // Scroll and Navigate Bindings:
  // Clicking nav links transitions views and scrolls.
  const handleNavClick = (sectionId) => {
    setMode("portfolio");
    setActiveSection(sectionId);
    setPendingScrollTarget(sectionId);
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    if (mode !== "portfolio" || !pendingScrollTarget) return;

    const timer = setTimeout(() => {
      const element = document.getElementById(pendingScrollTarget);
      if (!element) return;
      element.scrollIntoView({ behavior: "smooth" });
      setPendingScrollTarget("");
    }, 350);

    return () => clearTimeout(timer);
  }, [mode, pendingScrollTarget]);

  // Setup intersection observer to highlight active navigation link based on scroll position
  useEffect(() => {
    if (mode !== "portfolio") return;

    const observerOptions = {
      root: null,
      rootMargin: "-25% 0px -55% 0px",
      threshold: 0,
    };

    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    navItems.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [mode]);

  const isChat = mode === "chat";

  return (
    <div className={`relative bg-[#020203] flex justify-center selection:bg-brand-cyan/20 selection:text-brand-cyan ${isChat ? "h-screen overflow-hidden" : "min-h-screen"}`}>
      {/* Intro load animation overlay */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            key="intro-overlay"
            className="fixed inset-0 bg-[#020203] z-[9999] flex items-center justify-center overflow-hidden"
            exit={{ y: "-100%" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.6, 0.01, -0.05, 0.95] }}
              className="text-5xl md:text-7xl font-mono font-semibold text-zinc-100 tracking-tight"
            >
              Hi.
            </motion.h1>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background matrix dot overlay */}
      <div className="fixed inset-0 bg-dot-matrix pointer-events-none z-0" />
      
      {/* Ambient background glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] bg-gradient-to-b from-brand-violet/5 via-transparent to-transparent blur-[120px] pointer-events-none z-0" />

      {/* Central Boxed Console */}
      <div className={`relative z-10 w-full max-w-4xl border-l border-r border-dark-border bg-black flex flex-col justify-between shadow-[0_0_60px_rgba(0,0,0,0.9)] ${isChat ? "h-screen overflow-hidden" : "min-h-screen"}`}>
        
        {/* Header matching saddine.com layout (Logo left, pill center, switcher right) */}
        <header className="sticky top-0 z-50 w-full flex flex-col bg-black/60 backdrop-blur-md border-b border-dark-border shrink-0">
          <div className="w-full flex items-center justify-between px-6 py-4">
            {/* Logo (Nine-Tailed Fox emblem SVG) */}
            <button 
              onClick={() => handleModeChange("chat")}
              className="flex items-center justify-center text-zinc-100 hover:text-white transition-colors cursor-pointer group shrink-0"
              title="Switch to Chat Assistant"
            >
              <Image className="w-[6vh] h-[6vh]" src={logoImg} alt="logo" priority />
            </button>

            {/* Centered Pill Navigation Container (Section links) - Hidden on Mobile */}
            <div className="hidden md:flex bg-[#0c0c0e]/80 p-1 rounded-full border border-dark-border/85 shadow-inner">
              {navItems.map((item) => {
                const isActive = mode === "portfolio" && activeSection === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`text-[11px] font-sans transition-all duration-200 px-3.5 py-1.5 rounded-full cursor-pointer ${
                      isActive
                        ? "bg-[#18181b] text-white font-semibold shadow-sm"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            {/* Right Side: Switcher + Mobile Hamburger Menu */}
            <div className="flex items-center gap-2.5 shrink-0">
              <div className="flex bg-[#0c0c0e] p-0.5 rounded-full border border-dark-border shrink-0">
                <button
                  onClick={() => handleModeChange("chat")}
                  className={`text-[10px] font-sans font-medium px-2.5 py-1 rounded-full transition-all duration-300 cursor-pointer ${
                    mode === "chat"
                      ? "bg-[#18181b] text-brand-cyan font-semibold"
                      : "text-zinc-500 hover:text-zinc-350"
                  }`}
                >
                  Chat
                </button>
                <button
                  onClick={() => handleModeChange("portfolio")}
                  className={`text-[10px] font-sans font-medium px-2.5 py-1 rounded-full transition-all duration-300 cursor-pointer ${
                    mode === "portfolio"
                      ? "bg-[#18181b] text-white font-semibold"
                      : "text-zinc-500 hover:text-zinc-355"
                  }`}
                >
                  Portfolio
                </button>
              </div>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-zinc-400 hover:text-zinc-200 border border-dark-border bg-[#0c0c0e] rounded-full transition-colors cursor-pointer active:scale-95"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <LuX className="w-4 h-4" /> : <LuMenu className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Mobile Dropdown Nav Items */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="md:hidden border-t border-dark-border/60 bg-[#070708]/95 backdrop-blur-md px-6 py-4 flex flex-col gap-2.5 overflow-hidden"
              >
                {navItems.map((item) => {
                  const isActive = mode === "portfolio" && activeSection === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        handleNavClick(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`text-left text-xs font-mono py-2.5 px-4 rounded border transition-all duration-200 cursor-pointer ${
                        isActive
                          ? "bg-[#18181b] border-dark-border text-white font-semibold"
                          : "border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        {/* Main Content switcher panel (Flex layout that constraints height when isChat is true) */}
        <main className={`flex-1 w-full flex flex-col ${isChat ? "overflow-hidden" : ""}`}>
          <AnimatePresence mode="wait">
            {mode === "chat" ? (
              <motion.div
                key="chat"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex-1 flex flex-col overflow-hidden"
              >
                <ChatExperience 
                  onSwitchToPortfolio={() => handleModeChange("portfolio")} 
                  onNavigateToSection={handleNavClick}
                />
              </motion.div>
            ) : (
              <motion.div
                key="portfolio"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                ref={portfolioRef}
                className="flex-grow flex flex-col"
              >
                <PortfolioView 
                  onSwitchToChat={() => handleModeChange("chat")} 
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
