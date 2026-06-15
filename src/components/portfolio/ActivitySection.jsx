import { useRef, useEffect } from "react";

export default function ActivitySection({ stats }) {
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
    }
  }, [stats]);
  return (
    <section id="activity" className="scroll-mt-20">
      <h2 className="text-2xl font-mono font-bold text-zinc-500 uppercase tracking-widest border-y border-dark-border py-3 pl-4 bg-[#08080a]/30">
        Activity Calendar
      </h2>
      
      <div className="p-6 sm:p-8 space-y-6">
        {/* Calendar Stats Board */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 border border-dark-border bg-[#08080a] p-4 text-center">
          <div>
            <span className="text-[13px] text-zinc-500 uppercase tracking-widest font-mono">Total Commits</span>
            <p className="text-lg font-semibold text-white mt-1 font-mono">{stats.totalCommits}</p>
          </div>
          <div>
            <span className="text-[13px] text-zinc-500 uppercase tracking-widest font-mono">Problems Solved</span>
            <p className="text-lg font-semibold text-white mt-1 font-mono">{stats.totalCP}</p>
          </div>
          <div>
            <span className="text-[13px] text-zinc-500 uppercase tracking-widest font-mono">Current Streak</span>
            <p className="text-lg font-semibold text-brand-cyan mt-1 font-mono">{stats.currentStreak} days</p>
          </div>
          <div>
            <span className="text-[13px] text-zinc-500 uppercase tracking-widest font-mono">Max Streak</span>
            <p className="text-lg font-semibold text-brand-violet mt-1 font-mono">{stats.maxStreak} days</p>
          </div>
        </div>

        {/* Grid Container */}
        <div className="border border-dark-border bg-[#08080a] p-5 relative overflow-hidden">
          <div className="text-[13px] text-zinc-400 font-mono mb-4 flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
            <span>{stats.isLive ? "Live" : "Demo"} Activity Map (Last 12 Months)</span>
            <div className="flex items-center gap-1.5 text-[12px] text-zinc-500 self-start sm:self-auto">
              <span>Less</span>
              <span className="w-2.5 h-2.5 bg-zinc-900/60 border border-zinc-950 rounded-[1.5px]" title="No activity" />
              <span className="w-2.5 h-2.5 bg-emerald-500/15 border border-emerald-500/5 rounded-[1.5px]" title="Level 1" />
              <span className="w-2.5 h-2.5 bg-emerald-500/35 border border-emerald-500/15 rounded-[1.5px]" title="Level 2" />
              <span className="w-2.5 h-2.5 bg-emerald-400/75 border border-emerald-300/15 rounded-[1.5px]" title="Level 3" />
              <span className="w-2.5 h-2.5 bg-emerald-400 border border-emerald-300/25 rounded-[1.5px]" title="Level 4" />
              <span>More</span>
            </div>
          </div>

          {/* Scrollable grid wrapper */}
          <div 
            ref={scrollContainerRef}
            className="overflow-x-auto pt-10 pb-16 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent"
          >
            <div className="w-[816px] mx-auto select-none">
              {/* Month Labels */}
              <div className="flex h-4 relative mb-1 text-[12px] text-zinc-500 font-mono">
                {/* Sticky mask to hide month labels when they scroll past the day line */}
                <div className="sticky left-0 h-full w-[24px] bg-[#08080a] z-10 shrink-0" />
                {stats.monthLabels.map((ml, idx) => (
                  <span
                    key={idx}
                    className="absolute"
                    style={{ left: `${ml.index * 15 + 24}px` }}
                  >
                    {ml.label}
                  </span>
                ))}
              </div>

              <div className="flex">
                {/* Weekday Labels */}
                <div className="sticky left-0 bg-[#08080a] flex flex-col gap-[3px] text-[11px] text-zinc-500 font-mono text-right w-[24px] pr-[3px] shrink-0 z-10 select-none">
                  <span className="h-[12px] flex items-center justify-end leading-none">Sun</span>
                  <span className="h-[12px] invisible leading-none">Mon</span>
                  <span className="h-[12px] flex items-center justify-end leading-none">Tue</span>
                  <span className="h-[12px] invisible leading-none">Wed</span>
                  <span className="h-[12px] flex items-center justify-end leading-none">Thu</span>
                  <span className="h-[12px] invisible leading-none">Fri</span>
                  <span className="h-[12px] flex items-center justify-end leading-none">Sat</span>
                </div>

                {/* Weeks Columns */}
                <div className="flex gap-[3px]">
                  {stats.weeks.map((week, wIdx) => (
                    <div key={wIdx} className="flex flex-col gap-[3px]">
                      {week.map((day, dIdx) => {
                        const level = day.level !== undefined ? day.level : day.stage;
                        return (
                          <div
                            key={dIdx}
                            className={`w-[12px] h-[12px] rounded-[1.5px] relative group cursor-pointer transition-all duration-150 ${
                              day.isFuture
                                ? "bg-transparent pointer-events-none border-transparent"
                                : level === 0
                                  ? "bg-zinc-900/60 border border-zinc-950 hover:bg-zinc-800 hover:border-zinc-700"
                                  : level === 1
                                    ? "bg-emerald-500/15 border border-emerald-500/5 hover:bg-emerald-500/30 hover:border-emerald-500/20"
                                    : level === 2
                                      ? "bg-emerald-500/35 border border-emerald-500/15 hover:bg-emerald-500/55 hover:border-emerald-500/40"
                                      : level === 3
                                        ? "bg-emerald-400/75 border border-emerald-300/15 hover:bg-emerald-400 hover:border-emerald-300/25"
                                        : "bg-emerald-400 border border-emerald-300/25 hover:bg-emerald-300 hover:border-emerald-200"
                            }`}
                          >
                            {/* Hover Tooltip card */}
                            {!day.isFuture && (
                              <div className={`absolute hidden group-hover:block z-50 w-48 bg-zinc-950 border border-dark-border text-zinc-200 text-[12px] p-2 shadow-xl rounded pointer-events-none col-span-1 ${dIdx < 3 ? "top-full mt-2" : "bottom-full mb-2"} ${wIdx < 8 ? "left-0 translate-x-0" : wIdx > 44 ? "right-0 translate-x-0" : "left-1/2 -translate-x-1/2"}`}>
                                <div className="font-semibold border-b border-dark-border/40 pb-1 mb-1 text-zinc-300">
                                  {day.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                </div>
                                <div className="space-y-0.5 font-mono">
                                  <p className="flex justify-between">
                                    <span>GitHub:</span>
                                    <span className={day.github > 0 ? "text-emerald-400" : "text-zinc-500"}>
                                      {day.github > 0 ? `${day.github} commits` : "0 commits"}
                                    </span>
                                  </p>
                                  <p className="flex justify-between">
                                    <span>CP Activity:</span>
                                    <span className={day.cpActivity > 0 ? "text-emerald-400" : "text-zinc-500"}>
                                      {day.cpActivity > 0 ? `${day.cpActivity} submissions` : "0 submissions"}
                                    </span>
                                  </p>
                                  <p className="flex justify-between">
                                    <span>CP Solved:</span>
                                    <span className={day.cpSolved > 0 ? "text-emerald-400" : "text-zinc-500"}>
                                      {day.cpSolved > 0 ? `${day.cpSolved} solved` : "0 solved"}
                                    </span>
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Stage description legend / notes */}
          <div className="mt-4 pt-3 border-t border-dark-border/40 text-[13px] text-zinc-500 leading-relaxed space-y-1">
            <p>
              Grid intensity colors represent combined daily activity volume (GitHub commits + CP/DSA platform submissions).
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
