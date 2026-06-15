"use client";

import { useState } from "react";
import { SiCodeforces, SiCodechef, SiLeetcode } from "react-icons/si";
import liveCalendarData from "@/data/live_calendar.json";

export default function CpDsaStatsSection() {
  const [data] = useState(() => {
    const cpStats = liveCalendarData?.cpStats;
    return {
      codeforces: {
        currentRating: cpStats?.codeforces?.currentRating || 1336,
        maxRating: cpStats?.codeforces?.maxRating || 1465,
        rank: cpStats?.codeforces?.rank || "specialist",
        loading: false
      },
      codechef: {
        currentRating: cpStats?.codechef?.currentRating || 1681,
        maxRating: cpStats?.codechef?.maxRating || 1746,
        stars: cpStats?.codechef?.stars || "3★",
        loading: false
      },
      leetcode: {
        solved: cpStats?.leetcode?.solved || 213,
        rating: cpStats?.leetcode?.rating || 1853,
        maxRating: cpStats?.leetcode?.maxRating || 1853,
        title: cpStats?.leetcode?.title || "Knight",
        loading: false
      }
    };
  });
  
  const lastUpdated = liveCalendarData?.updatedAt;
  const formattedUpdateDate = lastUpdated ? (() => {
    try {
      const [datePart] = lastUpdated.split("T");
      const [y, m, d] = datePart.split("-");
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return `${months[parseInt(m, 10) - 1]} ${parseInt(d, 10)}, ${y}`;
    } catch (e) {
      return null;
    }
  })() : null;

  return (
    <section id="achievements" className="scroll-mt-20">
      <div className="flex items-center justify-between border-y border-dark-border py-3 px-4 bg-[#08080a]/30">
        <h2 className="text-2xl font-mono font-bold text-zinc-500 uppercase tracking-widest">
          CP/DSA Stats
        </h2>
        {formattedUpdateDate && (
          <div className="flex items-center gap-1.5 text-[13px] text-zinc-500 font-mono">
            <span className="relative flex h-1.5 w-1.5">
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            Synced: {formattedUpdateDate}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-6 sm:p-8">
        {/* Codeforces Card */}
        <div className="p-4 border border-dark-border bg-[#08080a] flex flex-col justify-between h-40 hover:border-zinc-800 transition-all group hover:bg-[#0e0e11]">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-zinc-300 group-hover:text-white transition-colors">
                <SiCodeforces className="w-5 h-5 text-[#B13F3F]" />
                <span className="text-xs font-semibold font-mono">Codeforces</span>
              </div>
              <span className="text-[12px] uppercase font-bold tracking-widest font-mono bg-zinc-900 border border-dark-border text-zinc-400 px-1.5 py-0.5 capitalize">
                {data.codeforces.rank}
              </span>
            </div>
            
            <a 
              href="https://codeforces.com/profile/DArkENDoom"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[14px] text-brand-cyan hover:underline mt-2.5 block font-mono"
            >
              @DArkENDoom
            </a>
          </div>

          <div className="border-t border-dark-border/40 pt-2 grid grid-cols-2 text-left font-mono">
            <div>
              <span className="text-[12px] text-zinc-550 block">Rating</span>
              <span className="text-xs font-bold text-zinc-200">{data.codeforces.currentRating}</span>
            </div>
            <div>
              <span className="text-[12px] text-zinc-550 block">Max Rating</span>
              <span className="text-xs font-bold text-zinc-350">{data.codeforces.maxRating}</span>
            </div>
          </div>
        </div>

        {/* CodeChef Card */}
        <div className="p-4 border border-dark-border bg-[#08080a] flex flex-col justify-between h-40 hover:border-zinc-800 transition-all group hover:bg-[#0e0e11]">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-zinc-300 group-hover:text-white transition-colors">
                <SiCodechef className="w-5 h-5 text-[#5B4638]" />
                <span className="text-xs font-semibold font-mono">CodeChef</span>
              </div>
              <span className="text-[12px] uppercase font-bold tracking-widest font-mono bg-[#1E7D22]/10 border border-[#1E7D22]/20 text-[#emerald-450] px-1.5 py-0.5">
                {data.codechef.stars}
              </span>
            </div>

            <a 
              href="https://www.codechef.com/users/darkendoom"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[14px] text-brand-cyan hover:underline mt-2.5 block font-mono"
            >
              @darkendoom
            </a>
          </div>

          <div className="border-t border-dark-border/40 pt-2 grid grid-cols-2 text-left font-mono">
            <div>
              <span className="text-[12px] text-zinc-550 block">Rating</span>
              <span className="text-xs font-bold text-zinc-200">{data.codechef.currentRating}</span>
            </div>
            <div>
              <span className="text-[12px] text-zinc-550 block">Max Rating</span>
              <span className="text-xs font-bold text-zinc-350">{data.codechef.maxRating}</span>
            </div>
          </div>
        </div>

        {/* LeetCode Card */}
        <div className="p-4 border border-dark-border bg-[#08080a] flex flex-col justify-between h-40 hover:border-zinc-800 transition-all group hover:bg-[#0e0e11]">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-zinc-300 group-hover:text-white transition-colors">
                <SiLeetcode className="w-5 h-5 text-[#FFA116]" />
                <span className="text-xs font-semibold font-mono">LeetCode</span>
              </div>
              <span className="text-[12px] uppercase font-bold tracking-widest font-mono bg-[#FFA116]/10 border border-[#FFA116]/20 text-[#FFA116] px-1.5 py-0.5 capitalize">
                {data.leetcode.title}
              </span>
            </div>

            <a 
              href="https://leetcode.com/DArkENDoom/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[14px] text-brand-cyan hover:underline mt-2.5 block font-mono"
            >
              @DArkENDoom
            </a>
          </div>

          <div className="border-t border-dark-border/40 pt-2 grid grid-cols-3 text-left font-mono">
            <div>
              <span className="text-[12px] text-zinc-550 block">Solved</span>
              <span className="text-xs font-bold text-zinc-200">{data.leetcode.solved}+</span>
            </div>
            <div>
              <span className="text-[12px] text-zinc-550 block">Rating</span>
              <span className="text-xs font-bold text-zinc-200">{data.leetcode.rating}</span>
            </div>
            <div>
              <span className="text-[12px] text-zinc-550 block">Max Rating</span>
              <span className="text-xs font-bold text-zinc-350">{data.leetcode.maxRating}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
