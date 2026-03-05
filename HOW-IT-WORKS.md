
# How This Thing Works

So you built this Telangana Congress accountability tracker and you want to remember how everything fits together. Cool. Here's the full breakdown, like I'm sitting next to you explaining it over chai.


## The Big Picture

This is a Next.js website that tracks how the Congress government in Telangana is doing. It pulls data from JSON files you maintain, aggregates live news from RSS feeds, and presents everything in a dark, techy dashboard. Think of it like a scoreboard for the government.

The site is deployed on Vercel, uses React under the hood, and is styled with Tailwind CSS. The whole vibe is a surveillance/intelligence dashboard with neon glows, monospace fonts (JetBrains Mono), and dark backgrounds.


## Tech Stack

Here's what's running under the hood:

- Next.js 16 with App Router (the newer folder-based routing, not the old pages/ style)
- React 19
- TypeScript everywhere
- Tailwind CSS 4
- Recharts for the pie charts and bar graphs on the budget page
- Vercel Analytics for tracking visitors
- No database. Seriously. Everything is JSON files sitting in a /data folder


## Where Does the Data Come From?

All the data lives in JSON files inside the data/ folder. There's no database, no CMS, no fancy backend. You literally open a JSON file, edit it, push to GitHub, and Vercel redeploys. That's it.

Here's what each file holds:

guarantees.json is the big one. It has all 36+ promises the Congress party made, including the 6 main guarantees (Mahalakshmi, Rythu Bharosa, Gruha Jyothi, Indiramma Indlu, Yuva Vikasam, Cheyutha). Each promise has a status (fulfilled, partially fulfilled, in progress, not started, or broken), a progress percentage, what was promised vs what was delivered, key metrics, and source URLs.

budget.json tracks how much money was allocated to each scheme and how much was actually spent. Simple stuff like "Rythu Bharosa got 15,075 crore but only 12,500 was spent."

controversies.json lists all the controversies with estimated costs, what happened, what the government said, and what the data actually shows. Things like Gandhi Sarovar, the Messi match, Formula E, etc.

comparison.json has head-to-head numbers between the Congress government and the previous BRS government. Metrics like per capita income growth, farmer suicides, government jobs filled, budget surplus, etc.

welfare-scorecard.json categorizes welfare schemes into three tiers: fully implemented, partially implemented, and zero implementation.

Then there are sector-specific files (agriculture.json, education.json, employment.json, fiscal.json, realestate.json) that have detailed metrics for each sector.

districts.json has district-level data, cm-profile.json has the Chief Minister's bio and asset info, sources.json is a directory of all data sources with credibility ratings, and feedback.json stores user feedback submissions.


## How Data Gets Loaded

There's a file called lib/data.ts that acts as the middleman between the JSON files and the components. Instead of components directly importing JSON, they call functions like:

- getGuarantees() loads guarantees.json
- getBudget() loads budget.json
- getProjects() loads projects.json
- getComparison() loads comparison.json
- getControversies() loads controversies.json
- getWelfareScorecard() loads welfare-scorecard.json

Then there are helper functions that crunch numbers:

- getPromiseStats() counts how many promises are fulfilled, partial, broken, etc.
- getBudgetStats() calculates total allocation, total spent, and utilization percentage
- getOverallGrade() averages the progress of the 6 main guarantees and gives a letter grade (A through F)
- getDaysInPower() calculates how many days since December 7, 2023 (when they took office)
- getControversyCost() adds up the estimated costs of all controversies

These functions are called from the pages, which are server components, so all this runs at build time or on the server. The client gets pre-rendered HTML.


## How the News Feed Works

This is probably the most complex part. The site aggregates news from 8 different RSS feeds to show a live "Latest Developments" section.

The feeds are defined in lib/constants.ts:

1. Google News (English) searching "Telangana Congress government"
2. Google News (Telugu) searching the same in Telugu
3. Google News (Governance) searching "Telangana government policy scheme budget"
4. Google News (CM) searching "Revanth Reddy Telangana"
5. Telangana Today's main RSS feed
6. The Hindu's Telangana section
7. The Hindu's Hyderabad city section
8. Indian Express Hyderabad section

When someone visits the timeline page (or the dashboard), the app calls /api/news which triggers lib/rss.ts. Here's what happens step by step:

First, it fetches all 8 feeds in parallel using Promise.allSettled (so if one feed is down, the others still work). Each feed returns XML, which gets parsed with a simple regex-based XML parser (no heavy library needed). It pulls out the title, link, and publish date from each item tag in the XML.

Then comes the filtering, which has two layers:

