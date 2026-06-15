import profileData from "@/data/profile.json";
import { LuSend } from "react-icons/lu";

export default function ChatInput({ 
  input, 
  setInput, 
  isTyping, 
  suggestedPrompts, 
  handleSend, 
  messagesCount 
}) {
  return (
    <div className="p-3 border-t border-dark-border bg-black/20">
      {/* Suggestion Chips */}
      {messagesCount === 1 && !isTyping && (
        <div className="flex gap-1.5 overflow-x-auto pb-3 scrollbar-none">
          {suggestedPrompts.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(chip.query)}
              className="text-[12px] text-zinc-400 hover:text-brand-cyan hover:border-brand-cyan/25 border border-dark-border bg-black px-3 py-1.5 rounded-none whitespace-nowrap transition-all cursor-pointer font-mono"
            >
              {chip.label}
            </button>
          ))}
        </div>
      )}

      {/* Form Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 bg-black rounded-none border border-dark-border p-1 focus-within:border-zinc-800 transition-colors"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isTyping}
          placeholder={isTyping ? "Typing..." : `Ask me anything about ${profileData.personal.nickname}...`}
          className="flex-1 bg-transparent px-3 py-1.5 text-xs text-zinc-100 placeholder-zinc-550 focus:outline-none disabled:opacity-55"
        />
        <button
          type="submit"
          disabled={isTyping || !input.trim()}
          className="bg-zinc-900 border border-dark-border hover:bg-zinc-800 text-white rounded-none p-2 disabled:opacity-30 transition-all cursor-pointer shrink-0"
        >
          <LuSend className="w-3.5 h-3.5 text-zinc-200" />
        </button>
      </form>
    </div>
  );
}
