import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Monitor, Heart, ShieldCheck } from 'lucide-react';

interface PetState {
  id: 'sleep' | 'eat' | 'wait';
  label: string;
  cameraImg: string;
  cameraVideo?: string;
  avatarImg: string;
  desktopPoster: string;
  desktopVideo?: string;
  cvLabel: string;
  avatarLabel: string;
  statusColor: string;
  bgGlow: string;
}

const states: PetState[] = [
  {
    id: 'sleep',
    label: 'Sleeping',
    cameraImg: '/dog_sleeping.webp',
    cameraVideo: '/hero-loops/camera-sleep.mp4',
    avatarImg: '/avatar_sleeping.webp?v=2',
    desktopPoster: '/mac_wallpaper.webp',
    desktopVideo: '/hero-loops/desktop-sleep.mp4',
    cvLabel: 'Activity: Inactive (Resting)',
    avatarLabel: 'Twin State: Deep Sleep',
    statusColor: 'bg-blue-500',
    bgGlow: 'from-blue-500/10 to-transparent',
  },
  {
    id: 'eat',
    label: 'Eating',
    cameraImg: '/dog_eating.webp',
    cameraVideo: '/hero-loops/camera-eating.mp4',
    avatarImg: '/avatar_eating.webp?v=2',
    desktopPoster: '/mac_wallpaper.webp',
    desktopVideo: '/hero-loops/desktop-eating.mp4',
    cvLabel: 'Activity: Active (Feeding)',
    avatarLabel: 'Twin State: Mimicking (Feeding)',
    statusColor: 'bg-emerald-500',
    bgGlow: 'from-emerald-500/10 to-transparent',
  },
  {
    id: 'wait',
    label: 'Waiting',
    cameraImg: '/dog_waiting.webp',
    cameraVideo: '/hero-loops/camera-waiting.mp4',
    avatarImg: '/avatar_waiting.webp?v=2',
    desktopPoster: '/mac_wallpaper.webp',
    desktopVideo: '/hero-loops/desktop-waiting.mp4',
    cvLabel: 'Activity: Alert (Waiting)',
    avatarLabel: 'Twin State: Mimicking (Alert)',
    statusColor: 'bg-[#E87A5D]',
    bgGlow: 'from-orange-500/10 to-transparent',
  },
];

