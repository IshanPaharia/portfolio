import profileData from "@/data/profile.json";

export default function ChatHeader({ onSwitchToPortfolio }) {
  return (
    <div className="px-4 py-3 border-b border-dark-border bg-black/40 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="relative">
          <span className="block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>
        <div>
          <h3 className="text-xs font-semibold text-zinc-200">Portfolio Assistant</h3>
          <p className="text-[9px] text-zinc-650 font-mono">{"Not just another LLM API wrapper — it's a fuzzy-logic Q&A agent"}</p>
        </div>
      </div>

      <button
        onClick={onSwitchToPortfolio}
        className="text-[10px] text-zinc-400 hover:text-zinc-200 border border-dark-border bg-black px-2.5 py-1 rounded-none transition-colors cursor-pointer font-mono"
      >
        Skip to portfolio &rarr;
      </button>
    </div>
  );
}
