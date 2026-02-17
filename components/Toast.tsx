import React, { useEffect } from 'react';
import { X, CheckCircle, Info } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'info';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'info', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-2xl backdrop-blur-md border animate-fade-in-down ${
      type === 'success' 
        ? 'bg-green-500/20 border-green-500/50 text-green-100' 
        : 'bg-blue-600/20 border-blue-500/50 text-blue-100'
    }`}>
      {type === 'success' ? <CheckCircle size={18} /> : <Info size={18} />}
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="opacity-70 hover:opacity-100">
        <X size={16} />
      </button>
    </div>
  );
};