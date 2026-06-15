"use client";

import { useState, useMemo, useEffect } from "react";
import profileData from "@/data/profile.json";
import Image from "next/image";
import liveCalendarData from "@/data/live_calendar.json";


// Import modular subcomponents
import AboutSection from "./portfolio/AboutSection";
import ProjectsSection from "./portfolio/ProjectsSection";
import ExperienceSection from "./portfolio/ExperienceSection";
import StackSection from "./portfolio/StackSection";
import ConnectSection from "./portfolio/ConnectSection";
import ActivitySection from "./portfolio/ActivitySection";
import CpDsaStatsSection from "./portfolio/CpDsaStatsSection";

// Simple LCG pseudo-random generator
const lcg = (seed) => {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
};

const generateCalendarData = () => {
  const data = [];
  const now = new Date();
  
  // Start date = 52 weeks ago from today, aligned to the starting Sunday
  const startDate = new Date();
  startDate.setDate(now.getDate() - 364);
  const startDay = startDate.getDay(); // 0 Sunday, 6 Saturday
  startDate.setDate(startDate.getDate() - startDay); // Shift to Sunday

  const random = lcg(12345); // Set a static seed for consistent but realistic layout
  
  const totalDays = 371; // 53 weeks * 7 days
  for (let i = 0; i < totalDays; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    const isFuture = currentDate > now;
    
    let github = 0;
    let cp = 0;
    let stage = 0;
    let level = 0;

    if (!isFuture) {
      const activityChance = random();
      if (activityChance > 0.45) { // 55% chance of activity on any given day
        const typeChance = random();
        if (typeChance < 0.4) {
          // GitHub only
          github = Math.floor(random() * 5) + 1;
        } else if (typeChance < 0.75) {
          // CP only
          cp = Math.floor(random() * 2) + 1;
        } else {
          // Both GitHub and CP
          github = Math.floor(random() * 4) + 1;
          cp = Math.floor(random() * 2) + 1;
        }
      }

      if (github > 0 && cp > 0) {
        stage = 2; // Both (Dark green)
      } else if (github > 0 || cp > 0) {
        stage = 1; // Either (Light green)
      }

      const totalAct = github + cp;
      if (totalAct >= 10) level = 4;
      else if (totalAct >= 6) level = 3;
      else if (totalAct >= 3) level = 2;
      else if (totalAct >= 1) level = 1;
    }

    data.push({
      date: currentDate,
      github,
      cp,
      cpActivity: cp,
      cpSolved: cp,
      stage,
      level,
      isFuture
    });
  }

  return data;
};

