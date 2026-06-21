import { useState, useEffect, lazy, Suspense } from 'react';
import { ChevronRight } from 'lucide-react';
import HeroSimulator from './components/HeroSimulator';
import ScrollShowcase from './components/ScrollShowcase';
import TwinCreator from './components/TwinCreator';
import BentoBox from './components/BentoBox';

const BetaModal = lazy(() => import('./components/BetaModal'));
const PrivacyPolicy = lazy(() => import('./components/PrivacyPolicy'));

export default function App() {
  const [isBetaOpen, setIsBetaOpen] = useState(false);
  const [currentRoute, setCurrentRoute] = useState(() => {
    const hash = window.location.hash;
    if (hash === '#/privacy') return 'privacy';
    return 'home';
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#/privacy') {
        setCurrentRoute('privacy');
        window.scrollTo(0, 0);
      } else {
        setCurrentRoute('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (currentRoute === 'privacy') {
    return (
      <Suspense fallback={
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-[#E87A5D] border-t-transparent rounded-full animate-spin"></div>
        </div>
      }>
        <PrivacyPolicy goHome={() => { window.location.hash = '#/'; }} />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-800 font-sans selection:bg-[#E87A5D] selection:text-white">
      
      {/* --- NAVIGATION --- */}
      <nav className="fixed w-full top-0 z-40 bg-[#FAF8F5]/85 backdrop-blur-md border-b border-stone-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div className="text-xl sm:text-2xl font-black tracking-tight text-stone-900 flex items-center gap-1.5 font-display">
            Pawsence<span className="text-[#E87A5D]">.</span>
          </div>
          
          <div className="hidden md:flex space-x-10 text-sm font-semibold text-stone-600">
            <a href="#how-it-works" className="hover:text-stone-900 transition-colors">How it Works</a>
            <a href="#creator-sandbox" className="hover:text-stone-900 transition-colors">Creator Sandbox</a>
            <a href="#cameras" className="hover:text-stone-900 transition-colors">Supported Cameras</a>
            <a href="#ecosystem" className="hover:text-stone-900 transition-colors">Ecosystem</a>
          </div>

          <button
            onClick={() => setIsBetaOpen(true)}
            className="bg-stone-900 text-stone-50 px-4 py-2 sm:px-6 sm:py-2.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider hover:bg-stone-800 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md shadow-stone-950/5 cursor-pointer"
          >
            Get Early Access
          </button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="pt-36 pb-16 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">

        {/* Main Headings */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black leading-[1.05] tracking-tight text-stone-900 max-w-4xl font-display">
          Your furbaby's presence <br/>
          <span className="text-stone-400">on your screen.</span>
        </h1>
        
        <p className="text-base md:text-lg text-stone-500 leading-relaxed max-w-2xl mt-6 px-4">
          Pawsence connects to your existing pet camera or wearable*, and brings your pet's presence to life as a 3D desktop companion.
        </p>
        <span className="text-[11px] text-stone-400/85 font-mono mt-2 block">
          *wearable needs to support action detection
        </span>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-10 mb-16 px-4 w-full max-w-md mx-auto sm:max-w-none sm:mx-0 sm:px-0 sm:w-auto justify-center">
          <button
            onClick={() => setIsBetaOpen(true)}
            className="bg-[#E87A5D] text-white px-8 py-4 rounded-full text-sm font-bold uppercase tracking-wider hover:bg-[#D6684B] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2 shadow-xl shadow-orange-500/10 cursor-pointer"
          >
            <span>Create Your Pet's Twin</span>
            <ChevronRight className="w-4 h-4 stroke-[3]" />
          </button>
          
          <a
            href="#creator-sandbox"
            className="bg-white border border-stone-200 text-stone-800 px-8 py-4 rounded-full text-sm font-bold uppercase tracking-wider hover:bg-stone-50 hover:scale-[1.02] transition-all flex items-center justify-center cursor-pointer shadow-sm"
          >
            Try Creator Sandbox
          </a>
        </div>

        {/* Interactive Live Simulator */}
        <HeroSimulator />

      </section>

      {/* --- DAY IN THE LIFE (STICKY SCROLL) --- */}
      <ScrollShowcase />

      {/* --- THREE STEP MAGIC (CREATOR SANDBOX) --- */}
      <section id="creator-sandbox" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1 bg-stone-200/50 border border-stone-200/60 px-3 py-1 rounded-full text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-3">
            <span>Rigging sandbox</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-stone-900 font-display">
            Your actual pet, in three steps.
          </h2>
          <p className="text-base md:text-lg text-stone-600 max-w-xl mx-auto">
            No complex 3D scanning required. Just upload photos you already have on your phone, and test our local rigging scanner below.
          </p>
        </div>

        {/* Interactive Wizard Sandbox */}
        <TwinCreator />
      </section>

      {/* --- HARDWARE GRID & PRIVACY --- */}
      <section id="cameras" className="py-24 bg-white border-t border-stone-200/60">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          
          <div className="space-y-6">
            <div className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full text-[10px] font-bold text-emerald-800 uppercase tracking-widest">
              <span>Universal integration</span>
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight text-stone-900 font-display leading-[1.1]">
              Works with the device you already own.
            </h2>
            <p className="text-base md:text-lg text-stone-600 leading-relaxed">
              No proprietary hardware required. If you have a pet camera or wearable, we can translate its feed onto your desktop pet.
            </p>

          </div>
          
          {/* Camera Brands grid */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { brand: 'Wyze', desc: 'Wyze Cam v2/v3/v4', icon: '📷', bg: 'from-orange-500/5 to-orange-500/0' },
              { brand: 'Furbo', desc: 'Interactive Dog Feed', icon: '🐶', bg: 'from-emerald-500/5 to-emerald-500/0' },
              { brand: 'Ring', desc: 'Indoor Nest Feeds', icon: '🏠', bg: 'from-blue-500/5 to-blue-500/0' },
              { brand: 'FitBark', desc: 'GPS & Activity Tracker', icon: '⌚', bg: 'from-purple-500/5 to-purple-500/0' }
            ].map((item, i) => (
              <div
                key={i}
                className={`aspect-[4/3] bg-gradient-to-tr ${item.bg} bg-stone-50 rounded-3xl border border-stone-200/80 p-6 flex flex-col justify-between hover:border-stone-300 hover:shadow-md transition-all cursor-default group`}
              >
                <div className="w-12 h-12 rounded-2xl bg-white border border-stone-200/80 flex items-center justify-center text-xl shadow-sm group-hover:scale-[1.05] transition-all">
                  {item.icon}
                </div>
                <div>
                  <span className="font-extrabold text-stone-850 text-sm block tracking-tight">{item.brand}</span>
                  <span className="text-[10px] text-stone-400 font-mono mt-0.5 block">{item.desc}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* --- BENTO BOX CROSS PLATFORM --- */}
      <section id="ecosystem" className="py-24 px-6 max-w-7xl mx-auto">
        <BentoBox />
      </section>

      {/* --- FOOTER CTA --- */}
      <section className="py-32 bg-stone-900 text-center px-6 border-t border-stone-800 relative overflow-hidden">
        {/* Glow effect back */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#E87A5D] opacity-10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-3xl mx-auto relative z-10 space-y-8">
          <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white font-display leading-[1.1]">
            Keep them by your side,<br/>
            throughout the workday.
          </h2>
          <p className="text-base md:text-lg text-stone-400 max-w-md mx-auto">
            Join the early beta list to start generating your pet's digital twin today.
          </p>
          
          <button
            onClick={() => setIsBetaOpen(true)}
            className="bg-[#E87A5D] text-white px-10 py-5 rounded-full text-sm font-bold uppercase tracking-wider hover:bg-[#D6684B] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-orange-500/20 cursor-pointer"
          >
            Get Started Now
          </button>
        </div>
      </section>

      {/* FOOTER LINKS */}
      <footer className="bg-stone-900 text-stone-500 py-10 text-xs text-center border-t border-stone-800 font-mono">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Pawsence. Designed for pet parents.</p>
          <div className="flex gap-6 text-[10px]">
            <a href="#how-it-works" className="hover:text-stone-300">How it Works</a>
            <a href="#creator-sandbox" className="hover:text-stone-300">Sandbox</a>
            <a href="#cameras" className="hover:text-stone-300">Privacy & Feeds</a>
          </div>
        </div>
      </footer>

      {/* --- BETA SIGNUP MODAL --- */}
      <Suspense fallback={null}>
        <BetaModal isOpen={isBetaOpen} onClose={() => setIsBetaOpen(false)} />
      </Suspense>

    </div>
  );
}
