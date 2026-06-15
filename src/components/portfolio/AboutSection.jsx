import logoImg from "../../../public/logo.png";
import Image from "next/image";
import profileData from "@/data/profile.json";
import { LuFileText } from "react-icons/lu";

export default function AboutSection() {
  return (
    <div id="about">
    <section className="flex items-center justify-center h-[15vh]">
        <Image className="w-[15vh] h-[15vh]" src={logoImg} alt="logo" priority />
    </section>  
    <section className="scroll-mt-20">
      <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 border border-dark-border bg-[#08080a] p-5">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Rounded Square avatar in a sharp border box */}
          <div className="relative shrink-0">
            <Image 
              src={profileData.personal.avatar} 
              alt={profileData.personal.name} 
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl object-cover border border-dark-border"
              width={128}
              height={128}
              priority
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border border-black shadow-md z-10">
              <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
              <span className="absolute inset-0.5 rounded-full bg-emerald-200 animate-pulse" />
            </div>
          </div>

          <div className="text-center sm:text-left space-y-2.5">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="text-[13px] text-brand-cyan uppercase font-bold tracking-widest font-mono">
                {profileData.personal.role}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-medium tracking-tight text-white flex items-center justify-center sm:justify-start gap-1.5">
              {profileData.personal.name}
            </h1>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-lg">
              {profileData.personal.headline}
            </p>
            <span className="text-[12px] bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 px-2 py-0.5 rounded font-mono">
              {profileData.personal.status}
            </span>
          </div>
        </div>

        {/* View Resume Button */}
        {profileData.personal.resume && (
          <a
            href={profileData.personal.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 border border-dark-border bg-black text-zinc-400 hover:text-white hover:border-zinc-700 hover:bg-[#0e0e11] transition-all font-mono text-xs uppercase tracking-wider shrink-0 sm:self-start mt-2 sm:mt-0"
          >
            <LuFileText className="w-4 h-4 text-zinc-500" />
            <span>Resume</span>
          </a>
        )}
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
    </div>
  );
}