export default function PortfolioView({ onSwitchToChat, initialExpandedProject, activeSection, onSectionChange }) {
  const [expandedProject, setExpandedProject] = useState(
    initialExpandedProject || profileData.projects[0]?.id || null
  );
  const [expandedExperience, setExpandedExperience] = useState(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const hasExperience = profileData.experience && profileData.experience.length > 0;

  // Local intersection observer to sync scroll with navbar active section
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-25% 0px -55% 0px",
      threshold: 0,
    };

    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          onSectionChange?.(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    const targetSections = [
      "about",
      "projects",
      ...(hasExperience ? ["experience"] : []),
      "stack",
      "connect"
    ];

    targetSections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [onSectionChange, hasExperience]);

  // Sync expanded project when requested from the parent (e.g. Chat experience)
  useEffect(() => {
    if (initialExpandedProject) {
      setExpandedProject(initialExpandedProject);
    }
  }, [initialExpandedProject]);

  // Compute contribution calendar data and statistics
  const stats = useMemo(() => {
    let calendarData = [];
    let totals = { commits: 0, cpSolved: 0, cpActivity: 0 };
    let isLive = false;

    try {
      if (liveCalendarData && Array.isArray(liveCalendarData.days) && liveCalendarData.days.length > 0) {
        const todayKolkataStr = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Kolkata" });
        totals = liveCalendarData.totals || { commits: 0, cpSolved: 0, cpActivity: 0 };
        
        calendarData = liveCalendarData.days.map(day => {
          const [y, m, d] = day.date.split("-");
          const dateObj = new Date(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(d, 10));
          const isFuture = day.date > todayKolkataStr;
          
          let stage = 0;
          if (!isFuture) {
            if (day.github > 0 && day.cpActivity > 0) {
              stage = 2;
            } else if (day.github > 0 || day.cpActivity > 0) {
              stage = 1;
            }
          }
          
          return {
            ...day,
            date: dateObj,
            dateStr: day.date,
            isFuture,
            stage,
            cp: day.cpActivity // backward-compatibility for basic count
          };
        });
        isLive = true;
      }
    } catch (e) {
      console.error("Failed to load live calendar data, falling back to mock generator:", e);
    }

    if (calendarData.length === 0) {
      calendarData = generateCalendarData();
      let totalCommits = 0;
      let totalCP = 0;
      calendarData.forEach(day => {
        if (!day.isFuture) {
          totalCommits += day.github;
          totalCP += day.cp;
        }
      });
      totals = {
        commits: totalCommits,
        cpSolved: totalCP,
        cpActivity: totalCP
      };
      isLive = false;
    }

    let activeDays = 0;
    let currentStreak = 0;
    let maxStreak = 0;
    let tempStreak = 0;

    calendarData.forEach((day) => {
      if (day.isFuture) return;
      
      if (day.stage > 0) {
        activeDays++;
        tempStreak++;
        if (tempStreak > maxStreak) {
          maxStreak = tempStreak;
        }
      } else {
        tempStreak = 0;
      }
    });

    // Calculate current streak looking backward from today
    const todayKolkataStr = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Kolkata" });
    const todayIdx = calendarData.findIndex(day => {
      if (day.dateStr) {
        return day.dateStr === todayKolkataStr;
      }
      return day.date.toDateString() === new Date().toDateString();
    });
    
    if (todayIdx !== -1) {
      let idx = todayIdx;
      if (calendarData[idx].stage > 0) {
        while (idx >= 0 && calendarData[idx].stage > 0) {
          currentStreak++;
          idx--;
        }
      } else {
        idx = todayIdx - 1;
        while (idx >= 0 && calendarData[idx].stage > 0) {
          currentStreak++;
          idx--;
        }
      }
    }

    // Group into 53 weeks
    const weeks = [];
    for (let i = 0; i < 53; i++) {
      weeks.push(calendarData.slice(i * 7, (i + 1) * 7));
    }

    // Determine month labels horizontal placement
    const monthLabels = [];
    let lastMonth = -1;
    weeks.forEach((week, wIdx) => {
      const firstDay = week[0].date;
      const currentMonth = firstDay.getMonth();
      if (currentMonth !== lastMonth) {
        monthLabels.push({
          label: firstDay.toLocaleDateString(undefined, { month: 'short' }),
          index: wIdx
        });
        lastMonth = currentMonth;
      }
    });

    return {
      weeks,
      monthLabels,
      totalCommits: totals.commits,
      totalCP: totals.cpSolved,
      activeDays,
      currentStreak,
      maxStreak,
      isLive
    };
  }, []);

  // Accordion Toggles (Preserving user's logic)
  const toggleProject = (id) => {
    if (expandedProject === id) {
      setExpandedProject(null);
    } else {
      setExpandedProject(id);
    }
  };

  const toggleExperience = (id) => {
    if (expandedExperience === id) {
      setExpandedExperience(null);
    } else {
      setExpandedExperience(id);
    }
  };

  // Clipboard Copier (Preserving user's logic)
  const handleCopyEmail = () => {
    navigator.clipboard.writeText(profileData.personal.email);
    setCopiedEmail(true);
    setTimeout(() => {
      setCopiedEmail(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col">
      {/* Intro Section - Bounded & Boxy */}
      <AboutSection />

      {/* Projects Section */}
      <div className="bg-stripes" />
      <ProjectsSection 
        expandedProject={expandedProject} 
        toggleProject={toggleProject} 
      />

      {/* Experience Section */}
      {hasExperience && (
        <>
          <div className="bg-stripes" />
          <ExperienceSection 
            expandedExperience={expandedExperience} 
            toggleExperience={toggleExperience} 
          />
        </>
      )}

      {/* Stack Section */}
      <div className="bg-stripes" />
      <StackSection />

      {/* Connect Section */}
      <div className="bg-stripes" />
      <ConnectSection 
        copiedEmail={copiedEmail} 
        handleCopyEmail={handleCopyEmail} 
      />

      {/* Dev Activity / Contribution Calendar Section */}
      <div className="bg-stripes" />
      <ActivitySection stats={stats} />

      {/* Achievements Section */}
      <div className="bg-stripes" />
      <CpDsaStatsSection />
      <div className="bg-stripes" />

      {/* Button helper to go back to Chat Mode */}
      <div className="flex justify-center p-6 border-t border-dark-border bg-[#040405]">
        <button
          onClick={onSwitchToChat}
          className="text-xs text-zinc-400 hover:text-zinc-200 bg-zinc-950 border border-dark-border px-4 py-2 rounded-full transition-colors cursor-pointer"
        >
          &larr; Switch to Assistant Chat
        </button>
      </div>
    </div>
  );
}
