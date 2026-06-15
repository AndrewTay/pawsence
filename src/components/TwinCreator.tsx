import { useState, useEffect, lazy, Suspense, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Check, RefreshCw, ArrowRight } from 'lucide-react';
import { fal } from '@fal-ai/client';

const ThreePetCanvas = lazy(() => import('./ThreePetCanvas'));

const funWaitingTips = [
  "Microsoft's TRELLIS 2.0 is generating a high-quality 3D mesh. This process can take up to 5 minutes.",
  "Generating complex 3D shape structure and optimizing skeletal rigs in real-time...",
  "Synthesizing high-poly Physically-Based Rendering (PBR) texture maps for fur, shadows, and materials...",
  "Structuring latent representations (SLAT) to ensure clean topology and accurate features...",
  "Almost there! Optimizing the final GLB mesh for smooth browser rendering...",
  "Still working! Feel free to grab a cup of coffee and check back in a few minutes."
];

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
    photoImg: '/pug_photo.webp',
    avatars: {
      animated: '/pug_avatar.webp',
      realistic: '/pug_avatar_realistic.webp',
      anime: '/pug_avatar_anime.webp',
    },
  },
  {
    name: 'Luna',
    breed: 'Calico Cat',
    photoImg: '/cat_photo.webp',
    avatars: {
      animated: '/cat_avatar.webp',
      realistic: '/cat_avatar_realistic.webp',
      anime: '/cat_avatar_anime.webp',
    },
  },
  {
    name: 'Bini',
    breed: 'Dutch Bunny',
    photoImg: '/bunny_photo.webp',
    avatars: {
      animated: '/bunny_avatar.webp',
      realistic: '/bunny_avatar_realistic.webp',
      anime: '/bunny_avatar_anime.webp',
    },
  },
];

// Preloaded 3D GLB model mappings for each breed & style
const preloadedModels: Record<string, Partial<Record<'animated' | 'realistic' | 'anime', string>>> = {
  Otis: {
    animated: '/pug_3d.glb',
    realistic: '/pug_realistic_3d.glb',
    anime: '/pug_anime_3d.glb',
  },
  Luna: {
    animated: '/cat_animated_3d.glb',
    anime: '/cat_anime_3d.glb',
  },
  Bini: {
    anime: '/bunny_anime_3d.glb',
  }
};

const get3dModelPath = (petName: string, style: 'animated' | 'realistic' | 'anime'): string | null => {
  return preloadedModels[petName]?.[style] || null;
};

