"use client";

import { useState, useEffect, useRef } from "react";
import { findBestMatch } from "@/lib/chatEngine";
import profileData from "@/data/profile.json";

// Import modular subcomponents
import ChatHeader from "./chat/ChatHeader";
import MessageBubble from "./chat/MessageBubble";
import ChatInput from "./chat/ChatInput";

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

    // Append to messages state, clear input, and show typing loader
    setMessages(prev => {
      const userMessage = {
        id: `user-${prev.length}`,
        sender: "user",
        text: query.trim()
      };
      return [...prev, userMessage];
    });
    setInput("");
    setIsTyping(true);

    // Simulate natural response latency (~1000ms)
    setTimeout(() => {
      // Query the search engine for a match
      const reply = findBestMatch(query);
      
      // Append assistant response and hide typing loader
      setMessages(prev => {
        const assistantMessage = {
          id: `assistant-${prev.length}`,
          sender: "assistant",
          text: reply.answer,
          action: reply.action
        };
        return [...prev, assistantMessage];
      });
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#070708] border border-dark-border rounded- shadow-none relative">
      {/* Boxy Header */}
      <ChatHeader onSwitchToPortfolio={onSwitchToPortfolio} />

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            msg={msg}
            onSwitchToPortfolio={onSwitchToPortfolio}
            onNavigateToSection={onNavigateToSection}
            copiedEmail={copiedEmail}
            handleCopyEmail={handleCopyEmail}
            suggestedPrompts={suggestedPrompts}
            handleSend={handleSend}
          />
        ))}

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
      <ChatInput
        input={input}
        setInput={setInput}
        isTyping={isTyping}
        suggestedPrompts={suggestedPrompts}
        handleSend={handleSend}
        messagesCount={messages.length}
      />
    </div>
  );
}
