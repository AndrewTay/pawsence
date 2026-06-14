import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Monitor, Smartphone, Layout, Wifi, Activity } from 'lucide-react';

export default function BentoBox() {
  // Menu Bar interactive state
  const [menuOpen, setMenuOpen] = useState(false);

  // Desktop Pet interactive jump
  const [petY, setPetY] = useState(0);
  const [petRotate, setPetRotate] = useState(0);

  const triggerPetJump = () => {
    if (petY !== 0) return;
    setPetY(-25);
    setPetRotate(15);
    setTimeout(() => {
      setPetY(0);
      setPetRotate(0);
    }, 400);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-16 text-center text-stone-900 font-display">
        Always by your side.
      </h2>

      {/* Grid wrapper */}
      <div className="grid md:grid-cols-3 gap-6">
        
        {/* CARD 1: THE DESKTOP PET (2 cols wide) */}
        <div className="md:col-span-2 bg-stone-100 rounded-3xl p-6 md:p-8 border border-stone-200/80 grid lg:grid-cols-5 gap-6 items-center min-h-[340px] md:min-h-[380px] overflow-hidden group">
          
          {/* Copy (Left side) */}
          <div className="lg:col-span-2 flex flex-col justify-between h-full py-2">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-white border border-stone-200 px-3 py-1 rounded-full text-xs font-bold text-stone-600 mb-3 shadow-sm">
                <Monitor className="w-3.5 h-3.5" />
                <span>Desktop Widget</span>
              </div>
              <h3 className="text-2xl font-extrabold text-stone-900 font-display">The Desktop Pet</h3>
              <p className="text-sm text-stone-600 mt-2 leading-relaxed">
                Lives freely on top of your working windows. Hover over the screen or click to watch Otis react.
              </p>
            </div>
            {/* Click to test button/tip */}
            <div className="text-xs text-[#E87A5D] font-bold flex items-center gap-1 mt-6">
              <span>Click screen preview to test &rarr;</span>
            </div>
          </div>

          {/* Interactive Screen Preview (Right side, contained) */}
          <div 
            onClick={triggerPetJump}
            onMouseEnter={triggerPetJump}
            className="lg:col-span-3 w-full h-[220px] md:h-[260px] bg-white rounded-2xl shadow-xl border border-stone-200/80 transition-all duration-300 group-hover:scale-[1.01] flex flex-col overflow-hidden cursor-pointer mt-auto"
          >
            {/* Browser top-bar mock */}
            <div className="bg-stone-50 border-b border-stone-200/60 px-4 py-2 flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-stone-200" />
                <span className="w-2 h-2 rounded-full bg-stone-200" />
                <span className="w-2 h-2 rounded-full bg-stone-200" />
              </div>
              <div className="bg-stone-100/60 rounded-md text-[9px] text-stone-400 px-4 py-0.5 w-40 text-center font-mono">
                pawsence.com/dashboard
              </div>
            </div>

            {/* Desktop content mock */}
            <div className="flex-1 p-4 bg-stone-50/20 relative overflow-hidden">
              <div className="w-32 h-16 bg-stone-100 rounded-lg p-2.5 space-y-1.5 opacity-60 pointer-events-none">
                <div className="h-2 w-3/4 bg-stone-300 rounded" />
                <div className="h-1.5 w-1/2 bg-stone-200 rounded" />
                <div className="h-1.5 w-2/3 bg-stone-200 rounded" />
              </div>

              {/* The Floating Pet */}
              <motion.div
                className="absolute bottom-2 right-8 w-24 h-24 z-10"
                animate={{
                  y: petY,
                  rotate: petRotate
                }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 12
                }}
              >
                <img
                  src="/dog_avatar.png"
                  alt="Pawsence Avatar"
                  className="w-full h-full object-contain drop-shadow-lg"
                />
              </motion.div>

              {/* Shadow */}
              <div className="absolute bottom-1 right-[38px] w-12 h-2 bg-stone-900/5 rounded-full blur-[3px]" />
            </div>
          </div>
        </div>

        {/* CARD 2: THE MENU BAR (1 col) */}
        <div className="bg-stone-100 rounded-3xl p-6 md:p-8 border border-stone-200/80 flex flex-col justify-between min-h-[340px] md:min-h-[380px] overflow-hidden group">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-white border border-stone-200 px-3 py-1 rounded-full text-xs font-bold text-stone-600 mb-3 shadow-sm">
              <Layout className="w-3.5 h-3.5" />
              <span>macOS Menu Bar</span>
            </div>
            <h3 className="text-xl md:text-2xl font-extrabold text-stone-900 font-display">The Menu Bar</h3>
            <p className="text-xs text-stone-600 mt-2 leading-relaxed">
              A tiny, ambient icon sits in your menu bar, changing postures dynamically. Click to open dropdown stats.
            </p>
          </div>

          {/* Interactive Menu Bar dropdown preview (Contained inside a mini window) */}
          <div className="w-full bg-white rounded-2xl border border-stone-200/80 shadow-md flex-1 flex flex-col overflow-hidden mt-4 min-h-[160px] relative">
            
            {/* macOS Menu bar representation */}
            <div className="w-full h-7 bg-stone-50 border-b border-stone-200/60 px-3 flex items-center justify-between text-stone-700 text-[10px] select-none shadow-sm z-10">
              <div className="flex gap-2 font-semibold text-[8px] text-stone-400">
                <span>Finder</span>
                <span>File</span>
              </div>
              
              {/* Pet icon trigger */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className={`flex items-center gap-1 px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                  menuOpen ? 'bg-orange-100 text-[#E87A5D] font-bold' : 'hover:bg-stone-200'
                }`}
              >
                🐾
                <span className="text-[8px] font-bold">Otis</span>
              </button>
            </div>

            {/* Simulated Desktop / Dropdown content */}
            <div className="flex-1 bg-stone-50/20 relative p-3 flex flex-col justify-center">
              
              <AnimatePresence mode="wait">
                {menuOpen ? (
                  <motion.div
                    key="dropdown-menu"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute top-1 right-2 left-2 bg-white border border-stone-200/80 rounded-xl p-2.5 shadow-lg z-20 space-y-2 text-[9px]"
                  >
                    <div className="flex justify-between items-center border-b border-stone-100 pb-1">
                      <span className="font-bold text-stone-700 flex items-center gap-1">
                        <Activity className="w-3 h-3 text-[#E87A5D]" /> Otis's Pawsence
                      </span>
                      <span className="text-[7px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                        Active
                      </span>
                    </div>

                    <div className="space-y-1 text-stone-500 font-mono text-[8px]">
                      <div className="flex justify-between">
                        <span>Current state:</span>
                        <span className="text-stone-800 font-bold">Eating Kibble</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Camera sync:</span>
                        <span className="text-stone-800 font-bold">Kitchen Cam</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Framerate:</span>
                        <span className="text-stone-800">60 FPS</span>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  // Default placeholder layout inside card
                  <motion.div 
                    key="dropdown-closed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-stone-400 text-[9px] font-bold border border-dashed border-stone-200 rounded-xl p-4 bg-white/40 cursor-pointer"
                    onClick={() => setMenuOpen(true)}
                  >
                    Click the 🐾 icon to open status dropdown
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* CARD 3: IOS LIVE ACTIVITY (Spans all 3 cols for full-width grid balance) */}
        <div className="md:col-span-3 bg-[#E87A5D] rounded-3xl p-6 md:p-8 flex flex-col justify-between min-h-[300px] md:min-h-[200px] overflow-hidden text-white group shadow-xl shadow-orange-500/10 grid md:grid-cols-5 gap-6 items-center">
          
          {/* Copy (Left 2 cols) */}
          <div className="md:col-span-2 flex flex-col justify-center h-full">
            <div className="inline-flex items-center gap-1.5 bg-white/15 border border-white/20 px-3 py-1 rounded-full text-xs font-semibold text-orange-50 mb-3 w-max">
              <Smartphone className="w-3.5 h-3.5" />
              <span>iOS Live Activity</span>
            </div>
            <h3 className="text-2xl font-extrabold font-display">iOS Live Activity</h3>
            <p className="text-sm text-orange-100 mt-2 leading-relaxed">
              Glance at your iPhone lock screen to instantly see if they are resting, eating, or waiting.
            </p>
          </div>

          {/* Widget Display (Right 3 cols) */}
          <div className="md:col-span-3 w-full max-w-md bg-stone-950/80 backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-2xl text-[10px] space-y-3 mx-auto">
            
            {/* Widget Header */}
            <div className="flex justify-between items-center text-white/60 font-mono text-[8px]">
              <span className="flex items-center gap-1 font-bold text-white/80">
                🐾 PAWSENCE SYNC
              </span>
              <span className="flex items-center gap-1">
                <Wifi className="w-2.5 h-2.5 text-emerald-400" /> Connected
              </span>
            </div>

            {/* Widget Body */}
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-extrabold text-sm text-white">Otis is Eating Lunch</h4>
                <p className="text-[8px] text-white/50 font-mono mt-0.5">Sync Source: Kitchen Cam • 2m ago</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-base animate-pulse shadow-inner">
                🍗
              </div>
            </div>

            {/* Mini Progress tracker */}
            <div className="pt-1">
              <div className="w-full bg-white/15 h-1 rounded-full overflow-hidden relative">
                <motion.div
                  className="bg-[#E87A5D] h-full rounded-full"
                  animate={{
                    width: ['0%', '100%'],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              </div>
              <div className="flex justify-between text-[8px] text-white/40 mt-1 font-mono">
                <span>Meal Sync Started</span>
                <span>Active Mimicry</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