export default function TwinCreator() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedPet, setSelectedPet] = useState<PresetPet>(presets[0]);
  const [avatarStyle, setAvatarStyle] = useState<'animated' | 'realistic' | 'anime'>('animated');
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [scanStatus, setScanStatus] = useState<string>('Initializing model...');
  const [avatarAction, setAvatarAction] = useState<'idle' | 'jump' | 'spin' | 'wag'>('idle');

  // Advanced API states
  const [falApiKey, setFalApiKey] = useState<string>(() => localStorage.getItem('pawsence_fal_key') || '');
  const [customFile, setCustomFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [generatedModelUrl, setGeneratedModelUrl] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showApiKeyInput, setShowApiKeyInput] = useState<boolean>(false);
  const [currentTipIndex, setCurrentTipIndex] = useState<number>(0);

  // Synchronized refs to avoid exhaustive-deps warning in the step 2 useEffect
  const selectedPetRef = useRef(selectedPet);
  const avatarStyleRef = useRef(avatarStyle);
  const falApiKeyRef = useRef(falApiKey);
  const customFileRef = useRef(customFile);

  useEffect(() => {
    selectedPetRef.current = selectedPet;
    avatarStyleRef.current = avatarStyle;
    falApiKeyRef.current = falApiKey;
    customFileRef.current = customFile;
  }, [selectedPet, avatarStyle, falApiKey, customFile]);

  // File Upload handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCustomFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      
      const customPet: PresetPet = {
        name: 'My Pet',
        breed: 'Custom Upload',
        photoImg: url,
        avatars: {
          animated: url,
          realistic: url,
          anime: url,
        },
      };
      setSelectedPet(customPet);
    }
  };

  const triggerAction = useCallback((action: 'jump' | 'spin' | 'wag') => {
    if (avatarAction !== 'idle') return;
    setAvatarAction(action);
    const duration = action === 'wag' ? 1000 : 650;
    setTimeout(() => {
      setAvatarAction('idle');
    }, duration);
  }, [avatarAction]);

  const startScanning = (apiKeyOverride?: string) => {
    setScanProgress(0);
    setApiError(null);
    setGeneratedModelUrl(null);
    setCurrentTipIndex(0);
    if (apiKeyOverride !== undefined) {
      setFalApiKey(apiKeyOverride);
      localStorage.setItem('pawsence_fal_key', apiKeyOverride);
    }
    setStep(2);
  };

  // Scanning effect in Step 2
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    let isMounted = true;

    if (step === 2) {
      const currentFalApiKey = falApiKeyRef.current;
      const currentAvatarStyle = avatarStyleRef.current;
      const currentCustomFile = customFileRef.current;
      const currentSelectedPet = selectedPetRef.current;

      // Check if we should use the real API
      const useRealApi = currentFalApiKey.trim() !== '' && currentAvatarStyle === 'animated';

      if (!useRealApi) {
        // SCENARIO 1: Simulated Scanning
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
            const matchedStatus = statuses.find(s => next >= s.progress - 5 && next <= s.progress);
            if (matchedStatus) {
              setScanStatus(matchedStatus.text);
            }
            if (next >= 100) {
              if (interval) clearInterval(interval);
              setTimeout(() => {
                if (isMounted) setStep(3);
              }, 600);
              return 100;
            }
            return next;
          });
        }, 100);
      } else {
        // SCENARIO 2: Real TRELLIS 2.0 API call
        setScanStatus('Configuring Fal.ai API Client...');
        
        // Configure API client
        fal.config({
          credentials: currentFalApiKey.trim()
        });

        // Slow progress simulation to keep the UI moving while the API runs
        interval = setInterval(() => {
          setScanProgress((prev) => {
            if (prev < 90) {
              return prev + 1;
            }
            return prev;
          });
        }, 300);

        interface FalTrellisInput {
          image_url: File | Blob | string;
        }

        interface FalTrellisResult {
          model_glb?: {
            url: string;
          };
          data?: {
            model_glb?: {
              url: string;
            };
          };
        }

        interface QueueUpdate {
          status: 'IN_PROGRESS' | 'QUEUED' | 'IN_QUEUE' | 'COMPLETED' | 'FAILED';
          logs?: { message: string }[];
          queuePosition?: number;
        }

        const runTrellis = async () => {
          try {
            setScanStatus('Preparing source image...');
            let imageSource: File | Blob;

            if (currentCustomFile) {
              imageSource = currentCustomFile;
            } else {
              // Fetch the preset image as a Blob so Fal client can upload it
              const response = await fetch(currentSelectedPet.photoImg);
              imageSource = await response.blob();
            }

            if (!isMounted) return;
            setScanStatus('Queuing generation on Fal.ai (TRELLIS 2.0)...');

            const result = await fal.subscribe('fal-ai/trellis-2', {
              input: {
                image_url: imageSource
              } as FalTrellisInput,
              logs: true,
              onQueueUpdate: (update: QueueUpdate) => {
                if (!isMounted) return;
                if (update.status === 'IN_PROGRESS') {
                  const lastLog = update.logs && update.logs.length > 0 
                    ? update.logs[update.logs.length - 1].message 
                    : '';
                  if (lastLog) {
                    setScanStatus(`Trellis: ${lastLog.slice(0, 50)}...`);
                  } else {
                    setScanStatus('Running TRELLIS 2.0 model inference...');
                  }
                } else if (update.status === 'QUEUED' || update.status === 'IN_QUEUE') {
                  setScanStatus(`Queued in Fal.ai (position: ${update.queuePosition || 0})...`);
                }
              }
            }) as FalTrellisResult;

            if (!isMounted) return;

            // Extract the generated GLB URL
            let glbUrl = '';
            if (result && result.model_glb && result.model_glb.url) {
              glbUrl = result.model_glb.url;
            } else if (result && result.data && result.data.model_glb && result.data.model_glb.url) {
              glbUrl = result.data.model_glb.url;
            }

            if (!glbUrl) {
              throw new Error('API completed but did not return a model_glb URL.');
            }

            if (interval) clearInterval(interval);
            setScanProgress(100);
            setScanStatus('TRELLIS 2.0 model loaded successfully!');
            setGeneratedModelUrl(glbUrl);

            setTimeout(() => {
              if (isMounted) setStep(3);
            }, 800);

          } catch (error: unknown) {
            console.error('Trellis API generation failed:', error);
            if (!isMounted) return;
            if (interval) clearInterval(interval);
            const errorMessage = error instanceof Error ? error.message : String(error);
            setApiError(errorMessage || 'Unknown API Error occurred. Make sure your FAL_KEY is valid and has sufficient credits.');
            setScanStatus('Generation failed.');
          }
        };

        runTrellis();
      }
    }

    return () => {
      isMounted = false;
      if (interval) clearInterval(interval);
    };
  }, [step]);

  // Cycling tips effect for Step 2 during active API calls
  useEffect(() => {
    let tipInterval: ReturnType<typeof setInterval> | undefined;
    if (step === 2 && falApiKey.trim() !== '' && avatarStyle === 'animated') {
      tipInterval = setInterval(() => {
        setCurrentTipIndex((prev) => (prev + 1) % funWaitingTips.length);
      }, 7000);
    }
    return () => {
      if (tipInterval) clearInterval(tipInterval);
    };
  }, [step, falApiKey, avatarStyle]);

  // Autonomous animation loop (makes the pet feel alive in step 3)
  useEffect(() => {
    if (step !== 3) return;
    const interval = setInterval(() => {
      // 40% chance to perform a random action every 10 seconds if currently idle
      if (avatarAction === 'idle' && Math.random() < 0.4) {
        const actions: ('jump' | 'spin' | 'wag')[] = ['jump', 'spin', 'wag'];
        const randomAction = actions[Math.floor(Math.random() * actions.length)];
        triggerAction(randomAction);
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [step, avatarAction, triggerAction]);

  const resetCreator = () => {
    setStep(1);
    setScanProgress(0);
    setGeneratedModelUrl(null);
    setApiError(null);
    setAvatarAction('idle');
  };

  const modelPath = generatedModelUrl && avatarStyle === 'animated' 
    ? generatedModelUrl 
    : get3dModelPath(selectedPet.name, avatarStyle);
  const show3D = !!modelPath;

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
                      onClick={() => {
                        setSelectedPet(pet);
                        setCustomFile(null);
                        setPreviewUrl(null);
                      }}
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

                {/* Advanced API settings */}
                <div className="pt-4 border-t border-stone-200/60">
                  <button
                    type="button"
                    onClick={() => setShowApiKeyInput(!showApiKeyInput)}
                    className="text-xs font-bold text-stone-500 hover:text-stone-850 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>⚙️</span>
                    <span>{showApiKeyInput ? 'Hide API Settings' : 'Advanced: Real-time 3D Generation (TRELLIS 2.0)'}</span>
                  </button>
                  
                  {showApiKeyInput && (
                    <div className="mt-3 p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-3 animate-fade-in">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-stone-600 uppercase tracking-wider block">
                          Fal.ai API Key
                        </label>
                        <input
                          type="password"
                          value={falApiKey}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFalApiKey(val);
                            localStorage.setItem('pawsence_fal_key', val);
                          }}
                          placeholder="Enter your FAL_KEY..."
                          className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs focus:border-[#E87A5D] focus:outline-none font-mono"
                        />
                      </div>
                      <p className="text-[10px] text-stone-400 leading-normal">
                        Optional. Uses Microsoft's **TRELLIS 2.0** model via Fal.ai to generate custom 3D models. If blank, Otis/Luna will use preloaded 3D models. Learn how to <a href="https://fal.ai/docs/documentation/setting-up/authentication" target="_blank" rel="noopener noreferrer" className="text-[#E87A5D] hover:underline font-semibold">get your Fal.ai API key here</a>.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Upload Drag & Drop mockup */}
              <div 
                onClick={() => document.getElementById('pet-photo-upload')?.click()}
                className="border-2 border-dashed border-stone-300/80 hover:border-[#E87A5D]/80 rounded-3xl p-8 flex flex-col items-center justify-center text-center transition-all bg-stone-50/50 aspect-[4/3] relative group cursor-pointer overflow-hidden"
              >
                <input 
                  type="file"
                  id="pet-photo-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                
                {previewUrl ? (
                  <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-stone-50">
                    <img src={previewUrl} alt="Uploaded pet preview" className="w-full h-full object-cover animate-fade-in" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2">
                      <RefreshCw className="w-6 h-6 text-white" />
                      <span className="text-xs font-bold text-white">Change Image</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload className="w-10 h-10 text-stone-400 mb-4 group-hover:text-[#E87A5D] transition-colors" />
                    <h4 className="font-bold text-stone-800 text-sm">Drag and drop photo here</h4>
                    <p className="text-xs text-stone-400 mt-2 max-w-[200px]">
                      Upload a photo of your pet to generate a custom 3D model.
                    </p>
                    <div className="mt-5 px-4 py-2 bg-white border border-stone-200 rounded-full text-xs font-semibold text-stone-700 shadow-sm cursor-pointer hover:bg-stone-50 transition-all">
                      Browse Files
                    </div>
                  </>
                )}
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
                
                {/* Real API Waiting Notice */}
                {falApiKey.trim() !== '' && avatarStyle === 'animated' && !apiError && (
                  <div className="mt-6 p-4 bg-orange-50/50 border border-orange-100/70 rounded-2xl max-w-sm mx-auto shadow-sm animate-fade-in space-y-1.5 text-center">
                    <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-[#E87A5D]">
                      <span className="animate-pulse">⏳</span>
                      <span>TRELLIS 2.0 Generation Active</span>
                    </div>
                    <p className="text-[11px] text-stone-600 leading-relaxed font-medium transition-all duration-500 min-h-[44px] flex items-center justify-center">
                      {funWaitingTips[currentTipIndex]}
                    </p>
                    <div className="pt-1.5 border-t border-stone-200/50 flex justify-between items-center text-[9px] text-stone-400 font-bold uppercase tracking-wider">
                      <span>Wait time: ~2-5 mins</span>
                      <span className="lowercase font-normal">feel free to check back later</span>
                    </div>
                  </div>
                )}

                {apiError && (
                  <div className="mt-5 p-4 bg-red-50 border border-red-200 rounded-2xl text-left max-w-sm mx-auto shadow-sm animate-fade-in">
                    <p className="text-xs font-bold text-red-800">TRELLIS API Error</p>
                    <p className="text-[10px] text-red-600 font-mono mt-1 leading-normal whitespace-pre-wrap">{apiError}</p>
                    <div className="flex gap-2 mt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setApiError(null);
                          setStep(1);
                        }}
                        className="flex-1 px-3 py-2 bg-white border border-stone-200 hover:bg-stone-50 rounded-xl text-[10px] font-bold text-stone-700 cursor-pointer text-center"
                      >
                        Adjust Settings
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setApiError(null);
                          // Temporarily bypass API and run simulated path
                          startScanning('');
                        }}
                        className="flex-1 px-3 py-2 bg-[#E87A5D] hover:bg-[#D6684B] rounded-xl text-[10px] font-bold text-white cursor-pointer text-center"
                      >
                        Use Preloaded Model
                      </button>
                    </div>
                  </div>
                )}
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
                {show3D && modelPath ? (
                  <div className="w-full h-full z-10 relative">
                    <Suspense fallback={
                      <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-md flex flex-col items-center justify-center z-30 transition-all duration-500">
                        <div className="w-10 h-10 rounded-full border-3 border-orange-500/20 border-t-orange-500 animate-spin" />
                      </div>
                    }>
                      <ThreePetCanvas 
                        key={selectedPet.name + '_' + avatarStyle + (generatedModelUrl ? '_generated' : '_default')}
                        modelPath={modelPath} 
                        action={avatarAction} 
                      />
                    </Suspense>
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

              {/* Interaction Animation Control Pills */}
              <div className="flex gap-2.5 mt-5 justify-center z-20">
                {[
                  { id: 'wag' as const, label: '🐾 Wag Tail' },
                  { id: 'jump' as const, label: '🦘 Jump' },
                  { id: 'spin' as const, label: '✨ Spin' }
                ].map((act) => (
                  <button
                    key={act.id}
                    onClick={() => triggerAction(act.id)}
                    disabled={avatarAction !== 'idle'}
                    className="px-4 py-2 bg-[#FAF8F5] hover:bg-stone-100 disabled:opacity-50 text-stone-700 disabled:text-stone-400 text-xs font-bold rounded-full border border-stone-200 shadow-sm transition-all active:scale-[0.97] cursor-pointer"
                  >
                    {act.label}
                  </button>
                ))}
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
            onClick={() => startScanning()}
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
