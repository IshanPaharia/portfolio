import profileData from "@/data/profile.json";
import { LuCopy, LuCheck, LuArrowUpRight } from "react-icons/lu";

export default function ConnectSection({ copiedEmail, handleCopyEmail }) {
  const hasTwitter = !!profileData.personal.socials.twitter;

  return (
    <section id="connect" className="scroll-mt-20">
      <h2 className="text-2xl font-mono font-bold text-zinc-500 uppercase tracking-widest border-y border-dark-border py-3 pl-4 bg-[#08080a]/30">
        Connect
      </h2>

      <div className="p-6 sm:p-8 space-y-5">
        {/* Social Badges Grid (Fully boxy) */}
        <div className={`grid gap-2 ${hasTwitter ? "grid-cols-3" : "grid-cols-2"}`}>
          {hasTwitter && (
            <a
              href={profileData.personal.socials.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-3 border border-dark-border bg-[#08080a] hover:bg-zinc-950 hover:text-white text-[12px] font-semibold text-zinc-400 transition-colors"
            >
              Twitter <LuArrowUpRight className="w-3 h-3 text-zinc-600" />
            </a>
          )}
          <a
            href={profileData.personal.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 py-3 border border-dark-border bg-[#08080a] hover:bg-zinc-950 hover:text-white text-[12px] font-semibold text-zinc-400 transition-colors"
          >
            GitHub <LuArrowUpRight className="w-3 h-3 text-zinc-600" />
          </a>
          <a
            href={profileData.personal.socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 py-3 border border-dark-border bg-[#08080a] hover:bg-zinc-950 hover:text-white text-[12px] font-semibold text-zinc-400 transition-colors"
          >
            LinkedIn <LuArrowUpRight className="w-3 h-3 text-zinc-600" />
          </a>
        </div>

        {/* Large Connect Clipboard Card (Fully boxy & edge-to-edge themed) */}
        <div className="relative p-6 border border-dark-border bg-[#070708] flex flex-col items-center text-center space-y-4 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-cyan/5 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-violet/5 rounded-full blur-2xl pointer-events-none" />

          <span className="text-[11px] text-zinc-500 uppercase tracking-widest font-mono">Contact</span>
          <h3 className="text-xl font-display font-medium text-white max-w-md tracking-tight leading-snug">
            {"Let's build something solid."}
          </h3>
          <p className="text-[12px] text-zinc-400 max-w-sm">
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
  );
}
