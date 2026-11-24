// DEMO DATA: stands in for the responses of the MCP servers we will build.
// Each export maps to one server. Swap these for real MCP calls later.

// ---- 1. coding-profiles-mcp (LeetCode, HackerRank, Codeforces, ...) ----
export const codingMcp = {
  server: 'coding-profiles-mcp',
  sites: [
    { name: 'LeetCode', label: 'Solved', done: 212, total: 400, color: '#d9573a' },
    { name: 'HackerRank', label: 'Badges earned', done: 87, total: 150, color: '#6aaa3a' },
    { name: 'Codeforces', label: 'Contests', done: 34, total: 100, color: '#566a94' },
  ],
  topics: [
    ['Arrays & hashing', 84, '#6aaa3a'], ['Strings', 76, '#7ba3a5'], ['Trees', 58, '#566a94'],
    ['Dynamic programming', 31, '#e0a43a'], ['Graphs', 18, '#d9573a'],
  ],
  weekly: [12, 18, 9, 26, 31, 22],
  recent: [
    ['Course Schedule II', 'Medium', 'LeetCode', '2h ago'],
    ['Number of Islands', 'Medium', 'LeetCode', 'Yesterday'],
    ['Dijkstra Shortest Path', 'Medium', 'HackerRank', '2 days ago'],
    ['Two Sum II', 'Easy', 'LeetCode', '3 days ago'],
  ],
}
export const weakTopics = [...codingMcp.topics].sort((a, b) => a[1] - b[1]).slice(0, 2)

// ---- 2. interview-process-mcp (rounds and style per company) ----
const R = (name, type, mins, focus) => ({ name, type, mins, focus })
export const processMcp = {
  server: 'interview-process-mcp',
  companies: {
    Google: {
      tip: 'Expect follow-ups that change the constraints mid-problem. Thinking out loud is scored as much as the final code.',
      rounds: [R('Recruiter call', 'behavioral', 30, 'Motivation and background'), R('Phone screen', 'coding', 45, 'One medium problem in a shared editor'), R('Onsite · Coding', 'coding', 45, 'Graphs, trees and strings'), R('Onsite · System design', 'design', 45, 'Scale and trade-offs'), R('Googleyness', 'behavioral', 45, 'Collaboration and ambiguity'), R('Team match', 'behavioral', 30, 'Fit with a hiring team')],
    },
    Amazon: {
      tip: 'Every answer is mapped to a Leadership Principle. Bring numbers and own the result.',
      rounds: [R('Online assessment', 'coding', 90, 'Two coding problems plus work style'), R('Phone screen', 'coding', 60, 'Coding and one principle question'), R('Loop · Coding', 'coding', 60, 'Data structures with edge cases'), R('Loop · System design', 'design', 60, 'Reliability at peak traffic'), R('Bar raiser', 'behavioral', 60, 'Leadership Principles deep dive')],
    },
    Stripe: {
      tip: 'Practical, close-to-production problems. Clean code, clear naming and API sense matter.',
      rounds: [R('Recruiter call', 'behavioral', 30, 'Interest in payments and users'), R('Practical coding', 'coding', 60, 'Build a small working feature'), R('Integration round', 'coding', 60, 'Work with an existing codebase'), R('System design', 'design', 60, 'Money-safe, retryable systems'), R('Values interview', 'behavioral', 45, 'Rigor, users and ownership')],
    },
    Microsoft: {
      tip: 'Friendly but thorough. Interviewers look for how you handle hints and test your own code.',
      rounds: [R('Recruiter call', 'behavioral', 30, 'Role fit and logistics'), R('Online assessment', 'coding', 75, 'Two timed problems'), R('Coding I', 'coding', 60, 'Arrays, strings and trees'), R('Coding II', 'coding', 60, 'Graphs and recursion'), R('System design', 'design', 60, 'Components and APIs'), R('Hiring manager', 'behavioral', 45, 'Growth mindset and teamwork')],
    },
    Atlassian: {
      tip: 'Values carry real weight here. Show collaboration and how you give and take feedback.',
      rounds: [R('Recruiter call', 'behavioral', 30, 'Motivation and background'), R('Coding screen', 'coding', 60, 'One practical problem'), R('Values interview', 'behavioral', 45, 'Team-first stories'), R('Coding · Practical', 'coding', 60, 'Clean, testable code'), R('System design', 'design', 60, 'Collaboration at scale')],
    },
    Flipkart: {
      tip: 'Machine coding is the big filter. Write modular, runnable code in two hours.',
      rounds: [R('Online test', 'coding', 90, 'DSA problems'), R('Machine coding', 'coding', 120, 'Build a small system end to end'), R('DSA round', 'coding', 60, 'Trees, graphs, DP'), R('System design (HLD)', 'design', 60, 'E-commerce scale'), R('Hiring manager', 'behavioral', 45, 'Ownership and impact')],
    },
    Uber: {
      tip: 'Expect medium-hard problems and a design round on real-time systems.',
      rounds: [R('Recruiter call', 'behavioral', 30, 'Role and expectations'), R('Phone screen', 'coding', 45, 'One medium problem'), R('Coding I', 'coding', 60, 'Graphs and heaps'), R('Coding II', 'coding', 60, 'DP and intervals'), R('System design', 'design', 60, 'Real-time matching'), R('Behavioral', 'behavioral', 45, 'Ownership under pressure')],
    },
  },
}

