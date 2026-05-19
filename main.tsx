import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Trophy, 
  Flame, 
  Brain, 
  Target, 
  Settings, 
  LogOut, 
  CheckCircle2, 
  Circle,
  Sword,
  Zap,
  BookOpen
} from 'lucide-react';

// Types
interface Quest {
  id: string;
  title: string;
  category: 'learning' | 'fitness' | 'habit';
  completed: boolean;
  xpValue: number;
}

interface GameState {
  xp: number;
  level: number;
  quests: Quest[];
  notes: string;
  avatarSeed: number;
}

// Components
const Avatar = ({ level, xp }: { level: number; xp: number }) => {
  const getAvatarInfo = () => {
    if (level < 5) return { icon: "🌱", label: "Seedling", color: "text-emerald-400" };
    if (level < 10) return { icon: "🌿", label: "Sprout", color: "text-green-400" };
    if (level < 20) return { icon: "🌳", label: "Ancient Tree", color: "text-teal-400" };
    if (level < 40) return { icon: "🤖", label: "Cyber Spirit", color: "text-blue-400" };
    return { icon: "👑", label: "Archon Master", color: "text-purple-400" };
  };

  const info = getAvatarInfo();
  const xpProgress = (xp % 100);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <motion.div 
        animate={{ scale: [1, 1.1, 1] }} 
        transition={{ duration: 4, repeat: Infinity }}
        className="relative mb-4"
      >
        <div className="absolute inset-0 bg-brand-primary/20 blur-3xl rounded-full"></div>
        <span className="text-8xl relative z-10 animate-float block">{info.icon}</span>
      </motion.div>
      <h3 className={`text-xl font-display font-bold ${info.color}`}>{info.label}</h3>
      <p className="text-slate-400 text-sm">Level {level}</p>
      <div className="w-full bg-slate-800 h-2 rounded-full mt-4 overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${xpProgress}%` }}
          className="h-full bg-brand-primary"
        />
      </div>
      <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest">{xpProgress}% XP towards next level</p>
    </div>
  );
};