export default function HeroSimulator() {
  const [currentState, setCurrentState] = useState<PetState>(states[0]);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const handleStateChange = (state: PetState) => {
    if (state.id === currentState.id) return;
    setIsSyncing(true);
    // Simulate camera feed network delay & computer vision processing
    setTimeout(() => {
      setCurrentState(state);
      setIsSyncing(false);
    }, 450);
  };

  return (
    <div className="w-full max-w-[1420px] mx-auto px-0 sm:px-2 lg:px-4 py-8">
      {/* Simulation Controls */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {states.map((state) => {
          const isActive = currentState.id === state.id;
          return (
            <button
              key={state.id}
              onClick={() => handleStateChange(state)}
              disabled={isSyncing}
              className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-[#E87A5D] text-white shadow-lg shadow-orange-500/20 scale-105'
                  : 'bg-white hover:bg-stone-50 text-stone-700 border border-stone-200/80'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-white animate-pulse' : state.statusColor}`} />
              Simulate {state.label}
            </button>
          );
        })}
      </div>

      {/* Split Screen Simulator Frame */}
      <div className="grid xl:grid-cols-2 gap-6 lg:gap-8 items-start relative mb-8">

        {/* LEFT PANEL: Live Camera Feed */}
        <div className="bg-white rounded-3xl p-3 sm:p-5 border border-stone-200/60 shadow-xl flex flex-col justify-between overflow-hidden relative group">
          {/* Header */}
          <div className="flex justify-between items-center gap-3 mb-4 z-10 select-none">
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-stone-700" />
              <span className="font-bold text-sm text-stone-900 tracking-tight">Camera Feed (1080p)</span>
            </div>
            <div className="bg-stone-950/80 backdrop-blur px-2.5 py-1 rounded-full text-[9px] text-white uppercase tracking-wider font-bold flex items-center gap-1.5 border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
              Live Feed
            </div>
          </div>

          {/* Camera Frame */}
          <div className="relative aspect-video rounded-2xl bg-stone-900 overflow-hidden border border-stone-800 shadow-inner flex items-center justify-center">
            
            {/* Live loop */}
            <AnimatePresence mode="wait">
              {currentState.cameraVideo ? (
                <motion.video
                  key={currentState.id + '-cam-video'}
                  src={currentState.cameraVideo}
                  poster={currentState.cameraImg}
                  aria-label={`Real pet ${currentState.label}`}
                  className="w-full h-full object-cover opacity-85"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  initial={{ opacity: 0, filter: 'blur(8px)' }}
                  animate={{ opacity: 0.85, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, filter: 'blur(8px)' }}
                  transition={{ duration: 0.4 }}
                />
              ) : (
                <motion.img
                  key={currentState.id + '-cam-image'}
                  src={currentState.cameraImg}
                  alt={`Real pet ${currentState.label}`}
                  className="w-full h-full object-cover opacity-85"
                  initial={{ opacity: 0, filter: 'blur(8px)' }}
                  animate={{ opacity: 0.85, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, filter: 'blur(8px)' }}
                  transition={{ duration: 0.4 }}
                />
              )}
            </AnimatePresence>

            {/* Computer Vision Overlay Grid & Keypoints */}
            <div className="absolute inset-0 pointer-events-none p-4 hidden lg:flex flex-col justify-between">
              {/* Scanline / Grid overlay */}
              <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%]" />

              {/* Top Details */}
              <div className="flex justify-between">
                <span className="font-mono text-[9px] text-[#A3E635] bg-black/60 px-2 py-0.5 rounded backdrop-blur">
                  SYS.CV.DETECTED: DOG (99.8%)
                </span>
                <span className="font-mono text-[9px] text-[#A3E635] bg-black/60 px-2 py-0.5 rounded backdrop-blur">
                  FPS: 60
                </span>
              </div>

              {/* Simulated Skeleton Tracking Bounding Box */}
              <motion.div
                key={currentState.id + '-bbox'}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="absolute border border-[#A3E635]/60 rounded-lg shadow-[0_0_15px_rgba(163,230,53,0.15)] flex flex-col justify-between p-2"
                style={{
                  top: currentState.id === 'sleep' ? '22%' : currentState.id === 'eat' ? '24%' : '14%',
                  bottom: currentState.id === 'sleep' ? '14%' : currentState.id === 'eat' ? '12%' : '12%',
                  left: currentState.id === 'sleep' ? '18%' : currentState.id === 'eat' ? '24%' : '28%',
                  right: currentState.id === 'sleep' ? '18%' : currentState.id === 'eat' ? '22%' : '28%',
                }}
              >
                {/* Bounding box corners */}
                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#A3E635]" />
                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#A3E635]" />
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#A3E635]" />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#A3E635]" />

                <div className="absolute bottom-1 left-2 font-mono text-[8px] text-[#A3E635] font-semibold tracking-wide">
                  {currentState.cvLabel}
                </div>
              </motion.div>

              {/* Scanning status */}
              <div className="mt-auto">
                <span className="font-mono text-[9px] text-[#A3E635] bg-black/60 px-2 py-0.5 rounded backdrop-blur flex items-center gap-1 w-max">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A3E635] animate-ping" />
                  LOCAL FRAME ANALYZER: ACTIVE
                </span>
              </div>
            </div>

            {/* Sync Overlay Loader */}
            {isSyncing && (
              <div className="absolute inset-0 bg-stone-950/40 backdrop-blur-sm flex items-center justify-center z-20">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                  <span className="text-xs text-white/80 font-mono tracking-widest uppercase">Processing Feed...</span>
                </div>
              </div>
            )}
          </div>

          {/* Footer Metadata */}
          <div className="hidden lg:flex items-center justify-between mt-4 text-xs text-stone-500 font-mono select-none">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Source: Wyze Cam V3
            </span>
            <span>RTSP://192.168.1.45</span>
          </div>
        </div>

        {/* RIGHT PANEL: Digital Twin Desktop */}
        <div className="bg-white rounded-3xl p-3 sm:p-5 border border-stone-200/60 shadow-xl flex flex-col justify-between overflow-hidden relative group">
          {/* Header */}
          <div className="flex justify-between items-center gap-3 mb-4 z-10 select-none">
            <div className="flex items-center gap-2">
              <Monitor className="w-5 h-5 text-stone-700" />
              <span className="font-bold text-sm text-stone-900 tracking-tight">Mac Desktop Widget</span>
            </div>
            <div className="bg-orange-50 border border-orange-200/60 px-3 py-1 rounded-full text-[10px] text-[#E87A5D] font-bold flex items-center gap-1">
              <Heart className="w-3 h-3 fill-current animate-pulse" />
              Pawsence Active
            </div>
          </div>

          {/* Desktop Frame */}
          <div className="relative aspect-video rounded-2xl bg-stone-900 overflow-hidden border border-stone-200 flex items-center justify-center shadow-inner">
            
            <AnimatePresence mode="wait">
              {currentState.desktopVideo ? (
                <motion.video
                  key={currentState.id + '-desktop-video'}
                  src={currentState.desktopVideo}
                  poster={currentState.desktopPoster}
                  aria-label={`Digital Twin ${currentState.label}`}
                  className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  initial={{ opacity: 0, scale: 1.015, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 1.015, filter: 'blur(8px)' }}
                  transition={{ duration: 0.4 }}
                />
              ) : (
                <motion.div
                  key={currentState.id + '-desktop-fallback'}
                  className="absolute inset-0 select-none pointer-events-none"
                  initial={{ opacity: 0, scale: 1.015, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 1.015, filter: 'blur(8px)' }}
                  transition={{ duration: 0.4 }}
                >
                  <img
                    src={currentState.desktopPoster}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute bottom-5 right-5 sm:bottom-6 sm:right-6 lg:bottom-10 lg:right-10 w-28 h-28 sm:w-36 sm:h-36 lg:w-44 lg:h-44 flex flex-col justify-end items-center">
                    <img
                      src={currentState.avatarImg}
                      alt={`Digital Twin ${currentState.label}`}
                      className="w-full h-[88%] object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.35)]"
                    />
                    <div className="w-[70%] h-[6px] bg-stone-950/20 rounded-full blur-[3px] mt-1" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* macOS Dock */}
            {!currentState.desktopVideo && (
              <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 h-8 bg-white/20 backdrop-blur-lg border border-white/10 rounded-xl px-2 hidden lg:flex items-center gap-2.5 z-20 shadow-lg pointer-events-none select-none">
                <span className="text-[13px]">📁</span>
                <span className="text-[13px]">🌐</span>
                <span className="text-[13px]">💬</span>
                <span className="text-[13px] bg-[#E87A5D]/20 border border-[#E87A5D]/40 px-1 rounded-md">🐾</span>
                <span className="text-[13px]">🎵</span>
                <span className="text-[13px]">⚙️</span>
              </div>
            )}

            <div className="sr-only" aria-live="polite">
              {currentState.avatarLabel}
            </div>

            {/* Sync Overlay Loader */}
            {isSyncing && (
              <div className="absolute inset-0 bg-stone-100/40 backdrop-blur-sm flex items-center justify-center z-30">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 rounded-full border-2 border-[#E87A5D]/20 border-t-[#E87A5D] animate-spin" />
                  <span className="text-xs text-stone-700 font-mono tracking-widest uppercase">Syncing Avatar...</span>
                </div>
              </div>
            )}
          </div>

          {/* Footer Metadata */}
          <div className="hidden lg:flex items-center justify-between mt-4 text-xs text-stone-500 font-mono select-none">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              On-Device Render
            </span>
            <span>RAM Usage: 34MB</span>
          </div>
        </div>
      </div>


    </div>
  );
}