// ---- question banks: shaped by both MCPs (company style + your weak topics) ----
const flavor = {
  Google: { c3: 'Merge k sorted lists that arrive from different shards. What is your approach and its complexity?', d: 'Design a globally available URL shortener that handles 10k writes per second.', b: 'Tell me about a time you disagreed with a teammate. How did it resolve?' },
  Amazon: { c3: 'Design and implement an LRU cache with O(1) get and put.', d: 'Design the order pipeline so it survives Prime Day traffic.', b: 'Tell me about a time you took ownership of a problem that was not yours.' },
  Stripe: { c3: 'Given a ledger of transactions, reconcile the balances and flag mismatches.', d: 'Design an idempotent payments API that is safe to retry.', b: 'Tell me about a time you shipped under a tight deadline. What did you cut?' },
  Microsoft: { c3: 'Serialize and deserialize a binary tree. Walk me through your format.', d: 'Design a collaborative document editor for thousands of users.', b: 'Tell me about a time you learned something new fast to unblock your team.' },
  Atlassian: { c3: 'Design a rate limiter class with a clean, testable interface.', d: 'Design a ticket tracker where many people edit the same board at once.', b: 'Tell me about feedback you gave a teammate that was hard to say.' },
  Flipkart: { c3: 'Design and code a parking lot with multiple vehicle types and pricing.', d: 'Design the cart and checkout flow for a big sale day.', b: 'Tell me about a time you owned an outcome end to end.' },
  Uber: { c3: 'Find the shortest ETA between a rider and the nearest available drivers.', d: 'Design real-time driver and rider matching for a busy city.', b: 'Tell me about a time you made a call with little time and incomplete data.' },
}
const fbs = {
  coding: ['Good call on cycle detection. Say the O(V+E) complexity out loud earlier next time.', 'Right recurrence. Walk through a tiny example before coding to catch off-by-one errors.', 'Clean approach. Mention the empty-input case before the interviewer asks.'],
  design: ['Strong start. Put numbers on the load first, then pick the storage.', 'Good caching idea. Add how you would invalidate it.', 'Nice failover story. Mention how you would detect the outage.'],
  behavioral: ['Good structure. Add one number showing the impact.', 'Honest and specific. End with what you would do differently.', 'Clear motivation. Tie it to something this team actually ships.'],
}
const spoken = {
  coding: ['I would model the courses as a directed graph and run Kahn\'s algorithm. If I cannot process every node there is a cycle, so no valid order exists. That is O(V+E).', 'This is a classic DP. dp[x] is the fewest coins for amount x, built from dp[x - coin] plus one. Time is amount times the number of coins.', 'I would keep a min-heap with one pointer per list, pop the smallest, push its successor, and that gives O(N log k) overall.'],
  design: ['I would start with the load: 10k writes a second. Generate short ids from a counter service, store them in a sharded key-value store, and put a cache in front for reads.', 'Cache the hot keys at the edge and in a regional layer. On update I would publish an invalidation event and keep a short TTL as a safety net.', 'Traffic fails over to the next region through DNS health checks. Writes queue locally and replay once the region is back.'],
  behavioral: ['On my last project we disagreed about the database. I wrote a small benchmark, shared the numbers, and we picked the option that cut latency by thirty percent.', 'A reviewer told me my designs skipped failure cases. Since then I add a failure section to every design doc, and my review rounds dropped from three to one.', 'I want to work on problems at this scale, and your team ships the exact kind of product I have been building towards.'],
}
export function questionsFor(co, type) {
  const f = flavor[co]
  const qs = type === 'coding' ? [
    `Your history flags ${weakTopics[0][0]} as your weakest area (${weakTopics[0][1]}%), and ${co} leans on it. Given course prerequisites as a directed graph, return a valid order to take every course, or say it is impossible.`,
    `Next up is ${weakTopics[1][0].toLowerCase()} (${weakTopics[1][1]}%). Given coins of different values, find the fewest coins that make a target amount.`,
    f.c3,
  ] : type === 'design' ? [f.d, 'Where would you add caching, and how do you keep it consistent?', 'A whole region goes down. What happens to your users?']
    : [f.b, 'What was the hardest feedback you received, and what did you change?', 'Why this company, and why now?']
  return qs.map((q, i) => ({ q, fb: fbs[type][i], ans: spoken[type][i] }))
}
export const REPORT = [['Problem solving', 8], ['Communication', 7], ['Edge cases', 6], ['Company fit', 7]]