const BossFight = ({ onClose }: { onClose: () => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
    >
      <div className="glass-card max-w-md w-full border-red-500/50 neon-glow-red bg-slate-900 border-2">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-red-500/20 rounded-xl">
            <Sword className="text-red-500" />
          </div>
          <div>
            <h2 className="text-2xl font-display font-bold text-red-500 uppercase italic">Boss Fight!</h2>
            <p className="text-slate-400 text-sm">Uji pemahamanmu untuk naik level.</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <p className="text-lg font-medium">"Salah satu cara terbaik membangun kebiasaan baru adalah dengan teknik 'Habit Stacking'. Apa maksudnya?"</p>
          <div className="grid gap-2">
            {['Melakukan banyak kebiasaan sekaligus', 'Menempelkan kebiasaan baru setelah kebiasaan lama', 'Menghapus kebiasaan lama sepenuhnya', 'Menumpuk catatan progres'].map((opt, i) => (
              <button 
                key={i}
                onClick={onClose}
                className="w-full text-left p-3 rounded-xl border border-slate-700 hover:bg-slate-800 transition-colors"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [state, setState] = useState<GameState>(() => {
    const saved = localStorage.getItem('levelup_state');
    return saved ? JSON.parse(saved) : {
      xp: 0,
      level: 1,
      quests: [
        { id: '1', title: 'Baca 10 halaman buku', category: 'learning', completed: false, xpValue: 20 },
        { id: '2', title: 'Minum 2L air putih', category: 'habit', completed: true, xpValue: 10 },
      ],
      notes: '',
      avatarSeed: Math.random()
    };
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showBossFight, setShowBossFight] = useState(false);
  const [newQuestTitle, setNewQuestTitle] = useState('');

  useEffect(() => {
    localStorage.setItem('levelup_state', JSON.stringify(state));
    
    // Trigger Boss Fight every 25% of XP milestone progress relative to level chunks (simulation)
    if (state.xp > 0 && state.xp % 100 === 25 && !showBossFight) {
      // Logic for boss fight triggers can be more complex, but here's a simple one
    }
  }, [state]);

  const toggleQuest = (id: string) => {
    setState(prev => {
      const updatedQuests = prev.quests.map(q => {
        if (q.id === id) {
          const newStatus = !q.completed;
          let newXp = prev.xp + (newStatus ? q.xpValue : -q.xpValue);
          let newLevel = Math.floor(newXp / 100) + 1;
          
          if (newLevel > prev.level) {
             setTimeout(() => setShowBossFight(true), 500);
          }

          return { ...q, completed: newStatus };
        }
        return q;
      });

      const totalXp = updatedQuests.reduce((acc, q) => q.completed ? acc + q.xpValue : acc, 0);
      return { 
        ...prev, 
        quests: updatedQuests, 
        xp: totalXp,
        level: Math.floor(totalXp / 100) + 1
      };
    });
  };

  const addQuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestTitle.trim()) return;
    
    const newQuest: Quest = {
      id: Date.now().toString(),
      title: newQuestTitle,
      category: 'habit',
      completed: false,
      xpValue: 15
    };

    setState(prev => ({
      ...prev,
      quests: [newQuest, ...prev.quests]
    }));
    setNewQuestTitle('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">LevelUp.ai</h1>
          <p className="text-slate-500 font-medium">Selamat datang kembali, Commander.</p>
        </div>
        <div className="flex gap-3">
          <button className="p-3 glass-card !p-3 hover:bg-white/10 transition-all">
            <Settings size={20} />
          </button>
          <button className="p-3 glass-card !p-3 hover:bg-white/10 text-red-400 transition-all">
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Profile / Avatar (Bento Item 1) */}
        <div className="md:col-span-1 glass-card flex flex-col justify-between neon-glow-purple">
          <Avatar level={state.level} xp={state.xp} />
          <div className="mt-6 flex justify-around items-center border-t border-white/5 pt-6">
             <div className="text-center">
                <span className="block text-xl font-bold">{state.xp}</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Total XP</span>
             </div>
             <div className="text-center">
                <span className="block text-xl font-bold">{state.quests.filter(q => q.completed).length}</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Quest Selesai</span>
             </div>
          </div>
        </div>

        {/* Quest Dashboard (Bento Item 2) */}
        <div className="md:col-span-2 glass-card overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Zap className="text-amber-400" size={20} />
              <h2 className="text-xl font-display font-bold">Active Quests</h2>
            </div>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-brand-primary hover:bg-brand-primary/80 text-white p-2 rounded-xl transition-all"
            >
              <Plus size={20} />
            </button>
          </div>
          
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            <AnimatePresence initial={false}>
              {state.quests.map((quest) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  key={quest.id}
                  onClick={() => toggleQuest(quest.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex justify-between items-center ${
                    quest.completed 
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-slate-400' 
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {quest.completed ? <CheckCircle2 className="text-emerald-500" /> : <Circle className="text-slate-600" />}
                    <span className={quest.completed ? 'line-through' : 'font-medium'}>{quest.title}</span>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-lg ${quest.completed ? 'bg-slate-800 text-slate-500' : 'bg-brand-primary/20 text-brand-primary'}`}>
                    +{quest.xpValue} XP
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Brain Dump & Quick Stats (Bento Item 3) */}
        <div className="md:col-span-1 space-y-6">
          <div className="glass-card !bg-brand-accent/5 neon-glow-green h-[260px] flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Brain className="text-brand-accent" size={18} />
                <h2 className="font-display font-bold">Brain Dump</h2>
              </div>
              <button 
                onClick={async () => {
                  const btn = document.getElementById('ai-btn');
                  if (btn) btn.innerHTML = 'Thinking...';
                  try {
                    const res = await fetch('/api/ai-strategy', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ 
                        currentQuests: state.quests.filter(q => !q.completed).map(q => q.title),
                        notes: state.notes
                      })
                    });
                    const data = await res.json();
                    alert(data.advice || "Tetap semangat, Commander!");
                  } catch (e) {
                    alert("Koneksi AI terputus. Coba lagi nanti!");
                  } finally {
                    if (btn) btn.innerHTML = 'AI Strategy';
                  }
                }}
                id="ai-btn"
                className="text-[10px] bg-brand-accent/20 text-brand-accent px-2 py-1 rounded-lg font-bold hover:bg-brand-accent/30 transition-all uppercase"
              >
                AI Strategy
              </button>
            </div>
            <textarea 
              value={state.notes}
              onChange={(e) => setState(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Coretan hari ini..."
              className="bg-transparent border-none focus:ring-0 w-full flex-grow text-sm resize-none text-slate-300 placeholder:text-slate-600"
            />
          </div>

          <div className="glass-card flex items-center gap-4 hover:scale-[1.02] transition-transform cursor-pointer">
            <div className="p-3 bg-amber-500/20 rounded-2xl">
              <Flame className="text-amber-500" size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Streak</p>
              <p className="text-xl font-bold">12 Hari 🔥</p>
            </div>
          </div>
        </div>

      </div>

      {/* Add Quest Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="glass-card max-w-sm w-full"
            >
              <h3 className="text-xl font-display font-bold mb-4">Mulai Quest Baru</h3>
              <form onSubmit={addQuest}>
                <input 
                  autoFocus
                  type="text" 
                  value={newQuestTitle}
                  onChange={(e) => setNewQuestTitle(e.target.value)}
                  placeholder="Mis: Belajar TypeScript 1 jam"
                  className="w-full bg-slate-800 border-none rounded-xl p-3 mb-4 focus:ring-2 focus:ring-brand-primary outline-none"
                />
                <div className="flex gap-2">
                  <button 
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 p-3 rounded-xl transition-all"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-brand-primary hover:bg-brand-primary/80 p-3 rounded-xl transition-all font-bold"
                  >
                    Mulai!
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Boss Fight Modal */}
      <AnimatePresence>
        {showBossFight && <BossFight onClose={() => setShowBossFight(false)} />}
      </AnimatePresence>

      {/* Background Decor */}
      <div className="fixed -top-24 -left-24 w-96 h-96 bg-brand-primary/10 blur-[120px] -z-10 rounded-full"></div>
      <div className="fixed -bottom-24 -right-24 w-96 h-96 bg-brand-secondary/10 blur-[120px] -z-10 rounded-full"></div>
    </div>
  );
}
