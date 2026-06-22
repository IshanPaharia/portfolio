const fs = require("fs");
const path = require("path");

// Target file locations
const targetDir = path.join(__dirname, "../src/data");
const targetFile = path.join(targetDir, "live_calendar.json");

// ==========================================
// UTILITY: Retry wrapper with exponential backoff
// ==========================================
async function fetchWithRetry(url, options = {}, retries = 3, baseDelayMs = 1000) {
  let lastError;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, options);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res;
    } catch (err) {
      lastError = err;
      if (attempt < retries) {
        const delay = baseDelayMs * Math.pow(2, attempt - 1);
        console.warn(`  Attempt ${attempt}/${retries} failed for ${url}: ${err.message}. Retrying in ${delay}ms...`);
        await new Promise(r => setTimeout(r, delay));
      }
    }
  }
  throw lastError;
}

// ==========================================
// UTILITY: Timezone-safe date string for Asia/Kolkata
// ==========================================
function getKolkataDateString(date = new Date()) {
  // Use Intl.DateTimeFormat to get the correct date parts in Asia/Kolkata timezone
  // This avoids the re-parsing bug with new Date(toLocaleString(...))
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });
  return formatter.format(date); // returns YYYY-MM-DD
}

function getKolkataDateParts(date = new Date()) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    weekday: "short"
  });
  const parts = {};
  formatter.formatToParts(date).forEach(p => {
    parts[p.type] = p.value;
  });
  return parts;
}

