"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import ChatExperience from "@/components/ChatExperience";
import PortfolioView from "@/components/PortfolioView";
import profileData from "@/data/profile.json";
import logoImg from "../../public/logo.png";

export default function Home() {
  // Mode can be either 'chat' or 'portfolio'
  // Defaults to 'chat' for every fresh load.
  const [mode, setMode] = useState("chat");
  const [activeSection, setActiveSection] = useState("");
  const portfolioRef = useRef(null);

  // Central pill navigation items (matches saddine.com layout exactly)
  const navItems = [
    { label: "About", id: "about" },
    { label: "Projects", id: "projects" },
    { label: "Experience", id: "experience" },
    { label: "Stack", id: "stack" },
    { label: "Interests", id: "interests" }
  ];

  const handleModeChange = (newMode) => {
    setMode(newMode);
  };

  // Scroll and Navigate Bindings:
  // Clicking nav links transitions views and scrolls.
  const handleNavClick = (sectionId) => {
    setMode("portfolio");
    setActiveSection(sectionId);
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 120);
  };

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
      {/* Background matrix dot overlay */}
      <div className="fixed inset-0 bg-dot-matrix pointer-events-none z-0" />
      
      {/* Ambient background glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] bg-gradient-to-b from-brand-violet/5 via-transparent to-transparent blur-[120px] pointer-events-none z-0" />

      {/* Central Boxed Console */}
      <div className={`relative z-10 w-full max-w-3xl border-l border-r border-dark-border bg-black flex flex-col justify-between shadow-[0_0_60px_rgba(0,0,0,0.9)] ${isChat ? "h-screen overflow-hidden" : "min-h-screen"}`}>
        
        {/* Header matching saddine.com layout (Logo left, pill center, switcher right) */}
        <header className="sticky top-0 z-50 w-full flex items-center justify-between px-6 py-4 bg-black/60 backdrop-blur-md border-b border-dark-border shrink-0">
          
          {/* Logo (Nine-Tailed Fox emblem SVG) */}
          <button 
            onClick={() => handleModeChange("chat")}
            className="flex items-center justify-center text-zinc-100 hover:text-white transition-colors cursor-pointer group shrink-0"
            title="Switch to Chat Assistant"
          >
            <Image className="w-[6vh] h-[6vh]" src={logoImg} alt="logo" priority />
          </button>

          {/* Centered Pill Navigation Container (Section links) */}
          <div className="flex bg-[#0c0c0e]/80 p-1 rounded-full border border-dark-border/85 shadow-inner">
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

          {/* Mode Switcher Pill on the right */}
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

        {/* Console bounded footer */}
        <footer className="w-full text-center py-6 text-zinc-655 text-[10px] border-t border-dark-border bg-[#040405] z-10 shrink-0">
          <p>{new Date().getFullYear()} {profileData.personal.name}</p>
        </footer>
      </div>
    </div>
  );
}
