"use client";

import { useState } from "react";
import Image from "next/image";
import profileData from "@/data/profile.json";
import logoImg from "../../public/logo.png";
import { 
  LuExternalLink, 
  LuChevronDown, 
  LuChevronUp, 
  LuCopy, 
  LuCheck, 
  LuArrowUpRight 
} from "react-icons/lu";

import { 
  SiReact, 
  SiNextdotjs, 
  SiJavascript, 
  SiHtml5, 
  SiCss, 
  SiTailwindcss, 
  SiNodedotjs, 
  SiVite, 
  SiPostgresql, 
  SiFigma, 
  SiGit, 
  SiPostman 
} from "react-icons/si";

const iconComponents = {
  SiReact: SiReact,
  SiNextdotjs: SiNextdotjs,
  SiJavascript: SiJavascript,
  SiHtml5: SiHtml5,
  SiCss: SiCss,
  SiTailwindcss: SiTailwindcss,
  SiNodedotjs: SiNodedotjs,
  SiVite: SiVite,
  SiPostgresql: SiPostgresql,
  SiFigma: SiFigma,
  SiGit: SiGit,
  SiPostman: SiPostman
};

export default function PortfolioView({ onSwitchToChat }) {
  const [expandedProject, setExpandedProject] = useState(null);
  const [expandedExperience, setExpandedExperience] = useState(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

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
      <section className="flex items-center justify-center h-[15vh]">
        <Image className="w-[15vh] h-[15vh]" src={logoImg} alt="logo" priority />

      </section>
      {/* Intro Section - Bounded & Boxy */}
      <section id="about" className="scroll-mt-20">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border border-dark-border bg-[#08080a] p-5">
          {/* Rounded Square avatar in a sharp border box */}
          <div className="relative shrink-0">
            <Image 
              src={profileData.personal.avatar} 
              alt={profileData.personal.name} 
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border border-dark-border"
              width={112}
              height={112}
              priority
            />
            <div className="absolute -bottom-1.5 -right-1.5 bg-emerald-500 text-black p-0.5 rounded-full border border-black shadow">
              <span className="block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          </div>

          <div className="text-center sm:text-left space-y-2.5">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="text-[10px] text-brand-cyan uppercase font-bold tracking-widest font-mono">
                {profileData.personal.role}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-medium tracking-tight text-white flex items-center justify-center sm:justify-start gap-1.5">
              {profileData.personal.name}
            </h1>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-lg">
              {profileData.personal.headline}
            </p>
            <span className="text-[9px] bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 px-2 py-0.5 rounded font-mono">
                {profileData.personal.status}
              </span>
          </div>
        </div>

        {/* Bio Paragraphs */}
        <h2 className="text-2xl font-mono font-bold text-zinc-500 uppercase tracking-widest border-y border-dark-border py-3 pl-4 bg-[#08080a]/30">
          About
        </h2>

        <div className="text-xs text-zinc-400 space-y-3.5 leading-relaxed py-6 sm:py-8 px-6 sm:px-8">
          {profileData.about.map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}
        </div>
      </section>

      {/* Stripes Section Spacer */}
      <div className="bg-stripes" />

      {/* Projects Section */}
      <section id="projects" className="scroll-mt-20">
        <h2 className="text-2xl font-mono font-bold text-zinc-500 uppercase tracking-widest border-y border-dark-border py-3 pl-4 bg-[#08080a]/30">
          Projects
        </h2>
        
        <div className="border-y border-dark-border border-x-0 bg-[#08080a] divide-y divide-dark-border my-6">
          {profileData.projects.map((proj) => {
            const isExpanded = expandedProject === proj.id;
            return (
              <div key={proj.id} className="transition-all duration-300">
                {/* Header item */}
                <button
                  onClick={() => toggleProject(proj.id)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-zinc-950 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    {/* Square emblem with sharp borders */}
                    <div className="w-8 h-8 border border-dark-border bg-black flex items-center justify-center font-mono font-bold text-xs text-zinc-500 group-hover:text-brand-cyan group-hover:border-brand-cyan/40 transition-all shrink-0">
                      {proj.title.slice(0, 2)}
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold text-zinc-200 group-hover:text-white transition-colors">
                        {proj.title}
                      </h3>
                      <span className="text-[10px] text-zinc-600 font-mono mt-0.5 block">{proj.year}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-zinc-500">
                    <a
                      href={proj.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-1 border border-transparent hover:border-dark-border hover:bg-black hover:text-white transition-all shrink-0"
                      title="Open external website"
                    >
                      <LuExternalLink className="w-3.5 h-3.5" />
                    </a>
                    {isExpanded ? (
                      <LuChevronUp className="w-3.5 h-3.5 text-zinc-400" />
                    ) : (
                      <LuChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                    )}
                  </div>
                </button>

                {/* Collapsible details */}
                {isExpanded && (
                  <div className="px-4 pb-5 pt-2 bg-black/60 border-t border-dark-border/40 text-xs text-zinc-400 space-y-4">
                    <p className="leading-relaxed">{proj.description}</p>
                    <ul className="list-disc pl-4 space-y-2 text-[11px] text-zinc-400">
                      {proj.details.map((detail, index) => (
                        <li key={index} className="leading-relaxed">{detail}</li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {proj.tech.map((t) => (
                        <span 
                          key={t} 
                          className="text-[10px] bg-black border border-dark-border text-zinc-400 px-2 py-0.5 font-mono"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <div className="bg-stripes" />

      {/* Experience Section */}
      <section id="experience" className="scroll-mt-20">
        <h2 className="text-2xl font-mono font-bold text-zinc-500 uppercase tracking-widest border-y border-dark-border py-3 pl-4 bg-[#08080a]/30">
          Experience
        </h2>

        <div className="border-y border-dark-border border-x-0 bg-[#08080a] divide-y divide-dark-border my-6">
          {profileData.experience.map((exp) => {
            const isExpanded = expandedExperience === exp.id;
            return (
              <div key={exp.id} className="transition-all duration-300">
                {/* Header item */}
                <button
                  onClick={() => toggleExperience(exp.id)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-zinc-950 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 border border-zinc-700 bg-zinc-800 flex shrink-0" />
                    <div>
                      <h3 className="text-xs font-semibold text-zinc-200 group-hover:text-white transition-colors flex items-center gap-1.5">
                        {exp.company}
                        {exp.current && (
                          <span className="text-[9px] bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 px-1.5 py-0.2 rounded font-mono">
                            Current
                          </span>
                        )}
                      </h3>
                      <p className="text-[10px] text-zinc-500 mt-0.5">{exp.role} • {exp.type}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-zinc-500">
                    <span className="text-[10px] text-zinc-600 font-mono">{exp.duration}</span>
                    {isExpanded ? (
                      <LuChevronUp className="w-3.5 h-3.5 text-zinc-400" />
                    ) : (
                      <LuChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                    )}
                  </div>
                </button>

                {/* Collapsible details */}
                {isExpanded && (
                  <div className="px-4 pb-5 pt-2 bg-black/60 border-t border-dark-border/40 text-xs text-zinc-400 space-y-4">
                    <ul className="list-disc pl-4 space-y-2 text-[11px] text-zinc-400">
                      {exp.bullets.map((bullet, index) => (
                        <li key={index} className="leading-relaxed">{bullet}</li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {exp.tech.map((t) => (
                        <span 
                          key={t} 
                          className="text-[10px] bg-black border border-dark-border text-zinc-400 px-2 py-0.5 font-mono"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <div className="bg-stripes" />

      {/* Stack Section */}
      <section id="stack" className="scroll-mt-20">
        <h2 className="text-2xl font-mono font-bold text-zinc-500 uppercase tracking-widest border-y border-dark-border py-3 pl-4 bg-[#08080a]/30">
          Stack
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-6 sm:p-8">
          {profileData.stack.map((tech) => {
            const Icon = iconComponents[tech.icon];
            return (
              <div
                key={tech.name}
                className="flex items-center gap-3 p-3 border border-dark-border bg-[#08080a] hover:border-zinc-800 transition-all group hover:bg-[#0e0e11]"
              >
                <div className="p-2 border border-dark-border bg-black text-zinc-500 group-hover:text-white transition-colors shrink-0">
                  {Icon ? <Icon className="w-4 h-4" /> : <LuCode className="w-4 h-4" />}
                </div>
                <div className="overflow-hidden">
                  <h4 className="text-[11px] font-semibold text-zinc-200 group-hover:text-white transition-colors truncate">
                    {tech.name}
                  </h4>
                  <span className="text-[9px] text-zinc-500 block mt-0.5 truncate font-mono">{tech.category}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="bg-stripes" />

      {/* Connect Section */}
      <section className="scroll-mt-20">
        <h2 className="text-2xl font-mono font-bold text-zinc-500 uppercase tracking-widest border-y border-dark-border py-3 pl-4 bg-[#08080a]/30">
          Connect
        </h2>

        <div className="p-6 sm:p-8 space-y-5">
          {/* Social Badges Grid (Fully boxy) */}
          <div className="grid grid-cols-3 gap-2">
          <a
            href={profileData.personal.socials.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 py-3 border border-dark-border bg-[#08080a] hover:bg-zinc-950 hover:text-white text-[11px] font-semibold text-zinc-400 transition-colors"
          >
            Twitter <LuArrowUpRight className="w-3 h-3 text-zinc-600" />
          </a>
          <a
            href={profileData.personal.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 py-3 border border-dark-border bg-[#08080a] hover:bg-zinc-950 hover:text-white text-[11px] font-semibold text-zinc-400 transition-colors"
          >
            GitHub <LuArrowUpRight className="w-3 h-3 text-zinc-600" />
          </a>
          <a
            href={profileData.personal.socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 py-3 border border-dark-border bg-[#08080a] hover:bg-zinc-950 hover:text-white text-[11px] font-semibold text-zinc-400 transition-colors"
          >
            LinkedIn <LuArrowUpRight className="w-3 h-3 text-zinc-600" />
          </a>
        </div>

        {/* Large Connect Clipboard Card (Fully boxy & edge-to-edge themed) */}
        <div className="relative p-6 border border-dark-border bg-[#070708] flex flex-col items-center text-center space-y-4 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-cyan/5 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-violet/5 rounded-full blur-2xl pointer-events-none" />

          <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Contact</span>
          <h3 className="text-xl font-display font-medium text-white max-w-md tracking-tight leading-snug">
            Let's build something solid.
          </h3>
          <p className="text-[11px] text-zinc-400 max-w-sm">
            If you have a product, role, or idea in mind, feel free to reach out. Copy the email to get in touch!
          </p>

          <button
            onClick={handleCopyEmail}
            className="flex items-center gap-2 px-5 py-2.5 border border-dark-border bg-black hover:border-zinc-700 text-xs font-semibold text-zinc-200 transition-colors cursor-pointer active:scale-95"
          >
            {copiedEmail ? (
              <>
                <LuCheck className="w-3.5 h-3.5 text-emerald-400" />
                Copied to clipboard
              </>
            ) : (
              <>
                <LuCopy className="w-3.5 h-3.5 text-zinc-500" />
                {profileData.personal.email}
              </>
            )}
          </button>
        </div>
      </div>
    </section>

      <div className="bg-stripes" />
      {/* Current Interests Section */}
      <section id="interests" className="scroll-mt-20">
        <h2 className="text-2xl font-mono font-bold text-zinc-500 uppercase tracking-widest border-y border-dark-border py-3 pl-4 bg-[#08080a]/30">
          Current Interests
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-6 sm:p-8">
          {profileData.interests.map((int, i) => (
            <div 
              key={i} 
              className="p-4 border border-dark-border bg-[#08080a] flex flex-col justify-between h-36"
            >
              <div>
                <h3 className="text-xs font-semibold text-zinc-200">{int.title}</h3>
                <p className="text-[10px] text-zinc-400 mt-2 leading-relaxed">{int.description}</p>
              </div>
              <span className="text-[9px] text-zinc-650 block border-t border-dark-border/40 pt-2 font-mono">
                {int.metric}
              </span>
            </div>
          ))}
        </div>
      </section>


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
