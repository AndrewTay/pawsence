import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Sunset, Coffee } from 'lucide-react';



interface Step {
  id: 'morning' | 'afternoon' | 'evening';
  time: string;
  title: string;
  description: string;
  avatarImg: string;
  icon: React.ReactNode;
  bgGradient: string;
}

interface LaptopMockupProps {
  step: 'morning' | 'afternoon' | 'evening';
}

function LaptopMockup({ step }: LaptopMockupProps) {
  return (
    <div className="relative w-full max-w-[550px] flex flex-col justify-center items-center">
      {/* MacBook Screen Bezel */}
      <div className="relative w-full aspect-[16/10] bg-stone-900 rounded-2xl p-2 md:p-2.5 shadow-2xl border border-stone-950 flex flex-col">
        {/* Camera notch / dot */}
        <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-stone-800" />
        
        {/* Laptop Screen Content Display */}
        <div className="flex-1 w-full h-full bg-[#1e1e1e] rounded-lg overflow-hidden relative border border-stone-950/60 shadow-inner flex flex-col font-sans select-none">
          
          {/* Custom macOS Desktop Simulation */}
          <AnimatePresence mode="wait">
            {step === 'morning' ? (
              <motion.div
                key="morning-desktop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-orange-950/20 p-2 md:p-3 flex flex-col justify-between"
              >
                {/* macOS Menu Bar */}
                <div className="w-full bg-black/15 backdrop-blur-md text-[7px] md:text-[9px] text-white/80 px-2 py-0.5 md:py-1 rounded flex justify-between items-center border border-white/5 font-medium z-10 font-sans">
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

                {/* Floating Widget - Bounding box removed for natural feel (Size increased by 50%) */}
                <div className="absolute bottom-3 md:bottom-4 right-3 md:right-4 flex flex-row items-end justify-end gap-2 md:gap-3 z-20 transition-all font-sans">
                  <div className="text-[7.5px] md:text-[9px] font-extrabold text-white bg-black/65 backdrop-blur-sm px-2.5 py-0.5 rounded-full mb-1 md:mb-1.5 flex items-center gap-1 shadow-md whitespace-nowrap">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    Luna: Sleeping
                  </div>
                  <div className="w-[105px] md:w-[135px] h-[105px] md:h-[135px] flex items-center justify-center filter drop-shadow-md">
                    <img src="/cat_sleeping_avatar.webp?v=2" className="w-full h-full object-contain" />
                  </div>
                </div>
              </motion.div>
            ) : step === 'afternoon' ? (
              <motion.div
                key="afternoon-desktop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-gradient-to-tr from-sky-100 via-indigo-50 to-amber-50 p-2 md:p-3 flex flex-col justify-between"
              >
                {/* macOS Menu Bar */}
                <div className="w-full bg-black/5 backdrop-blur-md text-[7px] md:text-[9px] text-stone-800/80 px-2 py-0.5 md:py-1 rounded flex justify-between items-center border border-black/5 font-medium z-10 font-sans">
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
                <div className="flex-1 w-full mt-2 mb-1 bg-white border border-stone-200/85 rounded-lg shadow-2xl overflow-hidden flex flex-col text-[7px] md:text-[8px] text-stone-700 font-sans">
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
                          <span className="font-medium text-stone-850">Spotify</span>
                          <span className="text-stone-500 truncate">Your weekly release radar mix is here!</span>
                        </div>
                        <span className="text-[6px] md:text-[7px] text-stone-400">11:15 AM</span>
                      </div>
                      <div className="flex justify-between items-center p-0.5 md:p-1 rounded">
                        <div className="flex items-center gap-1 md:gap-1.5 truncate">
                          <span className="w-1.5 h-1.5 bg-transparent rounded-full" />
                          <span className="font-medium text-stone-800 font-sans">Figma</span>
                          <span className="text-stone-500 truncate">New comments on "TwinPet App Mockups"</span>
                        </div>
                        <span className="text-[6px] md:text-[7px] text-stone-400">09:40 AM</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Widget - Bounding box removed for natural feel (Size increased by 50%) */}
                <div className="absolute bottom-3 md:bottom-4 right-3 md:right-4 flex flex-row items-end justify-end gap-2 md:gap-3 z-20 transition-all font-sans">
                  <div className="text-[7.5px] md:text-[9px] font-extrabold text-white bg-black/65 backdrop-blur-sm px-2.5 py-0.5 rounded-full mb-1 md:mb-1.5 flex items-center gap-1 shadow-md whitespace-nowrap">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Otis: Feeding
                  </div>
                  <div className="w-[105px] md:w-[135px] h-[105px] md:h-[135px] flex items-center justify-center filter drop-shadow-md">
                    <img src="/pug_eating_avatar.webp?v=2" className="w-full h-full object-contain" />
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
                <div className="w-full bg-black/20 backdrop-blur-md text-[7px] md:text-[9px] text-white/80 px-2 py-0.5 md:py-1 rounded flex justify-between items-center border border-white/5 font-medium z-10 font-sans">
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
                <div className="flex-1 w-full mt-2 mb-1 bg-stone-900/90 border border-stone-800/80 rounded-lg shadow-2xl overflow-hidden flex flex-col text-[7px] md:text-[8px] text-stone-300 font-sans">
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
                      <p className="text-[6.5px] md:text-[7.5px] text-stone-400">You've been working for 4.5 hours. Buddy is waiting at the front door!</p>
                    </div>
                  </div>
                </div>

                {/* Floating Widget - Bounding box removed for natural feel (Size increased by 50%) */}
                <div className="absolute bottom-3 md:bottom-4 right-3 md:right-4 flex flex-row items-end justify-end gap-2 md:gap-3 z-20 transition-all font-sans">
                  <div className="text-[7.5px] md:text-[9px] font-extrabold text-white bg-black/65 backdrop-blur-sm px-2.5 py-0.5 rounded-full mb-1 md:mb-1.5 flex items-center gap-1 shadow-md whitespace-nowrap">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    Buddy: Waiting
                  </div>
                  <div className="w-[105px] md:w-[135px] h-[105px] md:h-[135px] flex items-center justify-center filter drop-shadow-md">
                    <img src="/avatar_waiting.webp?v=2" className="w-full h-full object-contain" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sync status alert inside laptop screen */}
          <div className="absolute bottom-3 left-4 bg-stone-900/90 backdrop-blur px-2 py-0.5 rounded text-[7px] text-white/80 font-mono tracking-wider z-20 border border-white/5 uppercase font-bold">
            Pawsence Sync: {step}
          </div>
        </div>
      </div>

      {/* Laptop Keyboard Base */}
      <div className="relative w-[112%] h-3 md:h-4 bg-gradient-to-b from-stone-300 via-stone-400 to-stone-500 rounded-b-xl border-t border-stone-200 shadow-xl flex justify-center">
        {/* Open groove */}
        <div className="w-12 md:w-16 h-0.5 md:h-1 bg-stone-600 rounded-b-md" />
      </div>
      <div className="w-[85%] h-1 bg-stone-955/20 rounded-full blur-[3px]" />
    </div>
  );
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

      const triggerHeight = window.innerHeight * 0.45;

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
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const steps: Step[] = [
    {
      id: 'morning',
      time: 'Morning Sync',
      title: 'Quiet companionship during deep focus.',
      description: 'When they are asleep on the couch at home, their digital twin curls up peacefully next to your active windows. Enjoy their quiet presence without the distraction of a raw surveillance feed or battery drain.',
      avatarImg: '/avatar_sleeping.webp',
      icon: <Sun className="w-5 h-5 text-amber-500" />,
      bgGradient: 'from-amber-500/5 via-orange-500/2 to-transparent',
    },
    {
      id: 'afternoon',
      time: 'Afternoon Sync',
      title: 'Never miss their daily routines.',
      description: 'When they wake up to visit the food bowl, your desktop avatar springs to life, walking over to its own virtual bowl. Standard computer vision registers their feeding habits, keeping you subtly informed in real-time.',
      avatarImg: '/avatar_eating.webp',
      icon: <Coffee className="w-5 h-5 text-[#E87A5D]" />,
      bgGradient: 'from-emerald-500/5 via-teal-500/2 to-transparent',
    },
    {
      id: 'evening',
      time: 'Evening Sync',
      title: 'A gentle reminder to log off.',
      description: "When they begin pacing by the front door or looking up waiting, your digital pet mirrors their behavior. It's the ultimate, guilt-free reminder that it's time to close your editor and spend quality time with them.",
      avatarImg: '/avatar_waiting.webp',
      icon: <Sunset className="w-5 h-5 text-indigo-500" />,
      bgGradient: 'from-indigo-500/5 via-purple-500/2 to-transparent',
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
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
          <div className="inline-flex items-center gap-1.5 bg-[#E87A5D]/10 border border-[#E87A5D]/25 px-3.5 py-1 rounded-full text-xs font-bold text-[#E87A5D] mb-4">
            <span>Ambient Companionship</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-stone-900 font-display">
            A perfect sync, all day long.
          </h2>
          <p className="text-base md:text-lg text-stone-600 leading-relaxed font-sans">
            Link your pet camera once and let their real-world routines animate as a subtle, screen-based desktop presence.
          </p>
        </div>

        {/* DESKTOP SHOWCASE (lg and up) */}
        <div className="hidden lg:flex flex-row gap-12 lg:gap-20 items-start">
          
          {/* STICKY LEFT: The MacBook Mockup */}
          <div className="w-full lg:w-1/2 sticky top-36 h-[450px] flex items-center justify-center">
            <LaptopMockup step={activeStep} />
          </div>

          {/* SCROLLING RIGHT: The Copy */}
          <div className="w-full lg:w-1/2 lg:pt-16 pb-20 space-y-12">
            {steps.map((stepData) => {
              const refMap = {
                morning: morningRef,
                afternoon: afternoonRef,
                evening: eveningRef
              };
              return (
                <div
                  key={stepData.id}
                  ref={refMap[stepData.id]}
                  className={`p-8 rounded-3xl border transition-all duration-500 flex flex-col justify-center min-h-[350px] ${
                    activeStep === stepData.id
                      ? 'bg-white border-stone-200/80 shadow-xl shadow-stone-200/10'
                      : 'bg-transparent border-transparent opacity-50 scale-95'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-4 font-sans">
                    <div className="p-2 bg-[#E87A5D]/5 rounded-xl">
                      {stepData.icon}
                    </div>
                    <span className="text-xs font-bold text-[#E87A5D] uppercase tracking-wider">
                      {stepData.time}
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-extrabold mb-3 text-stone-900 font-display">
                    {stepData.title}
                  </h3>
                  <p className="text-sm md:text-base text-stone-600 leading-relaxed font-sans">
                    {stepData.description}
                  </p>
                </div>
              );
            })}
          </div>

        </div>

        {/* MOBILE SHOWCASE (below lg) */}
        <div className="lg:hidden space-y-16">
          {steps.map((stepData) => (
            <div key={stepData.id} className="space-y-6 flex flex-col items-center">
              <div className="bg-white border border-stone-200/80 rounded-3xl p-6 shadow-md w-full max-w-lg text-left">
                <div className="flex items-center gap-2 mb-3 font-sans">
                  <div className="p-2 bg-[#E87A5D]/5 rounded-xl">
                    {stepData.icon}
                  </div>
                  <span className="text-xs font-bold text-[#E87A5D] uppercase tracking-wider">
                    {stepData.time}
                  </span>
                </div>
                <h3 className="text-xl md:text-2xl font-extrabold mb-2 text-stone-900 font-display">
                  {stepData.title}
                </h3>
                <p className="text-xs md:text-sm text-stone-600 leading-relaxed font-sans">
                  {stepData.description}
                </p>
              </div>
              <div className="w-full max-w-lg px-2 flex justify-center">
                <LaptopMockup step={stepData.id} />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
