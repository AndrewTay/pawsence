import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Cpu, HardDrive, Key, Eye, HelpCircle } from 'lucide-react';

interface PrivacyPolicyProps {
  goHome: () => void;
}

export default function PrivacyPolicy({ goHome }: PrivacyPolicyProps) {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-850 font-sans selection:bg-[#E87A5D] selection:text-white">
      
      {/* Navigation Header */}
      <nav className="fixed w-full top-0 z-40 bg-[#FAF8F5]/85 backdrop-blur-md border-b border-stone-200/50">
        <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
          <button
            onClick={goHome}
            className="flex items-center gap-2 text-stone-600 hover:text-stone-900 font-semibold text-sm transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Home
          </button>
          
          <div className="text-lg font-black tracking-tight text-stone-900 font-display">
            Pawsence<span className="text-[#E87A5D]">.</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-32 pb-24 px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-12"
        >
          {/* Hero Header */}
          <div className="space-y-4 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full text-[10px] font-bold text-emerald-800 uppercase tracking-widest">
              <Shield className="w-3 h-3 stroke-[2.5]" />
              <span>Privacy First Architecture</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-stone-900 font-display">
              Your pet's privacy <br className="sm:hidden"/> is absolute.
            </h1>
            <p className="text-stone-500 text-base sm:text-lg max-w-2xl leading-relaxed">
              We believe a desktop companion should bring comfort, not surveillance. Pawsence is built from the ground up to protect your home feed and your personal data.
            </p>
          </div>

          {/* Key Principles Grid */}
          <div className="grid md:grid-cols-2 gap-6 pt-4">
            
            {/* Card 1: On-Device Processing */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white border border-stone-200/80 rounded-3xl p-6 space-y-4 hover:border-stone-300 hover:shadow-sm transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#E87A5D]">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-stone-900 text-lg">On-Device AI Engine</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Your pet camera and wearable feeds are analyzed strictly on your local computer. Video frames are processed in-memory for real-time action matching and immediately discarded. **We never upload or stream your live video or audio to any cloud server.**
              </p>
            </motion.div>

            {/* Card 2: Custom 3D Scanning */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white border border-stone-200/80 rounded-3xl p-6 space-y-4 hover:border-stone-300 hover:shadow-sm transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
                <HardDrive className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-stone-900 text-lg">Opt-in 3D Generation</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                When you use our optional Creator Sandbox to build a custom 3D model, the photos you choose to upload are securely transmitted to Fal.ai (utilizing the Tripo3D v2.5 pipeline). This data is used solely to generate the mesh and is subject to their standard retention deletion policies.
              </p>
            </motion.div>

            {/* Card 3: Secure Local Storage */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white border border-stone-200/80 rounded-3xl p-6 space-y-4 hover:border-stone-300 hover:shadow-sm transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700">
                <Key className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-stone-900 text-lg">Local Credentials Only</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Any configuration settings, camera URLs, or API keys (such as your Fal.ai key) are stored directly in your browser's local storage or desktop application configuration file. We do not have a centralized server that stores your access keys.
              </p>
            </motion.div>

            {/* Card 4: Minimal Telemetry */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white border border-stone-200/80 rounded-3xl p-6 space-y-4 hover:border-stone-300 hover:shadow-sm transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-750 font-bold">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-stone-900 text-lg">No Sneaky Tracking</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                We do not track individual behaviors, map your room layouts, or collect metadata about your habits. We only collect basic, completely anonymized application-level usage metrics (e.g., app launching) to resolve bugs and optimize responsiveness.
              </p>
            </motion.div>

          </div>

          <hr className="border-stone-200" />

          {/* Full Policy Content */}
          <div className="prose prose-stone max-w-none space-y-8 text-stone-700">
            <div>
              <h2 className="text-2xl font-black text-stone-900 font-display mb-3">Pawsence Privacy Policy</h2>
              <p className="text-xs text-stone-400 font-mono">Last Updated: June 19, 2026</p>
            </div>

            <section className="space-y-3">
              <h3 className="text-lg font-bold text-stone-850">1. Information We Collect</h3>
              <p className="text-sm leading-relaxed">
                Because Pawsence is designed as a local-first application, the scope of data collected is extremely limited:
              </p>
              <ul className="list-disc pl-5 text-sm space-y-1.5 leading-relaxed">
                <li><strong>Local Configuration Data:</strong> Settings such as selected avatar type, camera feed coordinates, and API keys remain strictly local to your device’s storage.</li>
                <li><strong>Image Uploads (Optional):</strong> If you choose to use the Tripo3D builder tool in the sandbox, we upload target photos to our generation API partners (Fal.ai). These images are utilized purely to process the requested 3D model.</li>
                <li><strong>Telemetry:</strong> We may record basic performance timings, framework errors, and active/inactive counts to improve local frame rates. No video stream content, metadata, IP addresses, or camera feeds are included.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h3 className="text-lg font-bold text-stone-850">2. Processing of Camera Feed Data</h3>
              <p className="text-sm leading-relaxed">
                The core of the Pawsence application involves parsing video feeds to classify pet behaviors (sleeping, eating, alert). 
                All computation is done via client-side scripts running inside your browser environment or local desktop sandbox. 
                Under no circumstances is video feed data sent back to Pawsence servers. We do not build, train, or aggregate visual data of your home on the cloud.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="text-lg font-bold text-stone-850">3. Third-Party Services</h3>
              <p className="text-sm leading-relaxed">
                Our application integrates the following external service providers:
              </p>
              <ul className="list-disc pl-5 text-sm space-y-1.5 leading-relaxed">
                <li><strong>Fal.ai / Tripo3D:</strong> Used optionally to execute the Image-to-3D neural network rigging pipeline. They do not use your images for public model training unless explicitly agreed upon.</li>
                <li><strong>FormSubmit:</strong> Used to handle voluntary beta early access request forms. Only the email, camera model, and pet type you input are shared to register your interest.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h3 className="text-lg font-bold text-stone-850">4. Data Security & Storage</h3>
              <p className="text-sm leading-relaxed">
                We take industry-standard measures to protect all configuration settings. Since keys are stored on-device, security depends heavily on the sandbox safety of your operating system and web browser. We recommend protecting your computer with standard system passwords and keeping your browser up-to-date.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="text-lg font-bold text-stone-850">5. Changes to This Policy</h3>
              <p className="text-sm leading-relaxed">
                We may revise this privacy policy from time to time. Any changes will be updated on this page with a revised date. We encourage you to check back periodically if you utilize the application frequently.
              </p>
            </section>

            <section className="space-y-3 pb-8">
              <h3 className="text-lg font-bold text-stone-850 flex items-center gap-1">
                <HelpCircle className="w-4 h-4 text-stone-400" />
                Contact & Support
              </h3>
              <p className="text-sm leading-relaxed">
                If you have any questions or security concerns regarding Pawsence's processing of your pet camera feeds, please contact us at <a href="mailto:andrewtaywq3@gmail.com" className="text-[#E87A5D] hover:underline font-medium">andrewtaywq3@gmail.com</a>.
              </p>
            </section>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-500 py-12 text-xs text-center border-t border-stone-800 font-mono">
        <div className="max-w-4xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Pawsence. Privacy first, always.</p>
          <button
            onClick={goHome}
            className="hover:text-stone-300 transition-colors cursor-pointer"
          >
            Back to Home Page
          </button>
        </div>
      </footer>
    </div>
  );
}
