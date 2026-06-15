import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Check, RefreshCw, ArrowRight } from 'lucide-react';
import ThreePetCanvas from './ThreePetCanvas';

interface PresetPet {
  name: string;
  breed: string;
  photoImg: string;
  avatars: {
    animated: string;
    realistic: string;
    anime: string;
  };
}

const presets: PresetPet[] = [
  {
    name: 'Otis',
    breed: 'Pug',
    photoImg: '/pug_photo.png',
    avatars: {
      animated: '/pug_avatar.png',
      realistic: '/pug_avatar_realistic.png',
      anime: '/pug_avatar_anime.png',
    },
  },
  {
    name: 'Luna',
    breed: 'Calico Cat',
    photoImg: '/cat_photo.png',
    avatars: {
      animated: '/cat_avatar.png',
      realistic: '/cat_avatar_realistic.png',
      anime: '/cat_avatar_anime.png',
    },
  },
  {
    name: 'Bini',
    breed: 'Dutch Bunny',
    photoImg: '/bunny_photo.png',
    avatars: {
      animated: '/bunny_avatar.png',
      realistic: '/bunny_avatar_realistic.png',
      anime: '/bunny_avatar_anime.png',
    },
  },
];

export default function TwinCreator() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedPet, setSelectedPet] = useState<PresetPet>(presets[0]);
  const [avatarStyle, setAvatarStyle] = useState<'animated' | 'realistic' | 'anime'>('animated');
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [scanStatus, setScanStatus] = useState<string>('Initializing model...');
  const avatarAction = 'idle' as 'idle' | 'jump' | 'spin' | 'wag';

  // Scanning effect in Step 2
  useEffect(() => {
    let interval: any;
    if (step === 2) {
      setScanProgress(0);
      setScanStatus('Initializing mesh rig...');
      
      const statuses = [
        { progress: 20, text: 'Analyzing coat markings & patterns...' },
        { progress: 45, text: 'Mapping skeletal joints (30 nodes)...' },
        { progress: 70, text: 'Generating high-poly 3D textures...' },
        { progress: 90, text: 'Optimizing low-poly mesh for desktop...' },
        { progress: 100, text: 'Finalizing digital twin!' }
      ];

      interval = setInterval(() => {
        setScanProgress((prev) => {
          const next = prev + 4;
          
          // Update status message based on progress
          const matchedStatus = statuses.find(s => next >= s.progress - 5 && next <= s.progress);
          if (matchedStatus) {
            setScanStatus(matchedStatus.text);
          }

          if (next >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setStep(3);
            }, 600);
            return 100;
          }
          return next;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [step]);



  const resetCreator = () => {
    setStep(1);
    setScanProgress(0);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-3xl border border-stone-200/80 shadow-2xl overflow-hidden p-6 md:p-10 relative">
      
      {/* Wizard Steps indicator */}
      <div className="flex justify-between items-center max-w-md mx-auto mb-10 relative">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-stone-100 -translate-y-1/2 z-0" />
        <div
          className="absolute top-1/2 left-0 h-0.5 bg-[#E87A5D] -translate-y-1/2 z-0 transition-all duration-500"
          style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
        />

        {[
          { number: 1, label: 'Upload' },
          { number: 2, label: 'Generate' },
          { number: 3, label: 'Interact' },
        ].map((item) => (
          <div key={item.number} className="relative z-10 flex flex-col items-center gap-1.5 bg-white px-3">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                step >= item.number
                  ? 'bg-[#E87A5D] text-white shadow-md shadow-orange-500/10'
                  : 'bg-stone-100 text-stone-400 border border-stone-200'
              }`}
            >
              {step > item.number ? <Check className="w-4 h-4" /> : item.number}
            </div>
            <span className={`text-[11px] font-semibold tracking-wider uppercase ${step >= item.number ? 'text-stone-800' : 'text-stone-400'}`}>
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Main Wizard Area */}
      <div className="min-h-[360px] flex flex-col justify-between">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: UPLOAD & SELECTION */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="grid md:grid-cols-2 gap-8 items-center"
            >
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-stone-900 tracking-tight">Choose a pet to test</h3>
                  <p className="text-sm text-stone-500 mt-2">
                    Select one of our preset pets to experience the 3D generation rigging immediately, or upload your own photo.
                  </p>
                </div>

                 {/* Preset List */}
                <div className="space-y-3">
                  {presets.map((pet) => (
                    <button
                      key={pet.name}
                      onClick={() => setSelectedPet(pet)}
                      className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all duration-200 cursor-pointer ${
                        selectedPet.name === pet.name
                          ? 'border-[#E87A5D] bg-orange-50/20 shadow-md shadow-orange-500/5'
                          : 'border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-stone-900 text-sm">{pet.name}</div>
                        <div className="text-xs text-stone-500">{pet.breed}</div>
                      </div>
                      <div className="w-10 h-10 rounded-xl overflow-hidden border border-stone-200 bg-stone-100">
                        <img src={pet.photoImg} alt={pet.name} className="w-full h-full object-cover" />
                      </div>
                    </button>
                  ))}
                </div>

                {/* Avatar Style Selector */}
                <div className="space-y-3 pt-2 font-sans">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block">Select Avatar Style</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {([
                      { id: 'animated', name: 'Animated', desc: 'Cute 3D character' },
                      { id: 'realistic', name: 'Realistic', desc: 'Real-world texture' },
                      { id: 'anime', name: 'Anime', desc: 'Cozy illustration' }
                    ] as const).map((style) => (
                      <button
                        key={style.id}
                        onClick={() => setAvatarStyle(style.id)}
                        className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200 cursor-pointer min-h-[64px] sm:h-[72px] ${
                          avatarStyle === style.id
                            ? 'border-[#E87A5D] bg-orange-50/10 shadow-sm'
                            : 'border-stone-200 hover:border-stone-300 bg-white'
                        }`}
                      >
                        <span className={`text-xs font-bold ${avatarStyle === style.id ? 'text-[#E87A5D]' : 'text-stone-850'}`}>
                          {style.name}
                        </span>
                        <span className="text-[9px] text-stone-400 font-medium leading-none mt-1 sm:mt-0">
                          {style.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Upload Drag & Drop mockup */}
              <div className="border-2 border-dashed border-stone-300/80 hover:border-[#E87A5D]/80 rounded-3xl p-8 flex flex-col items-center justify-center text-center transition-all bg-stone-50/50 aspect-[4/3] relative group">
                <Upload className="w-10 h-10 text-stone-400 mb-4 group-hover:text-[#E87A5D] transition-colors" />
                <h4 className="font-bold text-stone-800 text-sm">Drag and drop photos here</h4>
                <p className="text-xs text-stone-400 mt-2 max-w-[200px]">
                  Upload 3 to 5 clear photos of your pet (JPG, PNG) from different angles.
                </p>
                <div className="mt-5 px-4 py-2 bg-white border border-stone-200 rounded-full text-xs font-semibold text-stone-700 shadow-sm cursor-pointer hover:bg-stone-50 transition-all">
                  Browse Files
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: SCANNING ANIMATION */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="flex flex-col items-center justify-center py-6 text-center"
            >
              {/* Image Scanning Ring */}
              <div className="relative w-56 h-56 rounded-3xl overflow-hidden border border-stone-200 bg-stone-900 shadow-2xl flex items-center justify-center mb-8">
                <img
                  src={selectedPet.photoImg}
                  alt={selectedPet.name}
                  className="w-full h-full object-cover opacity-60"
                />

                {/* Laser scan line */}
                <motion.div
                  className="absolute left-0 right-0 h-1 bg-[#E87A5D] shadow-[0_0_15px_#E87A5D] z-10"
                  animate={{
                    top: ['0%', '100%', '0%']
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />

                {/* Skeleton Keypoint Node Dots */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                  {/* Head dot */}
                  <span className="absolute top-[25%] left-[50%] w-2.5 h-2.5 bg-emerald-400 rounded-full shadow-[0_0_10px_#34d399] animate-ping" />
                  {/* Paw dots */}
                  <span className="absolute bottom-[20%] left-[30%] w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_8px_#34d399]" />
                  <span className="absolute bottom-[20%] right-[30%] w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_8px_#34d399]" />
                  {/* Tail dot */}
                  <span className="absolute bottom-[40%] right-[20%] w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_8px_#34d399]" />

                  {/* Connecting line overlays */}
                  <svg className="absolute inset-0 w-full h-full opacity-40">
                    <line x1="50%" y1="25%" x2="30%" y2="80%" stroke="#34d399" strokeWidth="1.5" />
                    <line x1="50%" y1="25%" x2="70%" y2="80%" stroke="#34d399" strokeWidth="1.5" />
                    <line x1="30%" y1="80%" x2="70%" y2="80%" stroke="#34d399" strokeWidth="1.5" />
                  </svg>
                </div>
              </div>

              {/* Progress Text */}
              <div className="w-full max-w-sm">
                <div className="flex justify-between text-xs font-bold font-mono text-stone-500 mb-1.5 uppercase">
                  <span>Rigging Engine</span>
                  <span>{scanProgress}%</span>
                </div>
                <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden mb-3">
                  <div
                    className="bg-[#E87A5D] h-full rounded-full transition-all duration-100 ease-out"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
                <p className="text-sm text-stone-700 font-medium font-mono min-h-[20px]">{scanStatus}</p>
              </div>
            </motion.div>
          )}

          {/* STEP 3: INTERACTIVE 3D AVATAR MOCK */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="flex flex-col items-center justify-center py-6 text-center"
            >
              {/* Centered Avatar View (Made slightly larger for showcase) */}
              <div className="relative w-80 h-80 md:w-96 md:h-96 rounded-3xl bg-stone-50 border border-stone-200 shadow-xl flex items-center justify-center overflow-hidden">
                {/* Grid background */}
                <div className="absolute inset-0 bg-grid-pattern opacity-10 bg-[size:16px_16px]" />
                
                 {/* The Twin Avatar */}
                {avatarStyle === 'animated' && (selectedPet.name === 'Otis' || selectedPet.name === 'Luna') ? (
                  <div className="w-full h-full z-10 relative">
                    <ThreePetCanvas 
                      key={selectedPet.name}
                      modelPath={selectedPet.name === 'Otis' ? '/pug_3d.glb' : '/cat_animated_3d.glb'} 
                      action={avatarAction} 
                    />
                  </div>
                ) : (
                  <motion.img
                    src={selectedPet.avatars[avatarStyle]}
                    alt={selectedPet.name}
                    className="w-[85%] h-[85%] object-contain drop-shadow-xl z-10"
                    animate={
                      avatarAction === 'jump'
                        ? { y: [-20, 0], scale: [1, 1.05, 1] }
                        : avatarAction === 'spin'
                        ? { rotate: [0, 360], scale: [1, 0.95, 1] }
                        : avatarAction === 'wag'
                        ? { rotate: [0, -5, 5, -5, 5, 0], x: [0, -3, 3, -3, 3, 0] }
                        : { y: 0, rotate: 0, scale: 1 }
                    }
                    transition={{
                      duration: avatarAction === 'wag' ? 0.8 : 0.5,
                      ease: 'easeInOut',
                    }}
                  />
                )}
                
                {/* Shadow */}
                <div className="absolute bottom-[8%] w-1/2 h-3 bg-stone-900/5 rounded-full blur-[4px] z-0" />

                <div className="absolute top-4 left-4 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[9px] font-bold text-emerald-800 uppercase font-mono tracking-wider">
                  Model Ready
                </div>
              </div>
              
              <span className="text-xs text-stone-400 mt-4 font-mono uppercase tracking-wider">
                Test rig: {selectedPet.name} ({selectedPet.breed}) - {avatarStyle} style
              </span>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Button controls bottom */}
      <div className="border-t border-stone-100 pt-6 mt-8 flex justify-between items-center z-10 relative">
        {step === 1 ? (
          <div className="text-xs text-stone-400 font-medium">Select a breed to generate twin.</div>
        ) : (
          <button
            onClick={resetCreator}
            className="flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Sandbox
          </button>
        )}

        {step === 1 && (
          <button
            onClick={() => setStep(2)}
            className="px-6 py-3 bg-[#E87A5D] hover:bg-[#D6684B] text-white text-sm font-semibold rounded-xl flex items-center gap-1.5 shadow-lg shadow-orange-500/10 cursor-pointer"
          >
            <span>Generate 3D Twin</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
