import React, { createContext, useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, XCircle } from 'lucide-react';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle2 size={18} className="text-emerald-500" />;
      case 'error': return <XCircle size={18} className="text-rose-500" />;
      case 'warning': return <AlertCircle size={18} className="text-amber-500" />;
      default: return <Info size={18} className="text-primary" />;
    }
  };

  const getStyle = (type) => {
    switch (type) {
        case 'success': return 'bg-emerald-500 border-emerald-600 shadow-emerald-500/20 text-white';
        case 'error': return 'bg-rose-500 border-rose-600 shadow-rose-500/20 text-white';
        case 'warning': return 'bg-amber-500 border-amber-600 shadow-amber-500/20 text-white';
        default: return 'bg-primary border-primary/20 shadow-primary/20 text-white';
    }
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed bottom-8 right-8 z-[9999] min-w-[320px] flex items-center gap-4 p-5 rounded-[2rem] border shadow-2xl ${getStyle(notification.type)}`}
          >
            <div className="p-2.5 bg-white/10 rounded-2xl flex items-center justify-center">
              {getIcon(notification.type)}
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-0.5">System Transmission</p>
              <p className="text-sm font-black leading-tight">{notification.message}</p>
            </div>
            <button 
              onClick={() => setNotification(null)}
              className="p-2 hover:bg-black/5 rounded-xl text-white/40 hover:text-white transition-all"
            >
              <XCircle size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </NotificationContext.Provider>
  );
};
