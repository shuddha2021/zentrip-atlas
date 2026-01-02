/**
 * ZenTrip Atlas Design Tokens
 * Premium, calm, high-contrast zen aesthetic
 */

export const colors = {
  // Backgrounds - warm off-white tones
  bg: {
    primary: "#fdfcfa",
    secondary: "#f8f7f5",
    accent: "#f3f2ef",
    surface: "#ffffff",
  },
  
  // Text - strong contrast using slate
  text: {
    heading: "#0f172a",    // slate-900
    primary: "#1e293b",    // slate-800
    secondary: "#475569",  // slate-600
    muted: "#94a3b8",      // slate-400
  },
  
  // Primary accent - Indigo/Violet (muted but visible)
  primary: {
    DEFAULT: "#6366f1",    // indigo-500
    dark: "#4f46e5",       // indigo-600
    soft: "#e0e7ff",       // indigo-100
    muted: "#c7d2fe",      // indigo-200
  },
  
  // Secondary accent - Teal/Aqua (calming)
  secondary: {
    DEFAULT: "#14b8a6",    // teal-500
    dark: "#0d9488",       // teal-600
    soft: "#ccfbf1",       // teal-100
    muted: "#99f6e4",      // teal-200
  },
  
  // Borders
  border: {
    light: "rgba(0, 0, 0, 0.06)",
    medium: "rgba(0, 0, 0, 0.10)",
    strong: "rgba(0, 0, 0, 0.15)",
  },
  
  // Semantic colors for stats
  stats: {
    score: { bg: "#fef3c7", text: "#92400e" },       // amber tones
    temp: { bg: "#fee2e2", text: "#991b1b" },        // rose tones
    rain: { bg: "#dbeafe", text: "#1e40af" },        // blue tones
    budget: { bg: "#d1fae5", text: "#065f46" },      // emerald tones
  },
} as const;

// Tailwind class compositions for reuse
export const tw = {
  // Card styles
  card: {
    base: "bg-white/90 backdrop-blur-sm border border-black/[0.06] rounded-2xl shadow-sm",
    hover: "hover:shadow-md hover:border-black/[0.10] hover:-translate-y-0.5 transition-all duration-200",
    elevated: "bg-white border border-black/[0.08] rounded-2xl shadow-md",
  },
  
  // Button styles
  button: {
    primary: "bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-semibold rounded-xl shadow-md shadow-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all duration-200",
    secondary: "bg-white border border-black/[0.10] text-slate-700 font-medium rounded-xl shadow-sm hover:bg-slate-50 hover:border-black/[0.15] transition-all duration-150",
    ghost: "text-slate-600 hover:text-slate-900 hover:bg-slate-100/50 rounded-lg transition-colors duration-150",
  },
  
  // Chip/pill styles
  chip: {
    inactive: "bg-white border border-black/[0.08] text-slate-600 hover:bg-slate-50 hover:border-black/[0.12] transition-all duration-150",
    active: "bg-indigo-50 border border-indigo-200 text-indigo-700 ring-2 ring-indigo-500/20 shadow-sm",
    tag: "bg-slate-100 text-slate-600 border border-slate-200/50",
  },
  
  // Badge styles  
  badge: {
    score: "bg-gradient-to-br from-amber-50 to-amber-100/80 border-2 border-amber-300/50 text-amber-800 ring-2 ring-amber-400/20",
    scoreCircle: "w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-300/60 text-amber-800 font-bold shadow-sm",
  },
  
  // Stat card styles
  stat: {
    score: "bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-200/60",
    temp: "bg-gradient-to-br from-rose-50 to-rose-100/50 border border-rose-200/60", 
    rain: "bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200/60",
    budget: "bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200/60",
  },
  
  // Focus states for accessibility
  focus: "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30 focus-visible:ring-offset-2",
  
  // Typography
  heading: {
    hero: "text-5xl sm:text-6xl font-extrabold tracking-tight text-slate-900",
    page: "text-3xl sm:text-4xl font-bold tracking-tight text-slate-900",
    section: "text-xl font-semibold text-slate-800",
    card: "text-lg font-semibold text-slate-800",
  },
  
  // Layout
  container: "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8",
} as const;

// Gradient backgrounds for subtle glow effects
export const gradients = {
  heroGlow: "bg-gradient-to-br from-indigo-50/40 via-transparent to-teal-50/30",
  pageWash: "bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-50/50 via-transparent to-transparent",
} as const;
