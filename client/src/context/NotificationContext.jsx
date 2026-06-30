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
      case 'success': return <CheckCircle2 size={20} className="text-emerald-500" />;
      case 'error': return <XCircle size={20} className="text-rose-500" />;
      case 'warning': return <AlertCircle size={20} className="text-amber-500" />;
      default: return <Info size={20} className="text-primary" />;
    }
  };

  const getIconContainerStyle = (type) => {
    switch (type) {
      case 'success': return 'bg-emerald-500/10 border border-emerald-500/20';
      case 'error': return 'bg-rose-500/10 border border-rose-500/20';
      case 'warning': return 'bg-amber-500/10 border border-amber-500/20';
      default: return 'bg-primary/10 border border-primary/20';
    }
  };

  const getLabelColor = (type) => {
    switch (type) {
      case 'success': return 'text-emerald-500';
      case 'error': return 'text-rose-500';
      case 'warning': return 'text-amber-500';
      default: return 'text-primary';
    }
  };

  const getLabel = (type) => {
    switch (type) {
      case 'success': return 'Success Protocol';
      case 'error': return 'Error Alert';
      case 'warning': return 'Warning Alert';
      default: return 'System Transmission';
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
            className="fixed bottom-8 right-8 z-[9999] min-w-[340px] max-w-[450px] flex items-start gap-4 p-5 rounded-2xl border border-border/80 bg-card/95 shadow-2xl backdrop-blur-xl text-foreground"
          >
            <div className={`p-2 rounded-xl flex items-center justify-center shrink-0 ${getIconContainerStyle(notification.type)}`}>
              {getIcon(notification.type)}
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
              <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${getLabelColor(notification.type)}`}>
                {getLabel(notification.type)}
              </p>
              <p className="text-sm font-semibold text-foreground/90 leading-snug break-words">
                {notification.message}
              </p>
            </div>
            <button 
              onClick={() => setNotification(null)}
              className="p-1 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-all shrink-0"
            >
              <XCircle size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </NotificationContext.Provider>
  );
};
