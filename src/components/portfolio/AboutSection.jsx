import logoImg from "../../../public/logo.png";
import Image from "next/image";
import profileData from "@/data/profile.json";

export default function AboutSection() {
  return (
    <div id="about">
    <section className="flex items-center justify-center h-[15vh]">
        <Image className="w-[15vh] h-[15vh]" src={logoImg} alt="logo" priority />
    </section>  
    <section className="scroll-mt-20">
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
            <span className="text-[11px] text-brand-cyan uppercase font-bold tracking-widest font-mono">
              {profileData.personal.role}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-medium tracking-tight text-white flex items-center justify-center sm:justify-start gap-1.5">
            {profileData.personal.name}
          </h1>
          <p className="text-xs text-zinc-400 leading-relaxed max-w-lg">
            {profileData.personal.headline}
          </p>
          <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 px-2 py-0.5 rounded font-mono">
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
    </div>
  );
}
