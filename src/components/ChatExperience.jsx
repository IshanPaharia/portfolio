"use client";

import { useState, useEffect, useRef } from "react";
import { findBestMatch } from "@/lib/chatEngine";
import profileData from "@/data/profile.json";
import { 
  LuSend, 
  LuMail, 
  LuGithub, 
  LuLinkedin, 
  LuCode, 
  LuCopy, 
  LuCheck 
} from "react-icons/lu";

export default function ChatExperience({ onSwitchToPortfolio, onNavigateToSection }) {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const chatEndRef = useRef(null);

  const displayName = profileData.personal.nickname || profileData.personal.name;

  // Initial greeting message
  const [messages, setMessages] = useState([
    {
      id: "greeting",
      sender: "assistant",
      text: `Hi! I'm ${displayName}'s portfolio assistant. Feel free to ask me anything about my skills, experience, or projects, or just use the suggestions below!`,
    }
  ]);

  // Suggested prompt chips
  const suggestedPrompts = [
    { label: "What is your stack?", query: "what is your tech stack?" },
    { label: "Show me your projects", query: "show me your projects" },
    { label: "Tell me about your experience", query: "tell me about your experience" },
    { label: "How can I contact you?", query: "how can I contact you?" }
  ];

  // Auto-scroll to bottom of chat when messages change or typing status changes
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Handle copying email inside fallback card
  const handleCopyEmail = () => {
    navigator.clipboard.writeText(profileData.personal.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  // Message Submission & Typing latency Simulation
  const handleSend = async (queryText) => {
    const query = queryText || input;
    
    // Ignore if empty or whitespace-only
    if (!query || !query.trim()) return;

    // Create the user message object
    const userMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query.trim()
    };

    // Append to messages state, clear input, and show typing loader
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate natural response latency (~1000ms)
    setTimeout(() => {
      // Query the search engine for a match
      const reply = findBestMatch(query);
      
      // Create assistant response object
      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        sender: "assistant",
        text: reply.answer,
        action: reply.action
      };

      // Append assistant response and hide typing loader
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000);
  };

  // UI Renderer for different response action payloads
  const renderCardPayload = (action, text) => {
    switch (action) {
      case "RENDER_PROJECTS":
        return (
          <div className="mt-3 grid gap-2">
            {profileData.projects.map((proj) => (
              <div 
                key={proj.id} 
                className="p-3 border border-dark-border bg-black hover:border-brand-cyan/40 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <h4 className="text-xs font-semibold text-zinc-100">{proj.title}</h4>
                  <span className="text-[10px] text-zinc-500 font-mono">{proj.year}</span>
                </div>
                <p className="text-[11px] text-zinc-400 mt-1">{proj.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {proj.tech.slice(0, 3).map((t) => (
                    <span key={t} className="text-[9px] bg-[#0c0c0e] border border-dark-border text-zinc-500 px-1.5 py-0.5 font-mono">
                      {t}
                    </span>
                  ))}
                </div>
                <button 
                  onClick={() => onNavigateToSection("projects")}
                  className="text-[10px] text-brand-cyan hover:underline mt-2.5 flex items-center gap-1 cursor-pointer font-mono"
                >
                  View Details &rarr;
                </button>
              </div>
            ))}
          </div>
        );

      case "RENDER_STACK":
        return (
          <div className="mt-3 grid grid-cols-2 gap-1.5">
            {profileData.stack.slice(0, 8).map((tech) => (
              <div 
                key={tech.name} 
                className="flex items-center gap-2 p-2 border border-dark-border bg-black"
              >
                <span className="w-1.5 h-1.5" style={{ backgroundColor: tech.color }} />
                <span className="text-[11px] text-zinc-300 font-medium">{tech.name}</span>
                <span className="text-[9px] text-zinc-600 ml-auto font-mono">{tech.category}</span>
              </div>
            ))}
            <div className="col-span-2 text-center mt-1">
              <button 
                onClick={() => onNavigateToSection("stack")}
                className="text-[10px] text-brand-violet hover:underline cursor-pointer font-mono"
              >
                View all skills &rarr;
              </button>
            </div>
          </div>
        );

      case "RENDER_EXPERIENCE":
        return (
          <div className="mt-3 border-l border-zinc-800 pl-3.5 space-y-3">
            {profileData.experience.map((exp) => (
              <div key={exp.id} className="relative">
                <span className="absolute -left-[18px] top-1.5 w-1.5 h-1.5 border border-zinc-800 bg-zinc-650" />
                <div className="flex justify-between items-start">
                  <h4 className="text-xs font-semibold text-zinc-200">{exp.role}</h4>
                  <span className="text-[9px] text-zinc-600 font-mono">{exp.duration}</span>
                </div>
                <p className="text-[10px] text-zinc-500">{exp.company}</p>
              </div>
            ))}
            <button 
              onClick={() => onNavigateToSection("experience")}
              className="text-[10px] text-brand-violet hover:underline block pt-1 cursor-pointer font-mono"
            >
              View detailed resume &rarr;
            </button>
          </div>
        );

      case "RENDER_CONTACT":
        return (
          <div className="mt-3 space-y-2">
            {/* Copy Email Button */}
            <div className="flex items-center gap-2 p-2 border border-dark-border bg-black justify-between">
              <div className="flex items-center gap-2 overflow-hidden">
                <LuMail className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                <span className="text-xs text-zinc-300 truncate select-all">{profileData.personal.email}</span>
              </div>
              <button 
                onClick={handleCopyEmail}
                className="text-zinc-500 hover:text-white p-1 transition-colors cursor-pointer"
                title="Copy email"
              >
                {copiedEmail ? <LuCheck className="w-3.5 h-3.5 text-green-400" /> : <LuCopy className="w-3.5 h-3.5" />}
              </button>
            </div>
            
            {/* Social link row */}
            <div className="flex gap-2 justify-center">
              <a 
                href={profileData.personal.socials.github} 
                target="_blank" 
                className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-dark-border bg-black hover:bg-zinc-950 text-[11px] text-zinc-400 hover:text-white transition-colors font-mono"
              >
                <LuGithub className="w-3 h-3" /> GitHub
              </a>
              <a 
                href={profileData.personal.socials.linkedin} 
                target="_blank" 
                className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-dark-border bg-black hover:bg-zinc-950 text-[11px] text-zinc-400 hover:text-white transition-colors font-mono"
              >
                <LuLinkedin className="w-3 h-3" /> LinkedIn
              </a>
            </div>
          </div>
        );

      case "RENDER_INTERESTS":
        return (
          <div className="mt-3 space-y-2">
            {profileData.interests.map((int, i) => (
              <div key={i} className="p-2 border border-dark-border bg-black">
                <h4 className="text-[11px] font-semibold text-zinc-200">{int.title}</h4>
                <p className="text-[10px] text-zinc-450 mt-0.5">{int.description}</p>
                <span className="text-[9px] text-zinc-600 block mt-1 font-mono">{int.metric}</span>
              </div>
            ))}
            <button 
              onClick={() => onNavigateToSection("interests")}
              className="text-[10px] text-brand-cyan hover:underline cursor-pointer font-mono"
            >
              See full list &rarr;
            </button>
          </div>
        );

      case "RENDER_FALLBACK":
        return (
          <div className="mt-3 space-y-3">
            {/* Direct Email copy */}
            <div className="p-3 border border-dark-border bg-zinc-950/80">
              <p className="text-[11px] text-zinc-400">
                You can copy the email to write a message directly:
              </p>
              <div className="flex items-center justify-between gap-2 mt-2 p-1.5 bg-black border border-dark-border">
                <span className="text-[11px] text-zinc-300 font-mono truncate">{profileData.personal.email}</span>
                <button 
                  onClick={handleCopyEmail}
                  className="text-zinc-500 hover:text-white p-1 shrink-0 transition-colors cursor-pointer"
                >
                  {copiedEmail ? <LuCheck className="w-3.5 h-3.5 text-green-400" /> : <LuCopy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Prompt suggestions grid */}
            <div>
              <p className="text-[10px] text-zinc-500 font-semibold mb-1.5 uppercase tracking-wide font-mono">Suggested prompts:</p>
              <div className="grid grid-cols-1 gap-1">
                {suggestedPrompts.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(chip.query)}
                    className="text-left text-[11px] text-zinc-400 hover:text-brand-cyan hover:border-brand-cyan/30 px-3 py-2 border border-dark-border bg-black transition-all cursor-pointer font-mono"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#070708] border border-dark-border rounded- shadow-none relative">
      {/* Boxy Header */}
      <div className="px-4 py-3 border-b border-dark-border bg-black/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <span className="block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-zinc-200">Portfolio Assistant</h3>
            <p className="text-[9px] text-zinc-650 font-mono">Offline FAQ engine</p>
          </div>
        </div>

        <button
          onClick={onSwitchToPortfolio}
          className="text-[10px] text-zinc-400 hover:text-zinc-200 border border-dark-border bg-black px-2.5 py-1 rounded-none transition-colors cursor-pointer font-mono"
        >
          Skip to portfolio &rarr;
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === "user";
          return (
            <div
              key={msg.id}
              className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}
            >
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
                {!isUser && renderCardPayload(msg.action, msg.text)}

                {/* Switch nudge after assistant responses */}
                {!isUser && msg.id !== "greeting" && (
                  <div className="mt-3 pt-2 border-t border-dark-border/40 flex items-center justify-between text-[10px] font-mono">
                    <span className="text-zinc-600">Looking for full layout?</span>
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
        })}

        {/* Typing Bubble */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-black border border-dark-border text-zinc-450 rounded-none px-4 py-2.5 flex gap-1 items-center">
              <span className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Bar & Suggestion Chips */}
      <div className="p-3 border-t border-dark-border bg-black/20">
        {/* Suggestion Chips */}
        {messages.length === 1 && !isTyping && (
          <div className="flex gap-1.5 overflow-x-auto pb-3 scrollbar-none">
            {suggestedPrompts.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(chip.query)}
                className="text-[10px] text-zinc-400 hover:text-brand-cyan hover:border-brand-cyan/25 border border-dark-border bg-black px-3 py-1.5 rounded-none whitespace-nowrap transition-all cursor-pointer font-mono"
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
    </div>
  );
}
