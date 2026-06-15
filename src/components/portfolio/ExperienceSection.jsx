import profileData from "@/data/profile.json";
import { LuChevronDown, LuChevronUp } from "react-icons/lu";

export default function ExperienceSection({ expandedExperience, toggleExperience }) {
  if (!profileData.experience || profileData.experience.length === 0) {
    return (
      <section id="experience" className="scroll-mt-20">
        <h2 className="text-2xl font-mono font-bold text-zinc-500 uppercase tracking-widest border-y border-dark-border py-3 pl-4 bg-[#08080a]/30">
          Experience
        </h2>

        <div className="border-y border-dark-border border-x-0 bg-[#08080a] p-8 text-center text-zinc-500 text-xs font-mono">
          Yet to gain experience. :D
        </div>
      </section>
    );
  }

  return (
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
                        <span className="text-[12px] bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 px-1.5 py-0.2 rounded font-mono">
                          Current
                        </span>
                      )}
                    </h3>
                    <p className="text-[13px] text-zinc-500 mt-0.5">{exp.role} • {exp.type}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-zinc-500">
                  <span className="text-[13px] text-zinc-600 font-mono">{exp.duration}</span>
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
                  <ul className="list-disc pl-4 space-y-2 text-[14px] text-zinc-400">
                    {exp.bullets.map((bullet, index) => (
                      <li key={index} className="leading-relaxed">{bullet}</li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {exp.tech.map((t) => (
                      <span 
                        key={t} 
                        className="text-[13px] bg-black border border-dark-border text-zinc-400 px-2 py-0.5 font-mono"
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
  );
}
