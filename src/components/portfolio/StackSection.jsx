import profileData from "@/data/profile.json";
import { LuCode } from "react-icons/lu";
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
  SiPostman,
  SiPython,
  SiC,
  SiCplusplus,
  SiTypescript,
  SiExpress,
  SiDjango,
  SiFastapi,
  SiMongodb,
  SiMysql,
  SiRedis,
  SiDocker,
  SiLinux
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
  SiPostman: SiPostman,
  SiPython: SiPython,
  SiC: SiC,
  SiCplusplus: SiCplusplus,
  SiTypescript: SiTypescript,
  SiExpress: SiExpress,
  SiDjango: SiDjango,
  SiFastapi: SiFastapi,
  SiMongodb: SiMongodb,
  SiMysql: SiMysql,
  SiRedis: SiRedis,
  SiDocker: SiDocker,
  SiLinux: SiLinux
};

export default function StackSection() {
  return (
    <section id="stack" className="scroll-mt-20">
      <h2 className="text-2xl font-mono font-bold text-zinc-500 uppercase tracking-widest border-y border-dark-border py-3 pl-4 bg-[#08080a]/30">
        Stack
      </h2>

      <div className="grid grid-cols-2 min-[375px]:grid-cols-3 min-[480px]:grid-cols-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 p-4 sm:p-8">
        {profileData.stack.map((tech) => {
          const Icon = iconComponents[tech.icon];
          return (
            <div
              key={tech.name}
              className="flex items-center gap-2 p-2 sm:gap-3 sm:p-3 border border-dark-border bg-[#08080a] hover:border-zinc-800 transition-all group hover:bg-[#0e0e11]"
            >
              <div className="p-1.5 sm:p-2 border border-dark-border bg-black text-zinc-500 group-hover:text-white transition-colors shrink-0">
                {Icon ? <Icon className="w-4 h-4" /> : <LuCode className="w-4 h-4" />}
              </div>
              <div className="overflow-hidden">
                <h4 className="text-[12px] font-semibold text-zinc-200 group-hover:text-white transition-colors truncate">
                  {tech.name}
                </h4>
                <span className="text-[10px] text-zinc-550 hidden sm:block mt-0.5 truncate font-mono">{tech.category}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
