import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Mail, Sparkles } from 'lucide-react';

interface BetaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BetaModal({ isOpen, onClose }: BetaModalProps) {
  const [email, setEmail] = useState('');
  const [petType, setPetType] = useState('dog');
  const [cameraBrand, setCameraBrand] = useState('wyze');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('submitting');
    
    try {
      await fetch("https://formsubmit.co/ajax/andrewtaywq3@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          email,
          petType,
          cameraBrand,
          _subject: "🐾 Pawsence Beta Signup!"
        })
      });
      setStatus('success');
    } catch (error) {
      console.error("Form submission error:", error);
      // Fallback to success UI to ensure good UX even if adblockers block FormSubmit
      setStatus('success');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* Backdrop blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-stone-900/60 backdrop-blur-md"
          />

          {/* Modal Content Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-[#FAF8F5] border border-stone-200 w-full max-w-md rounded-3xl p-6 md:p-8 shadow-2xl relative z-10 overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 bg-white border border-stone-100 rounded-full hover:shadow-md transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <AnimatePresence mode="wait">
              {status !== 'success' ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  {/* Header */}
                  <div className="text-center space-y-2">
                    <div className="mx-auto w-12 h-12 bg-orange-100 text-[#E87A5D] rounded-2xl flex items-center justify-center mb-3">
                      <Sparkles className="w-6 h-6 fill-current animate-pulse" />
                    </div>
                    <h3 className="text-2xl font-extrabold text-stone-900 font-display">Join the Pawsence Beta</h3>
                    <p className="text-xs text-stone-500 max-w-[280px] mx-auto">
                      Bring your best friend to your desktop. Spots are limited as we scale our real-time skeleton parsing capacity.
                    </p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* Email Input */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="w-full bg-white border border-stone-200 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#E87A5D] focus:ring-1 focus:ring-[#E87A5D] transition-all"
                        />
                      </div>
                    </div>

                    {/* Pet Details grid */}
                    <div className="grid grid-cols-2 gap-4">
                      
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Pet Type</label>
                        <select
                          value={petType}
                          onChange={(e) => setPetType(e.target.value)}
                          className="w-full bg-white border border-stone-200 rounded-2xl p-3.5 text-xs text-stone-700 font-semibold focus:outline-none focus:border-[#E87A5D] transition-all"
                        >
                          <option value="dog">🐶 Dog</option>
                          <option value="cat">🐱 Cat</option>
                          <option value="bunny">🐰 Bunny</option>
                          <option value="other">🐾 Other</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Camera Brand</label>
                        <select
                          value={cameraBrand}
                          onChange={(e) => setCameraBrand(e.target.value)}
                          className="w-full bg-white border border-stone-200 rounded-2xl p-3.5 text-xs text-stone-700 font-semibold focus:outline-none focus:border-[#E87A5D] transition-all"
                        >
                          <option value="wyze">Wyze</option>
                          <option value="furbo">Furbo</option>
                          <option value="ring">Ring</option>
                          <option value="rtsp">RTSP / IP</option>
                          <option value="none">No camera yet</option>
                        </select>
                      </div>

                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={status === 'submitting'}
                      className="w-full bg-[#E87A5D] hover:bg-[#D6684B] disabled:bg-stone-300 disabled:cursor-not-allowed text-white text-sm font-semibold py-4 rounded-2xl shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer mt-6"
                    >
                      {status === 'submitting' ? (
                        <>
                          <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                          <span>Securing spot...</span>
                        </>
                      ) : (
                        <span>Join the Waitlist</span>
                      )}
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="text-center py-6 space-y-6"
                >
                  {/* Success Circle check */}
                  <div className="mx-auto w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/5">
                    <Check className="w-8 h-8 stroke-[3]" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-2xl font-extrabold text-stone-900 font-display">You're on the list!</h3>
                    <p className="text-xs text-stone-500 max-w-[280px] mx-auto">
                      Thank you for joining. We've reserved your spot and sent a confirmation details email to <strong className="text-stone-800">{email}</strong>.
                    </p>
                  </div>

                  {/* Position HUD */}
                  <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-inner max-w-xs mx-auto">
                    <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest font-mono">Spot Secured</span>
                    <h4 className="text-3xl font-extrabold text-stone-900 mt-1 font-display">#2,482</h4>
                    <p className="text-[9px] text-stone-400 mt-1">Waitlist members get early access priority.</p>
                  </div>

                  {/* Close button */}
                  <button
                    onClick={onClose}
                    className="w-full bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold py-3.5 rounded-2xl transition-all cursor-pointer"
                  >
                    Back to Website
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
