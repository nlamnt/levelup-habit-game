@import "tailwindcss";

@theme {
  --color-brand-primary: #8b5cf6;
  --color-brand-secondary: #ec4899;
  --color-brand-accent: #10b981;
  
  --font-sans: "Urbanist", ui-sans-serif, system-ui, sans-serif;
  --font-display: "Space Grotesk", sans-serif;
}

@layer base {
  body {
    @apply bg-slate-950 text-slate-100 min-h-screen overflow-x-hidden;
  }
}

@layer components {
  .glass-card {
    @apply bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl;
  }
  
  .neon-glow-purple {
    @apply shadow-[0_0_20px_rgba(139,92,246,0.3)] border-purple-500/50;
  }
  
  .neon-glow-green {
    @apply shadow-[0_0_20px_rgba(16,185,129,0.3)] border-emerald-500/50;
  }

  .bento-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-auto-rows: minmax(150px, auto);
    gap: 1.5rem;
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  @apply bg-slate-900;
}
::-webkit-scrollbar-thumb {
  @apply bg-purple-500/30 rounded-full hover:bg-purple-500/50;
}
