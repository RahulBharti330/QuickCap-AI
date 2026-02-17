import React from 'react';
import { Mic, Zap, Brain, Bell, Shield, Download, ChevronRight, Command, Layout, Code, CheckCircle, Smartphone, Globe, Workflow } from 'lucide-react';

interface LandingPageProps {
  onLaunch: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunch }) => {
  return (
    <div className="w-full h-full overflow-y-auto bg-[#0A0A0B] text-white font-sans selection:bg-purple-500/30 scroll-smooth relative perspective-1000">
      
      {/* Animated Background Grid */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20" 
           style={{ 
             backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)', 
             backgroundSize: '40px 40px',
             animation: 'gridMove 20s linear infinite' 
           }}>
      </div>
      
      {/* Gradient Orbs */}
      <div className="fixed top-[-10%] left-[20%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-purple-600/20 blur-[80px] md:blur-[120px] rounded-full pointer-events-none mix-blend-screen animate-pulse-slow"></div>
      <div className="fixed bottom-[-10%] right-[10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-blue-600/10 blur-[80px] md:blur-[120px] rounded-full pointer-events-none mix-blend-screen"></div>

      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-black/10 backdrop-blur-md border-b border-white/5 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={onLaunch}>
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.4)] border border-white/10 group-hover:scale-105 transition-transform">
              <Command size={18} className="text-white md:w-[20px] md:h-[20px]" />
            </div>
            <span className="font-bold text-lg md:text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">QuickCap AI</span>
          </div>
          <div className="flex items-center gap-4 md:gap-8">
            <button 
              onClick={onLaunch}
              className="hidden md:flex bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 py-2.5 rounded-full text-sm font-medium transition-all hover:border-purple-500/50"
            >
              How it works
            </button>
            <button 
              onClick={onLaunch}
              className="bg-white text-black px-4 py-2 md:px-6 md:py-2.5 rounded-full text-xs md:text-sm font-bold hover:bg-gray-200 transition-all hover:scale-105 flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
              Launch App <ChevronRight size={14} strokeWidth={3} />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-28 md:pt-40 pb-20 md:pb-32 px-6 max-w-7xl mx-auto flex flex-col items-center text-center z-10">
        
        <div className="inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] md:text-xs font-semibold text-purple-300 mb-6 md:mb-8 animate-fade-in shadow-lg backdrop-blur-sm hover:bg-white/10 transition-colors cursor-default">
          <Zap size={12} className="text-yellow-400 fill-yellow-400 md:w-[14px] md:h-[14px]" />
          <span>v2.4: Intelligent Action Plans Available</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-8xl font-bold tracking-tight mb-6 md:mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white via-gray-100 to-gray-500 max-w-5xl leading-[1.1] md:leading-[1.05] drop-shadow-2xl">
          Don't just list it.<br/>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">Crush it.</span>
        </h1>
        
        <p className="text-base md:text-xl text-gray-400 max-w-2xl mb-8 md:mb-12 leading-relaxed font-light px-4">
          The background assistant that lives in your shortcut bar. 
          Capture tasks, extract intent, and generate full AI strategies without losing focus.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-5 z-10 mb-12 md:mb-20 w-full sm:w-auto px-4 sm:px-0">
          <button 
            onClick={onLaunch}
            className="w-full sm:w-auto h-12 md:h-14 px-6 md:px-8 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold shadow-[0_0_40px_rgba(124,58,237,0.3)] transition-all transform hover:scale-105 flex items-center justify-center gap-3 text-base md:text-lg border border-purple-500/50"
          >
            <Download size={18} className="md:w-[20px] md:h-[20px]" /> Download for Windows
          </button>
          <button 
            onClick={onLaunch}
            className="w-full sm:w-auto h-12 md:h-14 px-6 md:px-8 rounded-full bg-black/40 hover:bg-white/5 border border-white/10 text-white font-medium backdrop-blur-sm transition-all text-base md:text-lg hover:border-white/20"
          >
            Try Web Demo
          </button>
        </div>

        {/* 3D App Visualization */}
        <div className="relative w-full max-w-5xl perspective-1000 group">
           {/* Floating Container with Tilt Effect */}
           <div className="relative transform transition-all duration-700 hover:scale-[1.02] hover:rotate-x-2 animate-float">
             
             {/* Glow Behind */}
             <div className="absolute -inset-2 md:-inset-4 bg-gradient-to-tr from-purple-600/30 to-blue-600/30 rounded-3xl blur-xl md:blur-2xl opacity-40 group-hover:opacity-60 transition duration-1000"></div>
             
             {/* The App Window Mockup */}
             <div className="relative bg-[#0f1117]/90 backdrop-blur-xl border border-white/10 rounded-xl md:rounded-2xl shadow-2xl overflow-hidden aspect-[16/9] flex flex-col">
               
               {/* Window Controls */}
               <div className="h-8 md:h-10 bg-white/5 border-b border-white/5 flex items-center px-4 justify-between">
                  <div className="flex gap-1.5 md:gap-2">
                    <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#FF5F57] shadow-sm"></div>
                    <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#FEBC2E] shadow-sm"></div>
                    <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#28C840] shadow-sm"></div>
                  </div>
                  <div className="text-[10px] md:text-xs font-mono text-gray-500">quickcap.exe</div>
                  <div className="w-16"></div>
               </div>

               {/* Simulated App Content */}
               <div className="flex-1 p-4 md:p-8 flex flex-col items-center justify-center relative overflow-hidden">
                  
                  {/* Floating Elements inside the mockup */}
                  <div className="absolute top-6 left-6 md:top-10 md:left-10 p-2 md:p-3 rounded-lg bg-gray-800/80 border border-gray-700 shadow-lg animate-pulse-slow scale-75 md:scale-100 origin-top-left">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400"><CheckCircle size={16} /></div>
                        <div className="space-y-1.5">
                           <div className="h-2 w-24 bg-gray-600 rounded-full"></div>
                           <div className="h-2 w-16 bg-gray-700 rounded-full"></div>
                        </div>
                     </div>
                  </div>

                  <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12 p-3 md:p-4 rounded-xl bg-purple-900/40 border border-purple-500/30 shadow-xl backdrop-blur-md animate-float scale-75 md:scale-100 origin-bottom-right" style={{animationDelay: '1s'}}>
                     <div className="flex items-center gap-2 mb-2 text-purple-300 text-xs font-bold uppercase">
                        <Brain size={12} /> AI Insight
                     </div>
                     <div className="h-2 w-24 md:w-32 bg-purple-500/20 rounded-full mb-1"></div>
                     <div className="h-2 w-16 md:w-24 bg-purple-500/20 rounded-full"></div>
                  </div>

                  {/* Main Input Simulation */}
                  <div className="w-full max-w-lg bg-black/40 border border-white/10 rounded-xl md:rounded-2xl p-1.5 md:p-2 flex items-center gap-2 md:gap-4 shadow-2xl">
                     <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white shadow-lg">
                        <Command size={16} className="md:w-[20px] md:h-[20px]" />
                     </div>
                     <div className="h-10 md:h-12 flex-1 flex items-center text-lg md:text-2xl text-gray-400 font-light truncate">
                        Buy groceries for...<span className="w-0.5 h-5 md:h-6 bg-purple-500 animate-blink ml-0.5"></span>
                     </div>
                  </div>
                  
                  <div className="mt-6 md:mt-8 flex gap-3 opacity-50">
                     <div className="h-1.5 w-1.5 md:h-2 md:w-2 bg-gray-600 rounded-full"></div>
                     <div className="h-1.5 w-1.5 md:h-2 md:w-2 bg-gray-600 rounded-full"></div>
                     <div className="h-1.5 w-1.5 md:h-2 md:w-2 bg-gray-600 rounded-full"></div>
                  </div>

               </div>
             </div>
           </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section id="features" className="py-20 md:py-32 bg-black/40 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12 md:mb-20">
             <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">Everything you need.<br/>Nothing you don't.</h2>
             <p className="text-gray-400 max-w-xl mx-auto text-base md:text-lg">Designed for flow state. Mouse optional. Efficiency mandatory.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[minmax(200px,auto)]">
            
            {/* Main AI Card */}
            <div className="md:col-span-2 md:row-span-2 p-6 md:p-8 rounded-[2rem] bg-gradient-to-br from-gray-900 via-[#13131f] to-black border border-white/10 hover:border-purple-500/30 transition-all group overflow-hidden relative shadow-2xl">
               <div className="absolute -right-10 -top-10 text-purple-900/10 group-hover:text-purple-900/20 transition-colors duration-500">
                  <Brain size={200} className="md:w-[300px] md:h-[300px]" />
               </div>
               <div className="relative z-10 h-full flex flex-col justify-between">
                 <div>
                   <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-6 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
                     <Brain size={24} className="md:w-[28px] md:h-[28px]" />
                   </div>
                   <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">Generative Action Plans</h3>
                   <p className="text-gray-400 leading-relaxed text-sm md:text-lg max-w-sm">
                     Don't know where to start? One click generates a strategic breakdown, resources, and pro-tips for any task.
                   </p>
                 </div>
                 <div className="mt-8 bg-black/40 rounded-xl p-4 border border-white/5 backdrop-blur-sm">
                    <div className="flex items-center gap-2 text-xs text-purple-300 font-bold mb-2 uppercase tracking-wide"><Workflow size={12}/> Strategy Generated</div>
                    <div className="space-y-2">
                       <div className="flex gap-2 text-sm text-gray-300"><span className="text-purple-500 font-bold">1.</span> Research competitors</div>
                       <div className="flex gap-2 text-sm text-gray-300"><span className="text-purple-500 font-bold">2.</span> Draft initial outline</div>
                       <div className="flex gap-2 text-sm text-gray-300"><span className="text-purple-500 font-bold">3.</span> Review with team</div>
                    </div>
                 </div>
               </div>
            </div>

            {/* Voice Card */}
            <div className="md:col-span-2 p-6 md:p-8 rounded-[2rem] bg-gray-900/30 border border-white/10 hover:bg-gray-800/30 transition-all group backdrop-blur-md">
               <div className="flex items-start justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4 text-blue-400">
                      <Mic size={24} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Natural Voice Capture</h3>
                    <p className="text-gray-400 text-sm">Dictate complex tasks. We'll extract the date, priority, and project automatically.</p>
                  </div>
                  <div className="h-16 w-32 flex items-center gap-1 justify-end opacity-50">
                      {[1,3,2,5,3,6,2,4,3,1].map((h, i) => (
                        <div key={i} className="w-1.5 bg-blue-500 rounded-full animate-pulse" style={{height: `${h*4}px`, animationDelay: `${i*0.1}s`}}></div>
                      ))}
                  </div>
               </div>
            </div>

             {/* Web Aware Card */}
            <div className="p-6 md:p-8 rounded-[2rem] bg-gray-900/30 border border-white/10 hover:bg-gray-800/30 transition-all group backdrop-blur-md">
               <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mb-4 text-pink-400">
                 <Globe size={24} />
               </div>
               <h3 className="text-lg font-bold mb-2">Smart Clipboard</h3>
               <p className="text-gray-400 text-sm">Copy a URL? We'll fetch the title and categorize it as 'Reading' or 'Shopping'.</p>
            </div>

            {/* Offline Card */}
            <div className="p-6 md:p-8 rounded-[2rem] bg-gray-900/30 border border-white/10 hover:bg-gray-800/30 transition-all group backdrop-blur-md">
               <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-4 text-green-400">
                 <Shield size={24} />
               </div>
               <h3 className="text-lg font-bold mb-2">Local Privacy</h3>
               <p className="text-gray-400 text-sm">Your data never leaves your device unless you ask the AI for help.</p>
            </div>

            {/* Mobile / Sync Card (Placeholder for future) */}
             <div className="md:col-span-4 p-1 rounded-[2rem] bg-gradient-to-r from-gray-900 to-black border border-white/10 relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-blue-900/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <div className="relative p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="max-w-xl text-center md:text-left">
                     <h3 className="text-2xl font-bold mb-3">Syncs with your flow</h3>
                     <p className="text-gray-400">
                        Export to Notion, Obsidian, or plain text markdown. QuickCap is designed to be the starting point of your workflow, not another walled garden.
                     </p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2 md:gap-4">
                     {['Notion', 'Obsidian', 'Jira', 'Slack'].map(tool => (
                       <div key={tool} className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-300 font-medium">
                         {tool}
                       </div>
                     ))}
                  </div>
               </div>
            </div>

          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-white/5 text-center bg-black relative z-10">
        <div className="flex items-center justify-center gap-2 mb-4">
           <Command size={20} className="text-gray-600"/>
           <span className="font-bold text-gray-400">QuickCap AI</span>
        </div>
        <p className="text-gray-600 text-sm">&copy; 2025 NextGen Productivity Tools. Crafted with React & Gemini.</p>
      </footer>
    </div>
  );
};