import React, { useState, useRef, useEffect } from 'react';
import { Check, ChevronRight, Trash2, Link as LinkIcon, Sparkles, ShoppingBag, Briefcase, Code, User, Pencil, Bell, Brain, Search, Lightbulb, Loader2 } from 'lucide-react';
import { Task } from '../types';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onSubtaskToggle: (taskId: string, subtaskId: string) => void;
  onUpdate: (task: Task) => void;
  onRequestAssist: (task: Task) => void;
  isAssisting: boolean;
}

const getCategoryIcon = (cat: string) => {
  const c = cat.toLowerCase();
  if (c.includes('shop') || c.includes('buy')) return <ShoppingBag size={10} />;
  if (c.includes('work') || c.includes('job')) return <Briefcase size={10} />;
  if (c.includes('dev') || c.includes('code')) return <Code size={10} />;
  return <User size={10} />;
};

export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete, onSubtaskToggle, onUpdate, onRequestAssist, isAssisting }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showReminderInput, setShowReminderInput] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

  // Focus input when editing starts
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  const handleSaveEdit = () => {
    if (editTitle.trim()) {
      onUpdate({ ...task, title: editTitle });
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSaveEdit();
    if (e.key === 'Escape') {
      setEditTitle(task.title);
      setIsEditing(false);
    }
  };

  const cyclePriority = (e: React.MouseEvent) => {
    e.stopPropagation();
    const priorities: Task['priority'][] = ['High', 'Medium', 'Low'];
    const nextIdx = (priorities.indexOf(task.priority) + 1) % priorities.length;
    onUpdate({ ...task, priority: priorities[nextIdx] });
  };

  const handleSetReminder = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = new Date(e.target.value).getTime();
    onUpdate({ ...task, reminderTime: time });
    setShowReminderInput(false);
  };

  const priorityStyles = {
    High: 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]',
    Medium: 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.3)]',
    Low: 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]',
  }[task.priority];

  return (
    <div className={`group flex flex-col transition-all duration-300 border-l-[3px] bg-white/[0.02] hover:bg-white/[0.05] mb-1 ${task.isCompleted ? 'opacity-50 border-gray-700' : `border-transparent hover:border-purple-500/50`}`}>
      
      {/* Primary Row */}
      <div className="flex items-center p-3 gap-3 relative">
        {/* Priority Indicator */}
        <div 
          onClick={cyclePriority}
          className={`w-1 h-8 rounded-full ${priorityStyles} cursor-pointer hover:w-1.5 transition-all duration-200 flex-shrink-0`} 
          title={`Priority: ${task.priority}. Click to cycle.`}
        />

        {/* Checkbox */}
        <button
          onClick={() => onToggle(task.id)}
          className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
            task.isCompleted 
              ? 'bg-gradient-to-br from-green-500 to-green-600 border-transparent text-white scale-95' 
              : 'border-gray-600 hover:border-purple-400 hover:scale-105'
          }`}
        >
          {task.isCompleted && <Check size={12} strokeWidth={3} />}
        </button>

        {/* Content Area */}
        <div className="flex-1 min-w-0" onDoubleClick={() => setIsEditing(true)}>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <input 
                ref={inputRef}
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={handleSaveEdit}
                onKeyDown={handleKeyDown}
                className="bg-gray-800 text-white text-sm px-2 py-1 rounded w-full outline-none border border-purple-500 shadow-inner"
              />
            ) : (
              <span 
                onClick={() => setIsExpanded(!isExpanded)}
                className={`text-sm font-medium cursor-pointer select-none transition-colors truncate block ${task.isCompleted ? 'line-through text-gray-500' : 'text-gray-200 group-hover:text-white'}`}
              >
                {task.title}
              </span>
            )}
            
            {task.links && task.links.length > 0 && !isEditing && (
              <LinkIcon size={12} className="text-blue-400 flex-shrink-0" />
            )}
          </div>

          <div className="flex items-center gap-3 mt-1.5">
             <span className="flex items-center gap-1.5 text-[10px] text-gray-400 bg-white/5 px-1.5 py-0.5 rounded border border-white/5 uppercase tracking-wide font-semibold">
               {getCategoryIcon(task.category)} {task.category}
             </span>
             {task.reminderTime && (
               <span className="flex items-center gap-1 text-[10px] text-yellow-500 bg-yellow-500/10 px-1.5 py-0.5 rounded border border-yellow-500/20">
                 <Bell size={10} /> 
                 {new Date(task.reminderTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
               </span>
             )}
          </div>
        </div>

        {/* Reminder Input Popup */}
        {showReminderInput && (
          <div className="absolute right-14 top-10 z-50 bg-gray-900 p-3 rounded-xl border border-gray-700 shadow-2xl animate-fade-in-up">
            <p className="text-[10px] text-gray-400 mb-1">Set Reminder</p>
            <input 
              type="datetime-local" 
              className="bg-gray-800 text-white text-xs p-1.5 rounded border border-gray-600 outline-none focus:border-purple-500"
              onChange={handleSetReminder}
              autoFocus
            />
          </div>
        )}

        {/* Actions - Always visible on mobile, hover on desktop */}
        <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => onRequestAssist(task)}
            className={`p-1.5 rounded-lg transition-colors ${task.aiAssistance ? 'text-purple-400 bg-purple-400/10' : 'text-gray-500 hover:text-purple-400 hover:bg-white/10'}`}
            title="Ask AI for Help"
          >
            {isAssisting ? <Loader2 size={14} className="animate-spin"/> : <Brain size={14} />}
          </button>

          <button 
            onClick={() => setShowReminderInput(!showReminderInput)}
            className={`p-1.5 rounded-lg hover:bg-white/10 ${task.reminderTime ? 'text-yellow-400' : 'text-gray-500 hover:text-yellow-400'}`}
            title="Set Reminder"
          >
            <Bell size={14} />
          </button>
          
          <button 
            onClick={() => setIsEditing(!isEditing)} 
            className="p-1.5 text-gray-500 hover:text-blue-400 rounded-lg hover:bg-white/10"
            title="Edit Task"
          >
            <Pencil size={14} />
          </button>
          
          <button onClick={() => onDelete(task.id)} className="p-1.5 text-gray-500 hover:text-red-400 rounded-lg hover:bg-white/10" title="Delete">
            <Trash2 size={14} />
          </button>
          
          <button onClick={() => setIsExpanded(!isExpanded)} className="p-1.5 text-gray-500 hover:text-white rounded-lg hover:bg-white/10">
            <ChevronRight size={14} className={`transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
          </button>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="pl-12 pr-4 pb-4 space-y-4 bg-black/20 animate-fade-in border-t border-white/5 pt-3">
          
          {/* Quick AI Remark */}
          {task.aiRemark && !task.isCompleted && (
             <div className="flex items-start gap-2 text-xs text-purple-300/80 italic">
               <Sparkles size={12} className="mt-0.5" />
               "{task.aiRemark}"
             </div>
          )}

          {/* AI Assistance Panel */}
          {task.aiAssistance ? (
            <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/10 rounded-xl p-3 border border-purple-500/20 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-200 uppercase tracking-wide">
                <Brain size={12} /> AI Action Plan
              </div>
              
              {/* Pro Tip */}
              <div className="flex gap-2 text-xs text-blue-200 bg-blue-500/10 p-2 rounded-lg border border-blue-500/20">
                <Lightbulb size={14} className="flex-shrink-0 text-yellow-400" />
                <span><span className="font-bold">Pro Tip:</span> {task.aiAssistance.proTip}</span>
              </div>

              {/* Strategic Steps */}
              <div className="space-y-1">
                 <p className="text-[10px] text-gray-500 font-semibold">STRATEGIC STEPS</p>
                 {task.aiAssistance.steps.map((step, idx) => (
                   <div key={idx} className="flex gap-2 text-xs text-gray-300">
                     <span className="text-purple-500 font-bold">{idx + 1}.</span>
                     {step}
                   </div>
                 ))}
              </div>

              {/* Resources */}
              <div className="flex items-center gap-2 pt-1">
                 <a href={`https://www.google.com/search?q=${encodeURIComponent(task.aiAssistance.searchQuery)}`} 
                    target="_blank" rel="noreferrer"
                    className="flex items-center gap-1 text-[10px] bg-white/10 hover:bg-white/20 px-2 py-1 rounded-md text-gray-300 transition-colors"
                 >
                   <Search size={10} /> Search: "{task.aiAssistance.searchQuery}"
                 </a>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
               <button 
                 onClick={() => onRequestAssist(task)}
                 className="flex items-center gap-2 text-xs text-gray-500 hover:text-purple-400 transition-colors px-3 py-1.5 rounded-full border border-dashed border-gray-700 hover:border-purple-500"
               >
                 <Brain size={12} /> Generate AI Action Plan
               </button>
            </div>
          )}

          {/* Subtasks (Standard) */}
          {task.subtasks.length > 0 && (
            <div className="space-y-1 mt-2">
              <p className="text-[10px] text-gray-500 font-semibold uppercase">Quick Subtasks</p>
              {task.subtasks.map(st => (
                <div key={st.id} 
                     onClick={() => onSubtaskToggle(task.id, st.id)}
                     className="flex items-center gap-2 group/sub cursor-pointer p-1.5 rounded-lg hover:bg-white/5 transition-colors">
                  <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-colors ${
                    st.isCompleted ? 'bg-gray-600 border-gray-600' : 'border-gray-500 group-hover/sub:border-purple-400'
                  }`}>
                    {st.isCompleted && <Check size={10} className="text-white" />}
                  </div>
                  <span className={`text-xs transition-colors ${st.isCompleted ? 'text-gray-600 line-through' : 'text-gray-300 group-hover/sub:text-white'}`}>
                    {st.title}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};