async function main() {
  console.log("Starting live activity calendar data aggregation...");
  
  // 1. Read existing JSON if it exists to preserve previous values on failure
  let prevJson = null;
  const prevDaysMap = {};
  if (fs.existsSync(targetFile)) {
    try {
      const rawContent = fs.readFileSync(targetFile, "utf-8");
      
      // Detect and warn about merge conflict markers
      if (rawContent.includes("<<<<<<<") || rawContent.includes(">>>>>>>") || rawContent.includes("=======\n") || rawContent.includes("=======\r\n")) {
        console.warn("⚠️ Previous live_calendar.json contains git merge conflict markers! Discarding corrupt file and starting fresh.");
        prevJson = null;
      } else {
        prevJson = JSON.parse(rawContent);
        if (prevJson && prevJson.days) {
          prevJson.days.forEach(day => {
            prevDaysMap[day.date] = day;
          });
          console.log(`Loaded ${prevJson.days.length} days of previous calendar history to preserve state.`);
        }
      }
    } catch (e) {
      console.warn("Failed to parse previous live_calendar.json file:", e.message);
      prevJson = null;
    }
  }

  // Define initial status block
  const status = {
    github: "PENDING",
    leetcode: "PENDING",
    codeforces: "PENDING",
    codechef: "PENDING"
  };

  // Define initial totals block (will be populated/scraped)
  const totals = {
    commits: prevJson?.totals?.commits || 0,
    cpSolved: prevJson?.totals?.cpSolved || 0,
    cpActivity: prevJson?.totals?.cpActivity || 0
  };

  // Platform scrapers storage
  let githubCommits = {};
  let leetcodeActivity = {};
  let leetcodeSolvedTotal = prevJson?.totals?.leetcodeSolvedTotal || 213; // default fallback
  let codechefActivity = {};
  let codechefSolvedTotal = prevJson?.totals?.codechefSolvedTotal || 47; // default fallback
  let codeforcesActivity = {};
  let codeforcesSolved = {};
  let codeforcesSolvedTotal = prevJson?.totals?.codeforcesSolvedTotal || 0;

  // Initialize cpStats block from previous run (or fallbacks)
  let codeforcesRating = prevJson?.cpStats?.codeforces?.currentRating || 1336;
  let codeforcesMaxRating = prevJson?.cpStats?.codeforces?.maxRating || 1465;
  let codeforcesRank = prevJson?.cpStats?.codeforces?.rank || "specialist";

  let codechefRating = prevJson?.cpStats?.codechef?.currentRating || 1681;
  let codechefMaxRating = prevJson?.cpStats?.codechef?.maxRating || 1746;
  let codechefStars = prevJson?.cpStats?.codechef?.stars || "3★";

  let leetcodeRating = prevJson?.cpStats?.leetcode?.rating || 1853;
  let leetcodeMaxRating = prevJson?.cpStats?.leetcode?.maxRating || 1853;
  let leetcodeTitle = prevJson?.cpStats?.leetcode?.title || "Knight";

  // Track failures specifically for per-source logs
  const failures = [];

  // ==========================================
  // SOURCE 1: GitHub Scraping
  // ==========================================
  try {
    console.log("Fetching GitHub contributions page...");
    const res = await fetchWithRetry("https://github.com/users/IshanPaharia/contributions");
    const html = await res.text();
    
    // Map id -> date in an order-independent manner
    const idToDate = {};
    const tdRegex = /<td[\s\S]*?class="[^"]*?ContributionCalendar-day[^"]*"[\s\S]*?>/g;
    let tdMatch;
    while ((tdMatch = tdRegex.exec(html)) !== null) {
      const tdContent = tdMatch[0];
      const dateMatch = tdContent.match(/data-date="([^"]+)"/);
      const idMatch = tdContent.match(/id="([^"]+)"/);
      if (dateMatch && idMatch) {
        idToDate[idMatch[1]] = dateMatch[1];
      }
    }
    
    // Parse tooltips
    const tooltipRegex = /for="([^"]+)"[^>]*?>([^<]+?)<\/tool-tip>/g;
    let tooltipMatch;
    let ghCount = 0;
    while ((tooltipMatch = tooltipRegex.exec(html)) !== null) {
      const id = tooltipMatch[1];
      const text = tooltipMatch[2];
      const date = idToDate[id];
      if (date) {
        let count = 0;
        if (!text.includes("No contributions")) {
          const numMatch = text.match(/^([\d,]+)\s+/);
          if (numMatch) {
            count = parseInt(numMatch[1].replace(/,/g, ""), 10);
          }
        }
        githubCommits[date] = count;
        ghCount += count;
      }
    }
    console.log(`Successfully scraped GitHub daily commits. Total commits: ${ghCount}`);
    status.github = "OK";
  } catch (err) {
    console.error("❌ GitHub scraper failed:", err.message);
    failures.push(`github: ${err.message}`);
    status.github = `FAILED: ${err.message}`;
    // Retain previous values for this run
    if (prevJson && prevJson.days) {
      prevJson.days.forEach(day => {
        githubCommits[day.date] = day.github || 0;
      });
    }
  }

  // ==========================================
  // SOURCE 2: LeetCode GraphQL
  // ==========================================
  try {
    console.log("Querying LeetCode GraphQL API...");
    const query = {
      query: `
        query getUserProfile($username: String!) {
          matchedUser(username: $username) {
            userCalendar {
              submissionCalendar
            }
            submitStats {
              acSubmissionNum {
                difficulty
                count
              }
            }
          }
          userContestRanking(username: $username) {
            rating
            badge {
              name
            }
          }
          userContestRankingHistory(username: $username) {
            attended
            rating
          }
        }
      `,
      variables: { username: "DArkENDoom" }
    };
    
    const res = await fetchWithRetry("https://leetcode.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(query)
    });
    const json = await res.json();
    if (json.errors) throw new Error(json.errors[0].message);
    
    const matchedUser = json.data?.matchedUser;
    if (matchedUser) {
      // 2a. Submission stats (profile total solved)
      const acStats = matchedUser.submitStats?.acSubmissionNum;
      const totalSolved = acStats?.find(item => item.difficulty === "All")?.count || 213;
      leetcodeSolvedTotal = totalSolved;
      
      // 2b. Daily submissions activity
      const calendarStr = matchedUser.userCalendar?.submissionCalendar;
      if (calendarStr) {
        const calendar = JSON.parse(calendarStr);
        Object.entries(calendar).forEach(([timestampSec, count]) => {
          const timestampMs = parseInt(timestampSec, 10) * 1000;
          // Use timezone-safe date formatting
          const dateStr = getKolkataDateString(new Date(timestampMs));
          leetcodeActivity[dateStr] = (leetcodeActivity[dateStr] || 0) + count;
        });
      }

      // 2c. Ratings, Title details
      const ranking = json.data?.userContestRanking;
      const rankingHistory = json.data?.userContestRankingHistory;
      if (ranking) {
        leetcodeRating = Math.round(ranking.rating);
        leetcodeTitle = ranking.badge?.name || (
          leetcodeRating >= 2200
            ? "Guardian"
            : leetcodeRating >= 1850
              ? "Knight"
              : "Coder"
        );
      }
      if (rankingHistory && rankingHistory.length > 0) {
        const attended = rankingHistory.filter(h => h.attended);
        if (attended.length > 0) {
          leetcodeMaxRating = Math.round(Math.max(...attended.map(h => h.rating)));
        }
      }

      console.log(`Successfully fetched LeetCode stats. Solved: ${leetcodeSolvedTotal}, Rating: ${leetcodeRating}, MaxRating: ${leetcodeMaxRating}, Title: ${leetcodeTitle}`);
      status.leetcode = "OK";
    } else {
      throw new Error("No user profile found");
    }
  } catch (err) {
    console.error("❌ LeetCode GraphQL fetch failed:", err.message);
    failures.push(`leetcode: ${err.message}`);
    status.leetcode = `FAILED: ${err.message}`;
    // Retain previous values
    if (prevJson && prevJson.days) {
      prevJson.days.forEach(day => {
        leetcodeActivity[day.date] = day.leetcodeActivity || 0;
      });
    }
  }

  // ==========================================
  // SOURCE 3: Codeforces REST API
  // ==========================================
  try {
    console.log("Fetching Codeforces submissions...");
    const res = await fetchWithRetry("https://codeforces.com/api/user.status?handle=DArkENDoom");
    const json = await res.json();
    
    if (json && json.status === "OK" && json.result) {
      const submissions = json.result;
      // Sort submissions oldest first to track unique solves chronologically
      const sortedSubmissions = submissions.slice().reverse();
      const solvedProblems = new Set();
      
      sortedSubmissions.forEach(sub => {
        const dateStr = getKolkataDateString(new Date(sub.creationTimeSeconds * 1000));
        codeforcesActivity[dateStr] = (codeforcesActivity[dateStr] || 0) + 1;
        
        if (sub.verdict === "OK") {
          const problemId = `${sub.problem.contestId || ""}-${sub.problem.index || ""}-${sub.problem.name}`;
          if (!solvedProblems.has(problemId)) {
            solvedProblems.add(problemId);
            codeforcesSolved[dateStr] = (codeforcesSolved[dateStr] || 0) + 1;
          }
        }
      });
      codeforcesSolvedTotal = solvedProblems.size;
      
      // Fetch Codeforces rating/info statically
      try {
        console.log("Fetching Codeforces user info...");
        const infoRes = await fetchWithRetry("https://codeforces.com/api/user.info?handles=DArkENDoom");
        const infoJson = await infoRes.json();
        if (infoJson.status === "OK" && infoJson.result && infoJson.result.length > 0) {
          const user = infoJson.result[0];
          codeforcesRating = user.rating || codeforcesRating;
          codeforcesMaxRating = user.maxRating || codeforcesMaxRating;
          codeforcesRank = user.rank || codeforcesRank;
        }
      } catch (infoErr) {
        console.warn("CF user info fetch failed, using fallback:", infoErr.message);
      }

      console.log(`Successfully fetched Codeforces stats. Unique Solved: ${codeforcesSolvedTotal}, Rating: ${codeforcesRating}, Rank: ${codeforcesRank}`);
      status.codeforces = "OK";
    } else {
      throw new Error("Invalid Codeforces API format");
    }
  } catch (err) {
    console.error("❌ Codeforces API fetch failed:", err.message);
    failures.push(`codeforces: ${err.message}`);
    status.codeforces = `FAILED: ${err.message}`;
    // Retain previous values
    if (prevJson && prevJson.days) {
      prevJson.days.forEach(day => {
        codeforcesActivity[day.date] = day.codeforcesActivity || 0;
        codeforcesSolved[day.date] = day.codeforcesSolved || 0;
      });
    }
  }

  // ==========================================
  // SOURCE 4: CodeChef Scraping
  // ==========================================
  try {
    console.log("Fetching CodeChef profile page...");
    const res = await fetchWithRetry("https://www.codechef.com/users/darkendoom", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });
    const html = await res.text();
    
    // Scrape daily submissions
    const statsMatch = html.match(/var\s+userDailySubmissionsStats\s*=\s*(\[[\s\S]*?\]);/);
    if (!statsMatch) {
      throw new Error("Could not find userDailySubmissionsStats variable in HTML");
    }
    
    let stats;
    try {
      stats = JSON.parse(statsMatch[1]);
    } catch (parseErr) {
      throw new Error(`Failed to parse userDailySubmissionsStats JSON: ${parseErr.message}`);
    }

    if (!Array.isArray(stats)) {
      throw new Error("userDailySubmissionsStats is not an array");
    }

    stats.forEach(item => {
      // item.date is formatted as "YYYY-M-D"
      if (item && item.date && item.value !== undefined) {
        const parts = item.date.split("-");
        const normalizedDate = `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
        codechefActivity[normalizedDate] = item.value;
      }
    });
    
    // Scrape total solved
    const solvedMatch = html.match(/Total Problems Solved:\s*(\d+)/i);
    if (solvedMatch) {
      codechefSolvedTotal = parseInt(solvedMatch[1], 10);
    }

    // Scrape ratings info statically
    const ratingMatch = html.match(/class="rating-number">([^<]+)/);
    const starSection = html.match(/class="rating-star">([\s\S]*?)<\/div>/);
    const starCount = starSection ? (starSection[1].match(/&#9733;/g) || []).length : 0;
    const maxMatch = html.match(/Highest Rating\s*(\d+)/i) || html.match(/\((?:Max\s+)?Rating\s+(\d+)\)/i);

    if (ratingMatch) codechefRating = parseInt(ratingMatch[1].trim(), 10);
    if (maxMatch) codechefMaxRating = parseInt(maxMatch[1].trim(), 10);
    if (starCount > 0) codechefStars = `${starCount}★`;

    console.log(`Successfully scraped CodeChef stats. Total Solved: ${codechefSolvedTotal}, Rating: ${codechefRating}, Stars: ${codechefStars}`);
    status.codechef = "OK";
  } catch (err) {
    console.error("❌ CodeChef scraper failed:", err.message);
    failures.push(`codechef: ${err.message}`);
    status.codechef = `FAILED: ${err.message}`;
    // Retain previous values
    if (prevJson && prevJson.days) {
      prevJson.days.forEach(day => {
        codechefActivity[day.date] = day.codechefActivity || 0;
      });
    }
  }

  // ==========================================
  // VALIDATION: Fail hard if ALL sources failed and no previous data exists
  // ==========================================
  if (failures.length === 4 && !prevJson) {
    console.error("❌ FATAL: All 4 data sources failed and no previous data exists to fall back on. Aborting.");
    process.exit(1);
  }

  // ==========================================
  // CONSOLIDATION AND SCHEMA COMPILATION
  // ==========================================
  // Generate a list of exactly 371 days ending today in Asia/Kolkata timezone
  // Use timezone-safe date computation throughout
  const todayStr = getKolkataDateString();
  const todayParts = getKolkataDateParts();
  console.log(`Today in Asia/Kolkata: ${todayStr}`);
  
  // Build dates using UTC to avoid DST/timezone issues in the loop
  // Parse todayStr (YYYY-MM-DD) into a UTC-midnight date for deterministic iteration
  const [todayY, todayM, todayD] = todayStr.split("-").map(Number);
  const endDateUTC = Date.UTC(todayY, todayM - 1, todayD);
  
  // Go back 364 days, then align to Sunday
  const startCandidateUTC = endDateUTC - 364 * 86400000;
  const startCandidateDay = new Date(startCandidateUTC).getUTCDay(); // 0=Sunday
  const startDateUTC = startCandidateUTC - startCandidateDay * 86400000;
  
  // Calculate how many days from startDate to endDate (inclusive)
  const totalDays = Math.round((endDateUTC - startDateUTC) / 86400000) + 1;
  
  const days = [];
  let totalCommits = 0;
  let totalCpActivity = 0;
  let totalCpSolved = 0;
  
  for (let i = 0; i < totalDays; i++) {
    const dayUTC = startDateUTC + i * 86400000;
    const d = new Date(dayUTC);
    const yyyy = d.getUTCFullYear();
    const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(d.getUTCDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;
    
    // Fetch values for this date
    const ghCommits = githubCommits[dateStr] || 0;
    const lcAct = leetcodeActivity[dateStr] || 0;
    const cfAct = codeforcesActivity[dateStr] || 0;
    const cfSolved = codeforcesSolved[dateStr] || 0;
    const ccAct = codechefActivity[dateStr] || 0;
    
    const cpAct = lcAct + cfAct + ccAct;
    const cpSlvd = cfSolved; // LeetCode/CodeChef daily solved are 0; only Codeforces daily solved is reliable
    const totalAct = ghCommits + cpAct;
    
    // Accumulate total statistics
    totalCommits += ghCommits;
    totalCpActivity += cpAct;
    totalCpSolved += cpSlvd;
    
    // Determine grid level intensity based on combined activity volume
    let level = 0;
    if (totalAct >= 10) level = 4;
    else if (totalAct >= 6) level = 3;
    else if (totalAct >= 3) level = 2;
    else if (totalAct >= 1) level = 1;
    
    days.push({
      date: dateStr,
      github: ghCommits,
      leetcodeActivity: lcAct,
      leetcodeSolved: 0, // daily LeetCode solved should stay 0 unless reliable solved-by-date data exists
      codeforcesActivity: cfAct,
      codeforcesSolved: cfSolved,
      codechefActivity: ccAct,
      codechefSolved: 0, // daily CodeChef solved should stay 0 unless reliable solved-by-date data exists
      commits: ghCommits,
      cpActivity: cpAct,
      cpSolved: cpSlvd,
      totalActivity: totalAct,
      level
    });
  }

  // Compute final totals
  totals.commits = totalCommits;
  totals.cpActivity = totalCpActivity;
  totals.cpSolved = leetcodeSolvedTotal + codeforcesSolvedTotal + codechefSolvedTotal;

  // Add internal caching markers for preserving total metrics on API failures
  totals.leetcodeSolvedTotal = leetcodeSolvedTotal;
  totals.codechefSolvedTotal = codechefSolvedTotal;
  totals.codeforcesSolvedTotal = codeforcesSolvedTotal;

  // Generate ISO updatedAt timestamp in Asia/Kolkata offset (+05:30)
  const offset = 5.5 * 60 * 60 * 1000;
  const kolkataUTC = new Date(new Date().getTime() + offset);
  const updatedAt = kolkataUTC.toISOString().replace("Z", "+05:30");

  const cpStats = {
    codeforces: {
      currentRating: codeforcesRating,
      maxRating: codeforcesMaxRating,
      rank: codeforcesRank
    },
    codechef: {
      currentRating: codechefRating,
      maxRating: codechefMaxRating,
      stars: codechefStars
    },
    leetcode: {
      solved: leetcodeSolvedTotal,
      rating: leetcodeRating,
      maxRating: leetcodeMaxRating,
      title: leetcodeTitle
    }
  };

  const output = {
    updatedAt,
    timezone: "Asia/Kolkata",
    status,
    totals,
    cpStats,
    days
  };

  // Ensure directories exist and save JSON
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  fs.writeFileSync(targetFile, JSON.stringify(output, null, 2), "utf-8");
  console.log(`Successfully wrote live calendar data to: ${targetFile}`);
  console.log(`Date range: ${days[0]?.date} to ${days[days.length - 1]?.date} (${days.length} days)`);
  console.log(`Consolidated Totals -> Commits: ${totals.commits}, CP Solved: ${totals.cpSolved}, CP Activity: ${totals.cpActivity}`);
  
  if (failures.length > 0) {
    console.warn("\n⚠️ Script completed with failures:\n - " + failures.join("\n - "));
    // Exit with error if ALL sources failed (data is fully stale)
    if (failures.length === 4) {
      console.error("❌ All data sources failed. Output is based entirely on previous/fallback data.");
      process.exit(1);
    }
  } else {
    console.log("\n✓ Script completed successfully with all sources updated!");
  }
}

main().catch(err => {
  console.error("Fatal exception during script execution:", err);
  process.exit(1);
});