Layer 1 is isTelanganRelated(). This checks if the article title mentions anything related to Telangana. It looks for keywords like "telangana", "hyderabad", "revanth", "congress", "brs", district names (warangal, karimnagar, khammam, etc.), scheme names (mahalakshmi, rythu bharosa, gruha jyothi), and government bodies (tspsc, tsrtc, hydraa). It also checks Telugu script keywords. If the title doesn't match any of these, the article is thrown out.

Layer 2 is isGovernanceRelated(). This is the newer filter that was added because the first layer was letting through random Telangana news like volleyball tournaments, drowning incidents, and drug arrests. This filter does two things:

First, it blocks articles that match non-governance topics. If the title contains words like "cricket", "ipl", "tollywood", "movie", "drowning", "road accident", "mdma", "weather forecast", "exam result" etc., it's immediately rejected.

Then, it requires at least one governance keyword to be present. Things like "government", "congress", "minister", "policy", "scheme", "budget", "election", "welfare", "crore", specific scheme names, government body names, or accountability terms like "scam", "corruption", "investigation". If none of these appear, the article doesn't make the cut.

An article has to pass BOTH filters. So it needs to be about Telangana AND about governance/politics. A headline like "Telangana volleyball team wins nationals" gets caught because it passes the first filter (mentions Telangana) but fails the second (no governance keyword, and "sports" is in the block list).

After filtering, articles get categorized into: controversy, budget, promise, development, policy, or general. This is based on keyword matching in categorizeNews().

Finally, everything is sorted by date (newest first), deduplicated by comparing the first 50 characters of titles (to catch duplicate stories from different sources), and capped at 30 items.

The whole thing has a 30-minute cache (ISR), so it doesn't hammer the RSS feeds on every page view. On the frontend, the TimelineWidget auto-refreshes every 5 minutes.


## How the Grading System Works

The dashboard shows a letter grade (A through F) for the government. Here's how it's calculated:

It only looks at the 6 main guarantees (category: "guarantee"), not the other manifesto promises. Each guarantee has a progress percentage (0 to 100). The grade is based on the average of all 6 percentages.

80 to 100% average = A
60 to 79% = B
40 to 59% = C
20 to 39% = D
0 to 19% = F

There's an expandable section on the dashboard ("How is the grade calculated?") that shows the exact formula with each guarantee's score.


## The Pages

Here's what each page does:

/ (Dashboard) is the main page. It shows the stats bar (days in power, fulfilled/partial/broken counts, budget utilization, grade), the cost of controversies banner, guarantee cards, budget donut chart, latest news, development projects, and comparison metrics. Everything at a glance.

/promises shows all 36+ promises as expandable cards. You can filter by status. Each card shows the promise name in English and Telugu, status badge, progress bar, what was promised vs delivered, key metrics table, and source links.

/budget has bar charts and pie charts breaking down the 2024-25 budget. Shows allocated vs spent for each scheme with utilization percentages.

/timeline is the full news feed. It has filter buttons for categories (all, controversy, budget, promise, development, policy) and shows articles with source badges. Auto-refreshes every 5 minutes.

/controversies lists all controversies with expandable details. Each one shows what happened, the government's response, and what the data actually shows. The CostCounter banner at the top sums up the estimated total cost.

/compare has two tables. One compares Congress vs the previous BRS government on metrics like per capita income growth, farmer suicides, government jobs, etc. Some metrics include context subtitles (shown in yellow italic) to explain why numbers might be misleading.

/sectors breaks down performance by sector: agriculture, education, employment, fiscal health, real estate. Each sector has specific metrics and narrative analysis.

/development tracks infrastructure projects with their status (announced, in progress, stalled, completed, cancelled).

/districts has district-level breakdowns.

/cm-profile has the Chief Minister's biographical data, assets, and background.

/sources is a directory of all data sources used, with credibility badges (official, established, independent, social).

/admin is the password-protected admin panel. More on that below.


## The Admin Panel

The admin panel lives at /admin and is protected by a password. The default password is "telangana2024-2029" but it can be overridden with the ADMIN_PASSWORD environment variable on Vercel.

Authentication works through a server-side API. When you enter the password, it sends a POST request to /api/admin/auth which checks it against the stored password and returns success or a 401 error. This is better than the old client-side check because the password never sits in the frontend code.

Once logged in, you can:
- View all user feedback submissions (name, type, message, timestamp)
- Edit promise statuses (dropdown for status, slider for progress, text field for "delivered" description)
- Save changes (writes directly to guarantees.json)

One thing to remember: on Vercel's serverless platform, file writes to guarantees.json will work temporarily but get wiped on the next deploy. So the admin panel is more useful during development or if you set up persistent storage later.


## The Feedback Widget

There's a floating chat button in the bottom-right corner of every page. When you click it, a panel slides up where users can:

- Pick a type: Feedback, Feature Request, or Bug Report
- Enter their name (required)
- Enter email (optional)
- Write a message (required, up to 2000 characters)
- Submit

