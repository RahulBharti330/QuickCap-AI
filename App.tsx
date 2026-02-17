import React, { useState, useEffect, useRef } from 'react';
import { Mic, Zap, Clipboard, Command, Sparkles, Plus, Loader2, Bell, Layout, Settings, Trash2, ArrowUpDown } from 'lucide-react';
import { Task } from './types';
import { analyzeTaskInput, generateNotificationMessage, getTaskAssistance } from './services/geminiService';
import { TaskItem } from './components/TaskItem';
import { Toast } from './components/Toast';
import { LandingPage } from './components/LandingPage';

// Helper to create IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

const SUGGESTIONS = [
  "Plan a trip to Tokyo...",
  "Buy groceries for lasagna...",
  "Prepare for React interview...",
  "Fix bug in login API...",
  "Schedule dentist appointment..."
];

export default function App() {
  const [view, setView] = useState<'landing' | 'app'>('landing');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [assistingId, setAssistingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'info'} | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [suggestionIdx, setSuggestionIdx] = useState(0);
  
  // Ref for the main input (Spotlight style)
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('quickcap-tasks');
    if (saved) {
      try { setTasks(JSON.parse(saved)); } catch (e) { console.error(e); }
    }
    
    if (view === 'app' && 'Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }

    if (view === 'app') {
       // Focus immediately when entering app view
       setTimeout(() => inputRef.current?.focus(), 100);
    }

    // Rotate suggestions
    const interval = setInterval(() => {
       setSuggestionIdx(prev => (prev + 1) % SUGGESTIONS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [view]);

  useEffect(() => {
    localStorage.setItem('quickcap-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const priorityScore = { High: 3, Medium: 2, Low: 1 };
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.isCompleted !== b.isCompleted) return a.isCompleted ? 1 : -1;
    return priorityScore[b.priority] - priorityScore[a.priority];
  });

  const handleAddTask = async (overrideText?: string) => {
    const textToAnalyze = overrideText || inputText;
    if (!textToAnalyze.trim()) return;

    setIsAnalyzing(true);
    setInputText(''); 

    // OPTIMISTIC UPDATE: Focus immediately so user can keep typing
    // We don't wait for AI to finish to let user type next task
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);

    try {
      const analysis = await analyzeTaskInput(textToAnalyze);
      
      const newTask: Task = {
        id: generateId(),
        title: analysis.title,
        description: analysis.description,
        category: analysis.category,
        priority: analysis.priority,
        subtasks: analysis.subtasks.map(st => ({ id: generateId(), title: st, isCompleted: false })),
        isCompleted: false,
        createdAt: Date.now(),
        aiRemark: analysis.remark,
        links: analysis.links,
        source: overrideText ? 'clipboard' : 'manual'
      };

      setTasks(prev => [newTask, ...prev]);
      
      if (Notification.permission === 'granted') {
        new Notification("Quick Capture", { 
          body: `Task prioritized: ${analysis.title} (${analysis.priority})`,
          icon: '/favicon.ico'
        });
      }
      setToast({ message: "Captured", type: 'success' });
    } catch (error) {
      console.error(error);
      const fallbackTask: Task = {
        id: generateId(),
        title: textToAnalyze,
        category: 'Inbox',
        priority: 'Medium',
        subtasks: [],
        isCompleted: false,
        createdAt: Date.now(),
        source: 'manual'
      };
      setTasks(prev => [fallbackTask, ...prev]);
    } finally {
      setIsAnalyzing(false);
      // Ensure focus is still there after async op
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  };

  const handleRequestAssist = async (task: Task) => {
    if (assistingId) return; // Prevent multiple
    setAssistingId(task.id);
    
    try {
       const assistance = await getTaskAssistance(task.title);
       setTasks(prev => prev.map(t => t.id === task.id ? { ...t, aiAssistance: assistance } : t));
       setToast({ message: "AI Plan Generated!", type: 'success' });
    } catch (e) {
       console.error(e);
       setToast({ message: "Failed to generate plan.", type: 'info' });
    } finally {
       setAssistingId(null);
    }
  };

  const checkClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && text.length > 0) {
        setInputText(text);
        inputRef.current?.focus();
        setToast({ message: "Pasted from clipboard", type: 'info' });
      } else {
        setToast({ message: "Clipboard empty", type: 'info' });
      }
    } catch (e) {
      setToast({ message: "Clipboard access required", type: 'info' });
    }
  };

  const toggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const newStatus = !task.isCompleted;
    setTasks(tasks.map(t => t.id === id ? { ...t, isCompleted: newStatus } : t));

    if (newStatus) {
      const msg = await generateNotificationMessage('completion', task.title);
      if (Notification.permission === 'granted') {
         new Notification("Task Complete!", { body: msg });
      }
      setToast({ message: msg, type: 'success' });
    }
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  const handleClearAll = () => {
    if (showClearConfirm) {
      setTasks([]);
      setShowClearConfirm(false);
      setToast({ message: "All tasks cleared", type: 'info' });
    } else {
      setShowClearConfirm(true);
      setTimeout(() => setShowClearConfirm(false), 3000); 
    }
  };

  const toggleListening = () => {
    if (isListening) { setIsListening(false); return; }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputText(prev => (prev ? prev + ' ' + transcript : transcript));
    };
    recognition.start();
  };

  if (view === 'landing') {
    return <LandingPage onLaunch={() => setView('app')} />;
  }

  return (
    <div className="w-full max-w-[700px] mx-auto px-4 md:px-0 flex flex-col max-h-[85vh] relative font-sans text-gray-100 animate-fade-in-up">
      
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Main "Spotlight" Input Bar */}
      <div className="bg-gray-900/90 backdrop-blur-xl rounded-t-2xl border border-gray-700 shadow-2xl overflow-hidden flex flex-col transition-all">
        {/* Status Bar */}
        <div className="h-8 bg-gray-800/50 flex items-center justify-between px-4 select-none cursor-move border-b border-white/5">
           <div className="flex items-center gap-2">
             <div className="flex gap-1.5 group cursor-pointer" onClick={() => setView('landing')} title="Close to Landing">
               <div className="w-3 h-3 rounded-full bg-red-500/80 group-hover:bg-red-400 shadow-sm"></div>
               <div className="w-3 h-3 rounded-full bg-yellow-500/80 group-hover:bg-yellow-400 shadow-sm"></div>
               <div className="w-3 h-3 rounded-full bg-green-500/80 group-hover:bg-green-400 shadow-sm"></div>
             </div>
             <span className="text-xs font-semibold text-gray-400 ml-2 tracking-wide hidden sm:inline">QuickCap AI</span>
           </div>
           
           <div className="flex items-center gap-3">
              <button 
                onClick={handleClearAll}
                className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded transition-all font-medium ${showClearConfirm ? 'bg-red-600 text-white' : 'text-gray-500 hover:text-red-400 hover:bg-white/5'}`}
              >
                <Trash2 size={12} />
                {showClearConfirm ? "Confirm?" : "Clear All"}
              </button>
             <span className="text-[10px] text-gray-500 flex items-center gap-1 bg-black/20 px-2 py-0.5 rounded-full border border-white/5">
               <Zap size={10} className={process.env.API_KEY ? "text-green-400" : "text-gray-600"} />
               <span className="hidden sm:inline">{process.env.API_KEY ? 'Connected' : 'Offline'}</span>
             </span>
           </div>
        </div>

        {/* Input Field */}
        <div className="relative p-3 md:p-5 flex items-center gap-2 md:gap-4">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/30 flex-shrink-0 animate-pulse-slow">
             {isAnalyzing ? <Loader2 size={18} className="animate-spin text-white" /> : <Command size={18} className="text-white md:w-[22px] md:h-[22px]" />}
          </div>
          
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent text-lg md:text-2xl font-light text-white placeholder-gray-600 outline-none h-12"
            placeholder={SUGGESTIONS[suggestionIdx]}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
            disabled={isAnalyzing}
            autoFocus
          />
          
          {/* Action Buttons */}
          <div className="flex items-center gap-1 md:gap-2 bg-gray-800/50 p-1 md:p-1.5 rounded-xl border border-white/5">
             <button onClick={checkClipboard} className="p-1.5 md:p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all" title="Smart Paste">
                <Clipboard size={16} className="md:w-5 md:h-5" />
             </button>
             <button onClick={toggleListening} className={`p-1.5 md:p-2 rounded-lg transition-all ${isListening ? 'text-red-400 bg-red-900/20' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>
                <Mic size={16} className="md:w-5 md:h-5" />
             </button>
          </div>
        </div>
      </div>

      {/* Results List */}
      <div className="bg-gray-900/90 backdrop-blur-xl rounded-b-2xl border-x border-b border-gray-700 shadow-2xl flex-1 overflow-y-auto min-h-[150px] max-h-[500px] scroll-smooth relative">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-600">
             <div className="bg-white/5 p-4 rounded-full mb-4 animate-bounce">
                <Sparkles size={32} className="opacity-70 text-purple-400" />
             </div>
             <p className="text-lg font-medium text-gray-400">Ready to Capture</p>
             <p className="text-sm mt-1 text-gray-600">Type a task or paste a link to begin</p>
          </div>
        ) : (
          <div className="">
            {/* Sort Header */}
            <div className="px-5 py-3 bg-black/40 flex items-center justify-between border-b border-white/5 backdrop-blur-sm sticky top-0 z-10">
               <span className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">
                 Your Queue ({tasks.filter(t => !t.isCompleted).length})
               </span>
               <div className="flex items-center gap-1.5 text-[10px] text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/20">
                 <ArrowUpDown size={10} /> <span className="hidden sm:inline">Auto-Prioritized</span>
               </div>
            </div>
            <div className="p-2 space-y-1">
              {sortedTasks.map(task => (
                <TaskItem 
                  key={task.id} 
                  task={task} 
                  onToggle={toggleTask} 
                  onDelete={(id) => setTasks(tasks.filter(t => t.id !== id))}
                  onSubtaskToggle={(tid, sid) => setTasks(tasks.map(t => t.id === tid ? {...t, subtasks: t.subtasks.map(s => s.id === sid ? {...s, isCompleted: !s.isCompleted} : s)} : t))}
                  onUpdate={handleUpdateTask}
                  onRequestAssist={handleRequestAssist}
                  isAssisting={assistingId === task.id}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer / Hint */}
      <div className="mt-3 flex justify-center opacity-0 hover:opacity-100 transition-opacity duration-500 hidden sm:flex">
         <div className="flex items-center gap-4 text-[10px] text-gray-500 bg-black/60 px-4 py-1.5 rounded-full backdrop-blur-md border border-white/10 shadow-lg">
           <span>Global: <span className="text-gray-300 font-mono">Ctrl+Shift+Space</span></span>
           <span className="w-1 h-1 rounded-full bg-gray-600"></span>
           <span>Double-click task to Edit</span>
         </div>
      </div>
    </div>
  );
}