import React from 'react';
import { CheckCircle, X, ArrowRight, Info } from 'lucide-react';

export interface ToastItem {
  id: string;
  message: string;
  linkText?: string;
  linkTab?: string;
  type: 'success' | 'info';
}

interface ToastContainerProps {
  toasts: ToastItem[];
  onClose: (id: string) => void;
  onNavigate: (tab: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose, onNavigate }) => {
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3">
      {toasts.map((toast) => (
        <div 
          key={toast.id} 
          className={`flex items-start justify-between gap-3 p-4 rounded-xl shadow-2xl border transition-all duration-300 transform translate-x-0 opacity-100 ${
            toast.type === 'success' 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
              : 'bg-indigo-50 border-indigo-200 text-indigo-800'
          }`}
          style={{ minWidth: '320px', maxWidth: '420px' }}
        >
          <div className="flex items-start gap-3 flex-1">
            {toast.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            )}
            <div className="flex flex-col gap-1.5">
              <p className="text-sm font-semibold leading-snug">{toast.message}</p>
              {toast.linkText && toast.linkTab && (
                <button
                  onClick={() => {
                    onNavigate(toast.linkTab!);
                    onClose(toast.id);
                  }}
                  className={`flex items-center gap-1 text-xs font-bold w-max px-2 py-1 -ml-2 rounded-md transition-colors ${
                    toast.type === 'success' ? 'text-emerald-700 hover:bg-emerald-100 hover:text-emerald-900' : 'text-indigo-700 hover:bg-indigo-100 hover:text-indigo-900'
                  }`}
                >
                  {toast.linkText} <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
          <button 
            onClick={() => onClose(toast.id)} 
            className={`p-1 rounded-md shrink-0 transition-colors ${
              toast.type === 'success' ? 'hover:bg-emerald-100 text-emerald-600' : 'hover:bg-indigo-100 text-indigo-600'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
