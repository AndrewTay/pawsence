import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Sunset, Coffee, Terminal, Heart } from 'lucide-react';

interface Step {
  id: 'morning' | 'afternoon' | 'evening';
  time: string;
  title: string;
  description: string;
  avatarImg: string;
  icon: React.ReactNode;
  bgGradient: string;
  screenUI: React.ReactNode;
}

export default function ScrollShowcase() {
  const [activeStep, setActiveStep] = useState<'morning' | 'afternoon' | 'evening'>('morning');
  
  const morningRef = useRef<HTMLDivElement>(null);
  const afternoonRef = useRef<HTMLDivElement>(null);
  const eveningRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const refs = [
        { id: 'morning', ref: morningRef },
        { id: 'afternoon', ref: afternoonRef },
        { id: 'evening', ref: eveningRef }
      ];

      const triggerHeight = window.innerHeight * 0.45; // trigger when element passes 45% of viewport

      for (const item of refs) {
        if (item.ref.current) {
          const rect = item.ref.current.getBoundingClientRect();
          if (rect.top <= triggerHeight && rect.bottom >= triggerHeight) {
            setActiveStep(item.id as 'morning' | 'afternoon' | 'evening');
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Run once initially
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const steps: Step[] = [
    {
      id: 'morning',
      time: 'Morning Sync',
      title: 'Quiet companionship during deep focus.',
      description: 'When they are asleep on the couch at home, their digital twin curls up peacefully next to your active windows. Enjoy their quiet presence without the distraction of a raw surveillance feed or battery drain.',
      avatarImg: '/avatar_sleeping.png',
      icon: <Sun className="w-5 h-5 text-amber-500" />,
      bgGradient: 'from-amber-500/5 via-orange-500/2 to-transparent',
      screenUI: (
        <div className="w-full h-full bg-stone-900 text-stone-300 p-4 flex flex-col font-mono text-[10px] select-none">
          <div className="flex items-center gap-2 border-b border-stone-800 pb-2 mb-2">
            <Terminal className="w-3.5 h-3.5 text-stone-500" />
            <span className="text-stone-500">Workspace — index.tsx</span>
          </div>
          <div className="flex-1 space-y-1.5 opacity-60">
            <div className="text-amber-500">import <span className="text-white">React</span> from <span className="text-emerald-500">'react'</span></div>
            <div className="text-purple-400">const <span className="text-blue-400">DeepWorkSession</span> = () =&gt; &#123;</div>
            <div className="pl-4 text-stone-400">// Keep focus mode active</div>
            <div className="pl-4 text-purple-400">const <span className="text-blue-400">[petTwin]</span> = useTwin();</div>
            <div className="pl-4 text-stone-400">return &lt;Screen&gt;...&lt;/Screen&gt;;</div>
            <div>&#125;</div>
            <div className="text-[#E87A5D]/80 animate-pulse">// Pawsence matching: Sleeping on rug</div>
          </div>
        </div>
      ),
    },
    {
      id: 'afternoon',
      time: 'Afternoon Sync',
      title: 'Never miss their daily routines.',
      description: 'When they wake up to visit the food bowl, your desktop avatar springs to life, walking over to its own virtual bowl. Standard computer vision registers their feeding habits, keeping you subtly informed in real-time.',
      avatarImg: '/avatar_eating.png',
      icon: <Coffee className="w-5 h-5 text-[#E87A5D]" />,
      bgGradient: 'from-emerald-500/5 via-teal-500/2 to-transparent',
      screenUI: (
        <div className="w-full h-full bg-[#FAF8F5] p-5 flex flex-col justify-between select-none">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-2">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-red-400 rounded-full" />
              <span className="font-bold text-[11px] text-stone-700">Health & Activity</span>
            </div>
            <span className="text-[9px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">Connected</span>
          </div>
          
          <div className="flex-1 flex flex-col justify-center items-center">
            {/* Meal Widget */}
            <div className="bg-white border border-stone-200/80 rounded-2xl p-4 shadow-sm w-full max-w-[200px] text-center">
              <span className="text-[10px] text-stone-400 uppercase tracking-widest font-bold font-mono">Lunch Sync</span>
              <h4 className="text-lg font-bold text-stone-900 mt-1">Eating kibble</h4>
              <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Started 2 mins ago</p>
            </div>
          </div>

          <div className="flex justify-between items-center text-[9px] font-mono text-stone-400 border-t border-stone-100 pt-2">
            <span>Water Intake: Optimal</span>
            <span>Bowl: 65% Full</span>
          </div>
        </div>
      ),
    },
    {
      id: 'evening',
      time: 'Evening Sync',
      title: 'A gentle reminder to log off.',
      description: "When they begin pacing by the front door or looking up waiting, your digital pet mirrors their behavior. It's the ultimate, guilt-free reminder that it's time to close your editor and spend quality time with them.",
      avatarImg: '/avatar_waiting.png',
      icon: <Sunset className="w-5 h-5 text-indigo-500" />,
      bgGradient: 'from-indigo-500/5 via-purple-500/2 to-transparent',
      screenUI: (
        <div className="w-full h-full bg-stone-950 p-4 flex flex-col justify-between font-mono text-[9px] text-stone-400 select-none">
          <div className="flex justify-between border-b border-stone-800 pb-2">
            <span className="text-stone-600">DASHBOARD // OVERTIME WARNING</span>
            <span className="text-[#E87A5D] font-bold">18:30 PM</span>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center text-center p-3 gap-2">
            <div className="w-8 h-8 rounded-full bg-orange-950/40 border border-orange-500/30 flex items-center justify-center text-[#E87A5D] animate-bounce">
              <Heart className="w-4 h-4 fill-current" />
            </div>
            <div>
              <p className="text-white font-bold text-[10px]">TIME TO CLOCK OUT</p>
              <p className="text-[9px] text-stone-500 mt-1">Your pet is waiting at the front door.</p>
            </div>
          </div>

          <div className="text-[8px] text-stone-600 text-center border-t border-stone-900 pt-2">
            Click any key to acknowledge and lock screen.
          </div>
        </div>
      ),
    },
  ];

  const currentStepData = steps.find((s) => s.id === activeStep) || steps[0];

  return (
    <section id="how-it-works" className="py-24 bg-stone-100 border-y border-stone-200/60 relative overflow-hidden">
      
      {/* Background Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-b ${currentStepData.bgGradient} transition-all duration-1000`} />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="inline-flex items-center gap-1.5 bg-[#E87A5D]/10 border border-[#E87A5D]/25 px-3.5 py-1 rounded-full text-xs font-bold text-[#E87A5D] mb-4">
            <span>Ambient Companionship</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-stone-900 font-display">
            A perfect sync, all day long.
          </h2>
          <p className="text-base md:text-lg text-stone-600 leading-relaxed">
            Link your pet camera once and let their real-world routines animate as a subtle, screen-based desktop presence.
          </p>
        </div>

        {/* Scroll & Sticky Container */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
          
          {/* STICKY LEFT: The MacBook Mockup */}
          <div className="w-full lg:w-1/2 sticky top-28 lg:top-36 h-[340px] md:h-[450px] flex items-center justify-center">
            
            <div className="relative w-full max-w-[550px] h-full flex flex-col justify-center items-center">
              
              {/* MacBook Screen Bezel */}
              <div className="relative w-full aspect-[16/10] bg-stone-900 rounded-2xl p-2.5 shadow-2xl border border-stone-950 flex flex-col">
                {/* Camera notch / dot */}
                <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-stone-800" />
                
                {/* Laptop Screen Content Display */}
                <div className="flex-1 w-full h-full bg-[#1e1e1e] rounded-lg overflow-hidden relative border border-stone-950/60 shadow-inner">
                  
                  {/* Custom Screen UI based on Active State using Unified High-Fidelity Screenshots */}
                  <div className="absolute inset-0 z-0">
                    <AnimatePresence mode="wait">
                      {activeStep === 'morning' ? (
                        <motion.img
                          key="morning-screen"
                          src="/mac_cat_sleep_screen.png"
                          alt="Macbook morning sleep screen with Calico Cat"
                          className="w-full h-full object-cover"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        />
                      ) : activeStep === 'afternoon' ? (
                        <motion.img
                          key="afternoon-screen"
                          src="/widget_only_gmail_pug_eating.png"
                          alt="Macbook afternoon eat screen"
                          className="w-full h-full object-cover"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        />
                      ) : (
                        <motion.img
                          key="evening-screen"
                          src="/widget_only_gmail_wag.png"
                          alt="Macbook evening wait screen"
                          className="w-full h-full object-cover"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </AnimatePresence>
                  </div>
                  
                  {/* Sync status alert inside laptop screen */}
                  <div className="absolute bottom-3 left-4 bg-stone-900/90 backdrop-blur px-2.5 py-1 rounded text-[8px] text-white/80 font-mono tracking-wider z-20 border border-white/5 uppercase font-bold">
                    Pawsence Sync: {activeStep}
                  </div>
                </div>
              </div>

              {/* Laptop Keyboard Base */}
              <div className="relative w-[112%] h-4 bg-gradient-to-b from-stone-300 via-stone-400 to-stone-500 rounded-b-xl border-t border-stone-200 shadow-xl flex justify-center">
                {/* Open groove */}
                <div className="w-16 h-1 bg-stone-600 rounded-b-md" />
              </div>
              <div className="w-[85%] h-1 bg-stone-950/20 rounded-full blur-[3px]" />

            </div>
          </div>

          {/* SCROLLING RIGHT: The Copy */}
          <div className="w-full lg:w-1/2 lg:pt-16 pb-20 space-y-12">
            
            {/* Section 1: Morning */}
            <div
              ref={morningRef}
              className={`p-8 rounded-3xl border transition-all duration-500 flex flex-col justify-center min-h-[300px] md:min-h-[350px] ${
                activeStep === 'morning'
                  ? 'bg-white border-stone-200/80 shadow-xl shadow-stone-200/10'
                  : 'bg-transparent border-transparent opacity-50 scale-95'
              }`}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-amber-50 rounded-xl">
                  {steps[0].icon}
                </div>
                <span className="text-xs font-bold text-[#E87A5D] uppercase tracking-wider">
                  {steps[0].time}
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl font-extrabold mb-3 text-stone-900 font-display">
                {steps[0].title}
              </h3>
              <p className="text-sm md:text-base text-stone-600 leading-relaxed">
                {steps[0].description}
              </p>
            </div>

            {/* Section 2: Afternoon */}
            <div
              ref={afternoonRef}
              className={`p-8 rounded-3xl border transition-all duration-500 flex flex-col justify-center min-h-[300px] md:min-h-[350px] ${
                activeStep === 'afternoon'
                  ? 'bg-white border-stone-200/80 shadow-xl shadow-stone-200/10'
                  : 'bg-transparent border-transparent opacity-50 scale-95'
              }`}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-emerald-50 rounded-xl">
                  {steps[1].icon}
                </div>
                <span className="text-xs font-bold text-[#E87A5D] uppercase tracking-wider">
                  {steps[1].time}
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl font-extrabold mb-3 text-stone-900 font-display">
                {steps[1].title}
              </h3>
              <p className="text-sm md:text-base text-stone-600 leading-relaxed">
                {steps[1].description}
              </p>
            </div>

            {/* Section 3: Evening */}
            <div
              ref={eveningRef}
              className={`p-8 rounded-3xl border transition-all duration-500 flex flex-col justify-center min-h-[300px] md:min-h-[350px] ${
                activeStep === 'evening'
                  ? 'bg-white border-stone-200/80 shadow-xl shadow-stone-200/10'
                  : 'bg-transparent border-transparent opacity-50 scale-95'
              }`}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-indigo-50 rounded-xl">
                  {steps[2].icon}
                </div>
                <span className="text-xs font-bold text-[#E87A5D] uppercase tracking-wider">
                  {steps[2].time}
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl font-extrabold mb-3 text-stone-900 font-display">
                {steps[2].title}
              </h3>
              <p className="text-sm md:text-base text-stone-600 leading-relaxed">
                {steps[2].description}
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
