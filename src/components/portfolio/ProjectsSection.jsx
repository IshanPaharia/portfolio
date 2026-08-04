import profileData from "@/data/profile.json";
import { LuExternalLink, LuChevronDown, LuChevronUp } from "react-icons/lu";
import { motion, AnimatePresence } from "framer-motion";

export default function ProjectsSection({ expandedProject, toggleProject }) {
  return (
    <section id="projects" className="scroll-mt-20">
      <h2 className="text-2xl font-mono font-bold text-zinc-500 uppercase tracking-widest border-y border-dark-border py-3 pl-4 bg-[#08080a]/30">
        Projects
      </h2>
      
      <div className="border-y border-dark-border border-x-0 bg-[#08080a] divide-y divide-dark-border">
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
                  </div>
                </div>

                <div className="flex items-center gap-3 text-zinc-500">
                  {proj.link && (
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
                  )}
                  {isExpanded ? (
                    <LuChevronUp className="w-3.5 h-3.5 text-zinc-400" />
                  ) : (
                    <LuChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                  )}
                </div>
              </button>

              {/* Collapsible details with smooth animation */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-5 pt-2 bg-black/60 border-t border-dark-border/40 text-xs text-zinc-400 space-y-4">
                      {/* Project Mockup Image */}
                      {proj.image && (
                        <div className="overflow-hidden rounded-xl border border-dark-border/80 bg-black/40 my-2">
                          <img 
                            src={proj.image} 
                            alt={proj.title} 
                            className="w-full h-auto object-cover"
                          />
                        </div>
                      )}

                      <p className="leading-relaxed">{proj.description}</p>
                      
                      {proj.details && proj.details.length > 0 && (
                        <ul className="list-disc pl-4 space-y-2 text-[14px] text-zinc-400">
                          {proj.details.map((detail, index) => (
                            <li key={index} className="leading-relaxed">{detail}</li>
                          ))}
                        </ul>
                      )}

                      {/* Action Links */}
                      {(proj.link || proj.github) && (
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          {proj.link && (
                            <a
                              href={proj.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1 bg-[#121215] hover:bg-[#1c1c21] border border-dark-border rounded-md text-[13px] font-medium text-white transition-all flex items-center gap-1.5"
                            >
                              Live Demo
                            </a>
                          )}
                          {proj.github && (
                            <a
                              href={proj.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1 bg-[#121215] hover:bg-[#1c1c21] border border-dark-border rounded-md text-[13px] font-medium text-zinc-300 hover:text-white transition-all flex items-center gap-1.5"
                            >
                              Open Source
                            </a>
                          )}
                        </div>
                      )}

                      {/* Tech stack pills */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {proj.tech.map((t) => (
                          <span 
                            key={t} 
                            className="text-[13px] bg-black border border-dark-border text-zinc-400 px-2 py-0.5 font-mono"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