// ---- 3. hackathon-finder-mcp (Unstop, Devfolio, Devpost) ----
export const hackathonMcp = {
  server: 'hackathon-finder-mcp',
  platforms: {
    Unstop: { url: 'https://unstop.com/', color: '#566a94' },
    Devfolio: { url: 'https://devfolio.co/', color: '#6aaa3a' },
    Devpost: { url: 'https://devpost.com/', color: '#d9573a' },
  },
  events: [
    { name: 'CodeForge Bengaluru', platform: 'Unstop', dates: '12 to 14 Dec 2026', mode: 'In person · Bengaluru', prize: '₹5,00,000', tags: ['Open theme', 'Teams of 4'], left: '9 days left' },
    { name: 'NeuralNest AI Challenge', platform: 'Devfolio', dates: '19 to 21 Dec 2026', mode: 'Online', prize: '₹3,00,000', tags: ['AI/ML', 'Solo or team'], left: '14 days left' },
    { name: 'Hack the Climate', platform: 'Devpost', dates: '8 Jan to 2 Feb 2027', mode: 'Online', prize: '$25,000', tags: ['Climate', 'Open source'], left: '31 days left' },
    { name: 'FinStack Hack', platform: 'Unstop', dates: '9 to 10 Jan 2027', mode: 'In person · Hyderabad', prize: '₹2,50,000', tags: ['Fintech', 'Teams of 3'], left: '20 days left' },
    { name: 'DevDash 24h', platform: 'Devfolio', dates: '16 to 17 Jan 2027', mode: 'In person · Pune', prize: '₹1,50,000', tags: ['Web', '24 hours'], left: '25 days left' },
    { name: 'Open Source Odyssey', platform: 'Devpost', dates: '1 to 28 Feb 2027', mode: 'Online', prize: '$10,000', tags: ['Open source', 'Dev tools'], left: '40 days left' },
    { name: 'HealthTech Sprint', platform: 'Unstop', dates: '23 to 24 Jan 2027', mode: 'Online', prize: '₹4,00,000', tags: ['Health', 'Teams of 4'], left: '30 days left' },
    { name: 'Web3 Weekend', platform: 'Devfolio', dates: '30 to 31 Jan 2027', mode: 'In person · Mumbai', prize: '₹6,00,000', tags: ['Web3', 'Open theme'], left: '35 days left' },
    { name: 'GameJam Galaxy', platform: 'Devpost', dates: '12 to 15 Feb 2027', mode: 'Online', prize: '$8,000', tags: ['Games', 'Solo or team'], left: '48 days left' },
  ],
}

// ---- 4. courses + recommendations (mock; will be generated from the resume and mock interviews later) ----
export const courseMcp = {
  resume: {
    role: 'Backend engineer',
    skills: ['Python', 'React', 'SQL', 'REST APIs', 'Git'],
    gaps: [['System design', 'sysdesign'], ['Docker & Kubernetes', 'docker'], ['TypeScript', 'ts']],
  },
  interviews: [
    { topic: 'Graphs', score: '18% solved', pct: 18, note: 'Missed cycle detection in 2 of 3 mocks', course: 'graphs' },
    { topic: 'Dynamic programming', score: '31% solved', pct: 31, note: 'Slow to find the recurrence', course: 'dp' },
    { topic: 'System design', score: '6/10', pct: 60, note: 'Skipped failure handling and caching limits', course: 'sysdesign' },
  ],
  courses: [
    { id: 'dsa', title: 'Data Structures & Algorithms in Python', platform: 'Udemy', q: 'dsa python', progress: 62, hours: 42, level: 'Intermediate' },
    { id: 'sysdesign', title: 'System Design Interview Prep', platform: 'Udemy', q: 'system design interview', progress: 0, hours: 18, level: 'Advanced' },
    { id: 'sql', title: 'SQL for Backend Developers', platform: 'Coursera', q: 'sql backend', progress: 35, hours: 20, level: 'Beginner' },
    { id: 'ts', title: 'TypeScript: The Complete Guide', platform: 'Udemy', q: 'typescript', progress: 0, hours: 24, level: 'Intermediate' },
    { id: 'behavioral', title: 'Behavioral Interview Mastery', platform: 'Udemy', q: 'behavioral interview', progress: 100, hours: 6, level: 'Beginner' },
    { id: 'docker', title: 'Docker & Kubernetes Basics', platform: 'Udemy', q: 'docker kubernetes', progress: 12, hours: 15, level: 'Beginner' },
    { id: 'graphs', title: 'Graph Algorithms for Coding Interviews', platform: 'Udemy', q: 'graph algorithms interview', progress: 0, hours: 12, level: 'Intermediate' },
    { id: 'dp', title: 'Dynamic Programming: Master the Patterns', platform: 'Coursera', q: 'dynamic programming', progress: 0, hours: 14, level: 'Advanced' },
    { id: 'api', title: 'Designing Scalable REST APIs', platform: 'Coursera', q: 'rest api design', progress: 0, hours: 10, level: 'Intermediate' },
  ],
}
