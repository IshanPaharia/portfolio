# No-API Chat Portfolio Plan

## Goal Description
Build a premium, highly interactive Next.js portfolio website using a dual-mode interface: a chat-style first screen and a minimal structured portfolio view inspired by the reference site [saddine.com](https://saddine.com/).
The chat functions as a deterministic FAQ assistant using client-side fuzzy matching (Fuse.js) against a local `profile.json` file. 
The portfolio view replicates the aesthetic of [saddine.com](https://saddine.com/) (excluding the Blog and GitHub Contributions sections) using a sleek dark layout, a centered narrow column, dot matrix/grid details, expandable project/experience sections, tech stack grids, and a "Current Interests" section.
Tailwind CSS will be used for styling.
All code will be written strictly in **JavaScript** (using `.js` and `.jsx` extensions).
For each step, the UI and styling will be generated, leaving the core JavaScript business logic as a learning challenge for the user.

---

## Technical Specifications & Choices

- **Next.js**: Latest version (App Router, **strictly JavaScript**).
- **Styling**: Tailwind CSS (latest v4/v3 auto-configured by Next.js).
- **Icons**: `react-icons` (specifically the Simple Icons and Lucide collections).
- **Fuzzy Matching**: `fuse.js` (latest version) client-side.
- **Animations**: `framer-motion` (latest version).
- **Features Configuration**:
  - **GitHub Contributions**: Skipped.
  - **Reading Now**: Replaced with **Current Interests** (dynamic card at the bottom).
  - **Header Nav**: Clicking navigation items in Chat Mode switches to Portfolio Mode and scrolls to the selected section.

---

## Challenge Scoping & Pre-Configurations
To ensure the learning challenges are educational and not frustratingly brittle:
1. **Fuse.js Tuning**: We will provide a pre-tuned Fuse.js options object (setting `threshold: 0.35` for balanced matching, `keys: ["triggers", "question"]`) in the code. The user's challenge will be to initialize the instance, parse input, and format the search results.
2. **Scroll & Mode Syncing**: We will write the core custom hooks and intersection observers for scroll tracking. The user's challenge will be mapping the active headers to state and persisting options inside `localStorage`.
3. **Expand & Copy State**: The UI layout will include interactive state hooks. We will provide helper skeletons for the `navigator.clipboard` calls. The user's challenge will be managing the temporary copy animation state.

---

## Visual Design Reference (saddine.com Inspired with Tailwind CSS)
- **Palette**: Pitch-black background (`bg-black`), dark gray card backings (`bg-[#0d0d0d]`), subtle gray borders (`border-[#1a1a1a]`), cyber-cyan/violet text accents, and crisp white text.
- **Header**: Centered floating/sticky pill navigation with transition effects.
- **Details**: Subtle dot matrix background accents, active status indicator (glowing green dot).
- **Interactions**:
  - Click-to-expand list items for Projects and Experience.
  - Hover effects on tech stack boxes (revealing colors or glowing borders).
  - Framer Motion page switch between Chat and Portfolio.
  - "Copy to clipboard" animation for the email card.

---

## Proposed Changes

### Component 1: Setup & Theme Core

#### [NEW] [tailwind.config.js](file:///d:/Projects/portfolio/tailwind.config.js) / [global.css](file:///d:/Projects/portfolio/src/app/global.css)
- Configures custom grid backgrounds, fonts, and dark mode values.
- Core typography and standard resets.

#### [NEW] [layout.js](file:///d:/Projects/portfolio/src/app/layout.js)
- Sets up standard head metadata, links Google Fonts (Inter/Outfit), and wraps children.

---

### Component 2: Profile Data

#### [NEW] [profile.json](file:///d:/Projects/portfolio/src/data/profile.json)
- Store structured portfolio data (About, Experience list, Project list, Stack list, Interests list, and Chat database with aliases).

---

### Component 3: Chat Engine & Fuzzy Matcher

#### [NEW] [chatEngine.js](file:///d:/Projects/portfolio/src/lib/chatEngine.js)
- Helper structure for fuzzy text search.
- **[USER CHALLENGE]**: Initialize `Fuse` with pre-tuned parameters and write the matching function to return answers, optional payload, or suggestions.

---

### Component 4: Interactive Layout & Transitions

#### [NEW] [page.js](file:///d:/Projects/portfolio/src/app/page.js)
- Define layout structure, active view state (`chat` vs `portfolio`), and header nav controls.
- **[USER CHALLENGE]**: Wire up `localStorage` syncing and navigate-and-scroll triggers.

#### [NEW] [ChatExperience.jsx](file:///d:/Projects/portfolio/src/components/ChatExperience.jsx)
- UI layout for the chat window, message list, chip suggestions, input bar, and email contact prompt fallback.
- **[USER CHALLENGE]**: Build out state transitions for rendering chat messages (simulating typing latency).

#### [NEW] [PortfolioView.jsx](file:///d:/Projects/portfolio/src/components/PortfolioView.jsx)
- Column layout matching [saddine.com](https://saddine.com/) sections: Header/Intro, Projects (expandable list), Experience (expandable list), Stack, and Connect/Copy-Email cards, and Current Interests.
- **[USER CHALLENGE]**: Wire click handlers to toggle expansion IDs and manage clipboard tooltip delays.

---

## Verification Plan

### Automated Tests
- Build verification using:
  ```bash
  npm run build
  ```

### Manual Verification
1. Verify that clicking nav links in Chat mode switches views and scrolls to the selected section.
2. Verify that clicking projects/experience list items expands/collapses detailed content smoothly.
3. Test that copying the email address shows a success tooltip/checkmark.
4. Verify mobile layouts and dot matrix background rendering.