The submission goes to POST /api/feedback, which validates the input, generates a unique ID and timestamp, and appends it to data/feedback.json. The button is only visible when the panel is closed (it hides when the form is open so it doesn't look weird).

Same caveat as admin: feedback.json is ephemeral on Vercel's serverless. Works great locally though.


## The Styling

The whole site uses a dark theme with a cyberpunk/surveillance aesthetic. The color palette is defined as CSS custom properties in globals.css:

- Background: very dark navy (#070a0e)
- Cards: slightly lighter dark (#111820)
- Borders: subtle blue-gray (#1e2a3a)
- Text: light gray (#e6edf3) for primary, dimmer for secondary/muted
- Accents: neon red (#ff3333), green (#00ff88), yellow (#ffcc00), blue (#0099ff), pink (#ff0055)

Key visual effects:

glow-card is a class that gives cards a subtle border glow on hover. It transitions from the default border color to a blue glow.

neon-text-[color] classes add a text-shadow glow effect in the corresponding color. So neon-text-red makes text glow red, neon-text-green glows green, etc.

pulse-live is the pulsing red dot animation used for the "LIVE" indicator in the header.

Everything uses the JetBrains Mono font (monospace), which gives it that terminal/hacker feel. The font is loaded from Google Fonts with weights from 300 to 700.


## The API Routes

There are 4 API routes:

POST /api/admin/auth checks the admin password. Returns {success: true} or 401.

POST /api/admin/promises saves updated promise data. Requires the password in the request body along with the data array. Writes to data/guarantees.json.

GET /api/feedback returns all feedback entries sorted newest first.

POST /api/feedback accepts a feedback submission with name, type, and message. Validates input, generates an ID, appends to feedback.json.

GET /api/news fetches, filters, and returns aggregated news. Accepts a ?limit= query parameter (defaults to 30). Has 30-minute ISR caching.


## How Everything Connects

Here's the flow:

You edit JSON files in the data/ folder. These get loaded by functions in lib/data.ts. Pages import those functions and pass the data to components as props. Components render the UI.

For news, the flow is different: RSS feeds (defined in lib/constants.ts) get fetched by lib/rss.ts, which is called by the /api/news route, which is called by frontend components (TimelineWidget) using fetch().

User interactions (feedback, admin edits) go through API routes that read/write to JSON files.

The whole thing gets built and deployed to Vercel when you push to GitHub. Most pages are statically generated at build time. The news API is the only truly dynamic part.


## Important Files to Know

If you need to update data, these are the files you'll touch:

- data/guarantees.json for promise statuses and progress
- data/budget.json for budget numbers
- data/controversies.json for adding new controversies
- data/comparison.json for BRS vs Congress metrics
- data/welfare-scorecard.json for scheme implementation tiers

If you need to change how things work:

- lib/rss.ts for news filtering logic (the isGovernanceRelated and isTelanganRelated functions)
- lib/constants.ts for RSS feed URLs, status colors, and category labels
- lib/data.ts for how data gets loaded and aggregated
- lib/types.ts for TypeScript interfaces (if you add new fields)

If you need to change how things look:

- app/globals.css for colors, animations, and global styles
- Individual component files in components/ for specific UI changes
- app/layout.tsx for the overall page structure (header, footer, feedback widget)


## Deployment

The site is on Vercel (Pro plan). Push to GitHub and it auto-deploys.

Two domains point to it:
- whatcongressisdoingintelangana.com
- telanganatracker.in

Both are configured in Vercel with DNS records pointing from Hostinger (where the domains were bought).

Vercel Analytics is enabled for visitor tracking. The Analytics component is imported in app/layout.tsx.

The ADMIN_PASSWORD environment variable should be set in Vercel's project settings for production. If it's not set, it defaults to "telangana2024-2029".


## Things to Keep in Mind

The JSON file storage is ephemeral on Vercel. Any writes (feedback, admin edits) will be lost on the next deployment. For a more permanent setup, you'd want to add a database (like Supabase, PlanetScale, or even a simple SQLite with Turso).

The news filtering is keyword-based, not AI-powered. It works well for obvious cases but can miss edge cases. If you notice irrelevant news getting through, add the offending keyword to the blockKeywords list in isGovernanceRelated() in lib/rss.ts.

Google News RSS feeds sometimes return very few items (1 or 2). That's normal. Telangana Today is your biggest source at 500+ items per feed. The two-pass filter trims that down to the governance-relevant ones.

The grading system only uses the 6 main guarantees, not all promises. This is intentional because the guarantees are the flagship commitments the party ran on.

All data has source URLs. This is important for credibility. When you add new data, always include a sourceUrl pointing to the original government document, news article, or official report.
