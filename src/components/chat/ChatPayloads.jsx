import profileData from "@/data/profile.json";
import liveCalendarData from "@/data/live_calendar.json";
import { 
  LuMail, 
  LuGithub, 
  LuLinkedin, 
  LuCopy, 
  LuCheck 
} from "react-icons/lu";

const activityTotals = liveCalendarData?.totals || {};
const formatCount = (value, fallback = 0) => Number(value || fallback).toLocaleString();

export default function ChatPayloads({ 
  action, 
  onNavigateToSection, 
  copiedEmail, 
  handleCopyEmail, 
  suggestedPrompts, 
  handleSend 
}) {
  switch (action) {
    case "RENDER_PROJECTS":
      return (
        <div className="mt-3 grid gap-2">
          {profileData.projects.map((proj) => (
            <div 
              key={proj.id} 
              className="p-3 border border-dark-border bg-black hover:border-brand-cyan/40 transition-colors"
            >
              <div className="flex justify-between items-start">
                <h4 className="text-xs font-semibold text-zinc-100">{proj.title}</h4>
                <span className="text-[11px] text-zinc-550 font-mono">{proj.year}</span>
              </div>
              <p className="text-[12px] text-zinc-400 mt-1">{proj.description}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {proj.tech.slice(0, 3).map((t) => (
                  <span key={t} className="text-[10px] bg-[#0c0c0e] border border-dark-border text-zinc-500 px-1.5 py-0.5 font-mono">
                    {t}
                  </span>
                ))}
              </div>
              <button 
                onClick={() => onNavigateToSection("projects")}
                className="text-[11px] text-brand-cyan hover:underline mt-2.5 flex items-center gap-1 cursor-pointer font-mono"
              >
                View Details &rarr;
              </button>
            </div>
          ))}
        </div>
      );

    case "RENDER_STACK":
      return (
        <div className="mt-3 grid grid-cols-2 gap-1.5">
          {profileData.stack.slice(0, 8).map((tech) => (
            <div 
              key={tech.name} 
              className="flex items-center gap-2 p-2 border border-dark-border bg-black"
            >
              <span className="w-1.5 h-1.5" style={{ backgroundColor: tech.color }} />
              <span className="text-[12px] text-zinc-300 font-medium">{tech.name}</span>
              <span className="text-[10px] text-zinc-550 ml-auto font-mono">{tech.category}</span>
            </div>
          ))}
          <div className="col-span-2 text-center mt-1">
            <button 
              onClick={() => onNavigateToSection("stack")}
              className="text-[11px] text-brand-violet hover:underline cursor-pointer font-mono"
            >
              View all skills &rarr;
            </button>
          </div>
        </div>
      );

    case "RENDER_ACTIVITY":
      return (
        <div className="mt-3 p-3 border border-dark-border bg-black space-y-3">
          <h4 className="text-xs font-semibold text-zinc-150 border-b border-dark-border/40 pb-1.5 font-mono uppercase tracking-wider">
            Activity Calendar Summary
          </h4>
          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
            <div className="border border-dark-border bg-zinc-950 p-2 text-center">
              <span className="text-zinc-500 block">GitHub Commits</span>
              <span className="text-emerald-400 font-semibold text-xs mt-0.5 block">
                {formatCount(activityTotals.commits)}
              </span>
            </div>
            <div className="border border-dark-border bg-zinc-950 p-2 text-center">
              <span className="text-zinc-500 block">CP / DSA Solved</span>
              <span className="text-emerald-400 font-semibold text-xs mt-0.5 block">
                {formatCount(activityTotals.cpSolved)}
              </span>
            </div>
          </div>
          <button 
            onClick={() => onNavigateToSection("activity")}
            className="w-full text-center py-2 bg-[#0c0c0e] hover:bg-zinc-950 text-[11px] text-brand-cyan hover:underline cursor-pointer border border-dark-border font-mono transition-all"
          >
            Open Activity Calendar &rarr;
          </button>
        </div>
      );

    case "RENDER_CONTACT":
      return (
        <div className="mt-3 space-y-2">
          {/* Copy Email Button */}
          <div className="flex items-center gap-2 p-2 border border-dark-border bg-black justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
              <LuMail className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
              <span className="text-xs text-zinc-300 truncate select-all">{profileData.personal.email}</span>
            </div>
            <button 
              onClick={handleCopyEmail}
              className="text-zinc-500 hover:text-white p-1 transition-colors cursor-pointer"
              title="Copy email"
            >
              {copiedEmail ? <LuCheck className="w-3.5 h-3.5 text-green-400" /> : <LuCopy className="w-3.5 h-3.5" />}
            </button>
          </div>
          
          {/* Social link row */}
          <div className="flex gap-2 justify-center">
            <a 
              href={profileData.personal.socials.github} 
              target="_blank" 
              className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-dark-border bg-black hover:bg-zinc-950 text-[12px] text-zinc-400 hover:text-white transition-colors font-mono"
            >
              <LuGithub className="w-3 h-3" /> GitHub
            </a>
            <a 
              href={profileData.personal.socials.linkedin} 
              target="_blank" 
              className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-dark-border bg-black hover:bg-zinc-950 text-[12px] text-zinc-400 hover:text-white transition-colors font-mono"
            >
              <LuLinkedin className="w-3 h-3" /> LinkedIn
            </a>
          </div>
        </div>
      );

    case "RENDER_FALLBACK":
      return (
        <div className="mt-3 space-y-3">
          {/* Direct Email copy */}
          <div className="p-3 border border-dark-border bg-zinc-950/80">
            <p className="text-[12px] text-zinc-400">
              You can copy the email to write a message directly:
            </p>
            <div className="flex items-center justify-between gap-2 mt-2 p-1.5 bg-black border border-dark-border">
              <span className="text-[12px] text-zinc-300 font-mono truncate">{profileData.personal.email}</span>
              <button 
                onClick={handleCopyEmail}
                className="text-zinc-500 hover:text-white p-1 shrink-0 transition-colors cursor-pointer"
              >
                {copiedEmail ? <LuCheck className="w-3.5 h-3.5 text-green-400" /> : <LuCopy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Prompt suggestions grid */}
          <div>
            <p className="text-[11px] text-zinc-500 font-semibold mb-1.5 uppercase tracking-wide font-mono">Suggested prompts:</p>
            <div className="grid grid-cols-1 gap-1">
              {suggestedPrompts.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(chip.query)}
                  className="text-left text-[12px] text-zinc-400 hover:text-brand-cyan hover:border-brand-cyan/30 px-3 py-2 border border-dark-border bg-black transition-all cursor-pointer font-mono"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
}
