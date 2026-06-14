import ChatPayloads from "./ChatPayloads";

export default function MessageBubble({ 
  msg, 
  onSwitchToPortfolio, 
  onNavigateToSection, 
  copiedEmail, 
  handleCopyEmail, 
  suggestedPrompts, 
  handleSend 
}) {
  const isUser = msg.sender === "user";

  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] border px-3.5 py-2.5 text-xs leading-relaxed ${
          isUser
            ? "bg-brand-cyan text-black border-brand-cyan font-medium"
            : "bg-black border-dark-border text-zinc-100"
        } rounded-none`}
      >
        {/* Message Text */}
        <p className="whitespace-pre-line">{msg.text}</p>
        
        {/* Match Cards */}
        {!isUser && msg.action && (
          <ChatPayloads 
            action={msg.action} 
            onNavigateToSection={onNavigateToSection}
            copiedEmail={copiedEmail}
            handleCopyEmail={handleCopyEmail}
            suggestedPrompts={suggestedPrompts}
            handleSend={handleSend}
          />
        )}

        {/* Switch nudge after assistant responses */}
        {!isUser && msg.id !== "greeting" && (
          <div className="mt-3 pt-2 border-t border-dark-border/40 flex items-center justify-between text-[11px] font-mono">
            <span className="text-zinc-550">Looking for full layout?</span>
            <button
              onClick={onSwitchToPortfolio}
              className="text-brand-cyan hover:underline font-medium cursor-pointer"
            >
              Open portfolio &rarr;
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
