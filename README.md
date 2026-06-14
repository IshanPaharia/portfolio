# 🦊 Ishan Paharia

> I architect resilient backend systems and pair them with clean, functional frontends.

[![GitHub Profile](https://img.shields.io/badge/github-profile-181717?style=flat&logo=github)](https://github.com/IshanPaharia)
[![LinkedIn Connect](https://img.shields.io/badge/linkedin-connect-0A66C2?style=flat&logo=linkedin)](https://linkedin.com/in/ishanpaharia)
[![Codeforces Rating](https://img.shields.io/badge/Codeforces-Specialist%20(1465%20max)-brown?style=flat&logo=codeforces)](https://codeforces.com/profile/DArkENDoom)
[![LeetCode Rating](https://img.shields.io/badge/LeetCode-Knight%20(1853)-orange?style=flat&logo=leetcode)](https://leetcode.com/DArkENDoom/)
[![CodeChef Rating](https://img.shields.io/badge/CodeChef-3★%20(1746%20max)-green?style=flat&logo=codechef)](https://www.codechef.com/users/darkendoom)

---

I'm a final-year Computer Science student at **The LNM Institute of Information Technology, Jaipur (2023 - 2027)**, specializing in backend engineering and systems design. My focus is on building resilient, real-time systems: horizontally-scaled WebSocket clustering, Redis write-back caching pipelines, and transactional database flows. Outside of building software, I spend my time on competitive programming.

## 🛠️ Tech Stack

- **Languages:** `C++` | `TypeScript` | `JavaScript` | `Python` | `C`
- **Backend/Systems:** `Node.js` | `Express.js` | `Django` | `FastAPI`
- **Databases/Caching:** `PostgreSQL` | `Redis` | `MongoDB` | `MySQL`
- **Frontend:** `React` | `Next.js` | `Tailwind CSS`
- **Utilities/DevOps:** `Docker` | `Git` | `Linux` | `Nginx`

## 🚀 Key Projects

### 🎨 [Pixnette](https://www.pixnette.site/)
*Real-time collaborative pixel canvas with horizontally-scaled WebSocket infrastructure.*
- **Scale:** Balanced horizontal scaling across multiple Node.js instances behind an Nginx round-robin reverse proxy.
- **Data Integrity:** Designed a Redis write-back pipeline with an ordered event queue and atomic flushes to guarantee PostgreSQL data consistency.
- **Stack:** React, Tailwind CSS, Node.js, Express, PostgreSQL, Socket.io, Redis, Docker, Nginx

### 📚 [CoursessionAI](https://www.coursessionai.site/)
*AI learning platform converting YouTube playlists into structured courses with summaries, quizzes, and an AI tutor.*
- **Data Flow:** Designed an atomic playlist ingestion pipeline using Neon's WebSocket client for transactional DB writes.
- **Stack:** React, Tailwind CSS, Node.js, Express, PostgreSQL, Clerk Auth

---

## 💻 Setup & Development

This is a Next.js web application incorporating an AI assistant chat console and a live contributions/achievements dashboard.

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create a `.env.local` file in the root directory:
```env
OPENAI_API_KEY=your_openai_api_key_here
# Add other keys if required by your services
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### 4. Fetch Live CP/DSA Stats
To scrape and update the live contributions map and competitive programming ratings from LeetCode, Codeforces, and CodeChef:
```bash
node scripts/update-activity.js
```

### 5. Build for Production
```bash
npm run build
npm start
```
