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
    <section id="how-it-works" className="py-24 bg-stone-100 border-y border-stone-200/60 relative">
      
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
                <div className="flex-1 w-full h-full bg-[#1e1e1e] rounded-lg overflow-hidden relative border border-stone-950/60 shadow-inner flex flex-col font-sans select-none">
                  
                  {/* Custom macOS Desktop Simulation */}
                  <AnimatePresence mode="wait">
                    {activeStep === 'morning' ? (
                      <motion.div
                        key="morning-desktop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-orange-950/20 p-2 md:p-3 flex flex-col justify-between"
                      >
                        {/* macOS Menu Bar */}
                        <div className="w-full bg-black/15 backdrop-blur-md text-[7px] md:text-[9px] text-white/80 px-2 py-0.5 md:py-1 rounded flex justify-between items-center border border-white/5 font-medium z-10">
                          <div className="flex items-center gap-2 md:gap-3">
                            <span className="font-bold text-white text-[8px] md:text-[10px]"></span>
                            <span className="font-semibold text-white">Code</span>
                            <span>File</span>
                            <span>Edit</span>
                            <span>Selection</span>
                            <span className="hidden sm:inline">View</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span>100%</span>
                            <span>08:30 AM</span>
                          </div>
                        </div>

                        {/* Code Editor Window */}
                        <div className="flex-1 w-full mt-2 mb-1 bg-stone-950/90 border border-stone-800/80 rounded-lg shadow-2xl overflow-hidden flex flex-col text-[7px] md:text-[8px] font-mono text-stone-300">
                          {/* Window Header */}
                          <div className="bg-stone-900 px-2.5 py-1 md:py-1.5 flex items-center justify-between border-b border-stone-900/50">
                            <div className="flex gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5F56]" />
                              <span className="w-1.5 h-1.5 rounded-full bg-[#FFBD2E]" />
                              <span className="w-1.5 h-1.5 rounded-full bg-[#27C93F]" />
                            </div>
                            <span className="text-stone-500">Workspace — App.tsx</span>
                            <div className="w-4" />
                          </div>

                          {/* Editor Body */}
                          <div className="flex-1 flex">
                            {/* Sidebar */}
                            <div className="w-12 md:w-16 border-r border-stone-900 bg-stone-950/50 p-1 md:p-2 text-stone-600 hidden sm:block text-[6px] md:text-[7px]">
                              <div className="font-bold text-stone-500 mb-1 uppercase">Explorer</div>
                              <div className="pl-1 text-stone-400">src/</div>
                              <div className="pl-2 text-white">App.tsx</div>
                              <div className="pl-1 text-stone-500">package.json</div>
                            </div>
                            {/* Code lines */}
                            <div className="flex-1 p-2 md:p-3 text-left space-y-0.5 md:space-y-1 overflow-hidden leading-normal">
                              <div className="text-stone-500">1  <span className="text-orange-400">const</span> <span className="text-blue-400">App</span> = () =&gt; &#123;</div>
                              <div className="text-stone-500">2    <span className="text-orange-400">const</span> [count, setCount] = <span className="text-blue-400">useState</span>(<span className="text-emerald-400">0</span>);</div>
                              <div className="text-stone-500">3    <span className="text-orange-400">const</span> <span className="text-purple-400">increment</span> = () =&gt; &#123;</div>
                              <div className="text-stone-500">4      <span className="text-blue-400">setCount</span>(count + <span className="text-emerald-400">1</span>);</div>
                              <div className="text-stone-500">5    &#125;;</div>
                              <div className="text-stone-500">6    <span className="text-orange-400">return</span> (</div>
                              <div className="text-stone-500">7      <span className="text-teal-400">&lt;div className="container"&gt;</span></div>
                              <div className="text-stone-500">8        <span className="text-teal-400">&lt;h1&gt;Welcome!&lt;/h1&gt;</span></div>
                              <div className="text-stone-500">9      <span className="text-teal-400">&lt;/div&gt;</span></div>
                              <div className="text-stone-500">10   );</div>
                              <div className="text-stone-500">11 &#125;;</div>
                            </div>
                          </div>
                        </div>

                        {/* Floating Widget */}
                        <div className="absolute bottom-3 md:bottom-4 right-3 md:right-4 bg-white/95 backdrop-blur border border-stone-200 shadow-xl rounded-2xl p-1.5 md:p-2 w-[85px] md:w-[105px] flex flex-col items-center z-20 transition-all">
                          <div className="w-[70px] md:w-[89px] h-[70px] md:h-[89px] rounded-xl overflow-hidden bg-stone-100 flex items-center justify-center border border-stone-200/50">
                            <img src="/cat_avatar.png" className="w-full h-full object-cover" />
                          </div>
                          <div className="text-[7px] md:text-[8px] font-extrabold text-stone-800 mt-1 md:mt-1.5 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                            Luna: Sleeping
                          </div>
                        </div>

                      </motion.div>
                    ) : activeStep === 'afternoon' ? (
                      <motion.div
                        key="afternoon-desktop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 bg-gradient-to-tr from-sky-100 via-indigo-50 to-amber-50 p-2 md:p-3 flex flex-col justify-between"
                      >
                        {/* macOS Menu Bar */}
                        <div className="w-full bg-black/5 backdrop-blur-md text-[7px] md:text-[9px] text-stone-800/80 px-2 py-0.5 md:py-1 rounded flex justify-between items-center border border-black/5 font-medium z-10">
                          <div className="flex items-center gap-2 md:gap-3">
                            <span className="font-bold text-stone-900 text-[8px] md:text-[10px]"></span>
                            <span className="font-semibold text-stone-900">Chrome</span>
                            <span>File</span>
                            <span>Edit</span>
                            <span>History</span>
                            <span className="hidden sm:inline">Bookmarks</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span>100%</span>
                            <span>12:45 PM</span>
                          </div>
                        </div>

                        {/* Web Browser Window (Gmail) */}
                        <div className="flex-1 w-full mt-2 mb-1 bg-white border border-stone-200/85 rounded-lg shadow-2xl overflow-hidden flex flex-col text-[7px] md:text-[8px] text-stone-700">
                          {/* Window Header */}
                          <div className="bg-stone-50 px-2.5 py-1 md:py-1.5 flex items-center justify-between border-b border-stone-200">
                            <div className="flex gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5F56]" />
                              <span className="w-1.5 h-1.5 rounded-full bg-[#FFBD2E]" />
                              <span className="w-1.5 h-1.5 rounded-full bg-[#27C93F]" />
                            </div>
                            <div className="bg-stone-200/60 px-3 py-0.5 rounded text-[6px] md:text-[7px] text-stone-500 font-mono w-24 md:w-32 text-center truncate">mail.google.com</div>
                            <div className="w-4" />
                          </div>

                          {/* Browser Body */}
                          <div className="flex-1 flex">
                            {/* Sidebar */}
                            <div className="w-12 md:w-16 border-r border-stone-100 bg-stone-50/50 p-1 md:p-2 text-stone-500 hidden sm:block text-[6px] md:text-[7px] space-y-1">
                              <div className="bg-orange-100/60 text-[#E87A5D] font-bold py-0.5 rounded text-center">Compose</div>
                              <div className="pl-1 text-[#E87A5D] font-bold">Inbox (3)</div>
                              <div className="pl-1">Sent</div>
                              <div className="pl-1">Drafts</div>
                            </div>
                            {/* Email List */}
                            <div className="flex-1 p-1.5 md:p-2.5 text-left space-y-1 md:space-y-1.5 leading-normal">
                              <div className="flex justify-between items-center bg-stone-50 p-0.5 md:p-1 rounded border border-stone-100/80">
                                <div className="flex items-center gap-1 md:gap-1.5 truncate">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                  <span className="font-bold text-stone-900">GitHub</span>
                                  <span className="text-stone-500 truncate">Deploy Successful - pawsence-landing-page</span>
                                </div>
                                <span className="text-[6px] md:text-[7px] text-stone-400">12:32 PM</span>
                              </div>
                              <div className="flex justify-between items-center p-0.5 md:p-1 rounded">
                                <div className="flex items-center gap-1 md:gap-1.5 truncate">
                                  <span className="w-1.5 h-1.5 bg-transparent rounded-full" />
                                  <span className="font-medium text-stone-800">Spotify</span>
                                  <span className="text-stone-500 truncate">Your weekly release radar mix is here!</span>
                                </div>
                                <span className="text-[6px] md:text-[7px] text-stone-400">11:15 AM</span>
                              </div>
                              <div className="flex justify-between items-center p-0.5 md:p-1 rounded">
                                <div className="flex items-center gap-1 md:gap-1.5 truncate">
                                  <span className="w-1.5 h-1.5 bg-transparent rounded-full" />
                                  <span className="font-medium text-stone-800">Figma</span>
                                  <span className="text-stone-500 truncate">New comments on "TwinPet App Mockups"</span>
                                </div>
                                <span className="text-[6px] md:text-[7px] text-stone-400">09:40 AM</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Floating Widget */}
                        <div className="absolute bottom-3 md:bottom-4 right-3 md:right-4 bg-white/95 backdrop-blur border border-stone-200 shadow-xl rounded-2xl p-1.5 md:p-2 w-[85px] md:w-[105px] flex flex-col items-center z-20 transition-all">
                          <div className="w-[70px] md:w-[89px] h-[70px] md:h-[89px] rounded-xl overflow-hidden bg-stone-100 flex items-center justify-center border border-stone-200/50">
                            <img src="/pug_avatar.png" className="w-full h-full object-cover" />
                          </div>
                          <div className="text-[7px] md:text-[8px] font-extrabold text-stone-800 mt-1 md:mt-1.5 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Otis: Feeding
                          </div>
                        </div>

                      </motion.div>
                    ) : (
                      <motion.div
                        key="evening-desktop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 p-2 md:p-3 flex flex-col justify-between"
                      >
                        {/* macOS Menu Bar */}
                        <div className="w-full bg-black/20 backdrop-blur-md text-[7px] md:text-[9px] text-white/80 px-2 py-0.5 md:py-1 rounded flex justify-between items-center border border-white/5 font-medium z-10">
                          <div className="flex items-center gap-2 md:gap-3">
                            <span className="font-bold text-white text-[8px] md:text-[10px]"></span>
                            <span className="font-semibold text-white">Dashboard</span>
                            <span>File</span>
                            <span>Edit</span>
                            <span>View</span>
                            <span className="hidden sm:inline">Go</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span>100%</span>
                            <span>06:45 PM</span>
                          </div>
                        </div>

                        {/* Application Window (Overtime Dashboard Alert) */}
                        <div className="flex-1 w-full mt-2 mb-1 bg-stone-900/90 border border-stone-800/80 rounded-lg shadow-2xl overflow-hidden flex flex-col text-[7px] md:text-[8px] text-stone-300">
                          {/* Window Header */}
                          <div className="bg-stone-950 px-2.5 py-1 md:py-1.5 flex items-center justify-between border-b border-stone-900/40">
                            <div className="flex gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5F56]" />
                              <span className="w-1.5 h-1.5 rounded-full bg-[#FFBD2E]" />
                              <span className="w-1.5 h-1.5 rounded-full bg-[#27C93F]" />
                            </div>
                            <span className="text-stone-500">Pawsence Overtime Monitor</span>
                            <div className="w-4" />
                          </div>

                          {/* Dashboard Content */}
                          <div className="flex-1 p-2 md:p-4 flex flex-col items-center justify-center text-center space-y-1.5 md:space-y-2">
                            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-500 animate-bounce text-[9px] md:text-[12px]">
                              ⏳
                            </div>
                            <div className="space-y-0.5 md:space-y-1 max-w-[130px] md:max-w-[160px]">
                              <h4 className="font-bold text-white text-[8px] md:text-[9px] uppercase tracking-wider">Clock Out Reminder</h4>
                              <p className="text-[6.5px] md:text-[7.5px] text-stone-400">You've been working for 4.5 hours. Bini is waiting at the front door!</p>
                            </div>
                          </div>
                        </div>

                        {/* Floating Widget */}
                        <div className="absolute bottom-3 md:bottom-4 right-3 md:right-4 bg-white/95 backdrop-blur border border-stone-200 shadow-xl rounded-2xl p-1.5 md:p-2 w-[85px] md:w-[105px] flex flex-col items-center z-20 transition-all">
                          <div className="w-[70px] md:w-[89px] h-[70px] md:h-[89px] rounded-xl overflow-hidden bg-stone-100 flex items-center justify-center border border-stone-200/50">
                            <img src="/bunny_avatar.png" className="w-full h-full object-cover" />
                          </div>
                          <div className="text-[7px] md:text-[8px] font-extrabold text-stone-800 mt-1 md:mt-1.5 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                            Bini: Waiting
                          </div>
                        </div>

                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Sync status alert inside laptop screen */}
                  <div className="absolute bottom-3 left-4 bg-stone-900/90 backdrop-blur px-2 py-0.5 rounded text-[7px] text-white/80 font-mono tracking-wider z-20 border border-white/5 uppercase font-bold">
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
