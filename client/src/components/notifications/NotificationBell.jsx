import React, { useState, useEffect, useRef } from 'react';
import { Bell, AlertCircle, Clock } from 'lucide-react';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:4000';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState('alerts'); // 'alerts' or 'history'
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Authenticate with JWT from local storage
    const token = localStorage.getItem('token');
    if (!token) return;

    const socket = io(WS_URL, {
      auth: { token },
      transports: ['websocket', 'polling']
    });

    socket.on('connect', () => {
      console.log('Connected to notification server');
    });

    socket.on('alert', (alert) => {
      setNotifications(prev => [alert, ...prev]);
      setUnreadCount(prev => prev + 1);
      
      // Basic browser notification if allowed
      if (Notification.permission === 'granted') {
        new Notification('Campaign Alert', { body: alert.message });
      }
    });

    // Cleanup on unmount
    return () => socket.disconnect();
  }, []);

  // Request browser notification permission
  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setView('alerts');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    setUnreadCount(0);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) {
            markAllAsRead();
            setView('alerts');
          }
        }}
        className={`p-3 bg-card border border-border/60 rounded-2xl text-muted-foreground hover:bg-muted/50 hover:text-primary transition-all relative shadow-sm ${unreadCount > 0 ? 'ring-2 ring-primary/20' : ''}`}
      >
        <Bell size={18} strokeWidth={2.5} />
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute top-2.5 right-2.5 w-2.5 h-2.5 border-2 border-card bg-primary rounded-full shadow-[0_0_10px_rgba(139,92,246,0.6)]" 
            />
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className="absolute right-0 mt-4 w-80 sm:w-96 glass-card rounded-[2rem] shadow-2xl z-[1000] overflow-hidden border-primary/10"
          >
            <div className="p-6 border-b border-border/40 flex items-center justify-between bg-muted/5 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                 <h3 className="font-black text-xs uppercase tracking-[0.2em] text-foreground flex items-center gap-2">
                    {view === 'alerts' ? 'Live Alerts' : 'Strategic History'}
                    {view === 'alerts' && notifications.length > 0 && (
                    <span className="bg-primary/20 text-primary px-2 py-0.5 rounded-full text-[10px] font-bold">
                        {notifications.length}
                    </span>
                    )}
                </h3>
              </div>
              {view === 'alerts' ? (
                <button 
                  onClick={() => setNotifications([])}
                  className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 hover:text-rose-500 transition-colors"
                >
                  Flush All
                </button>
              ) : (
                <button 
                  onClick={() => setView('alerts')}
                  className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline transition-all"
                >
                  Back to Live
                </button>
              )}
            </div>

            <div className="max-h-[450px] overflow-y-auto scrollbar-hide bg-card/40 backdrop-blur-3xl">
              {view === 'history' ? (
                 <div className="p-10 text-center">
                    <div className="p-5 bg-primary/5 rounded-3xl mb-4 border border-primary/10 inline-block">
                        <Clock size={32} className="text-primary" />
                    </div>
                    <p className="text-xs font-black uppercase tracking-widest text-foreground mb-1">Audit Trail Active</p>
                    <p className="text-[10px] text-muted-foreground font-medium px-6">All historical strategies and threshold violations are being indexed in the master log.</p>
                 </div>
              ) : (
                notifications.length === 0 ? (
                    <div className="p-20 flex flex-col items-center justify-center text-center opacity-30">
                      <div className="p-5 bg-muted/20 rounded-3xl mb-4 border border-border/40">
                        <Bell size={40} strokeWidth={1} />
                      </div>
                      <p className="text-sm font-black tracking-tight text-foreground uppercase tracking-widest">System Clear</p>
                      <p className="text-[10px] font-bold mt-1 max-w-[120px]">No critical threshold violations detected.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-border/10">
                      {notifications.map((notif) => (
                        <div key={notif.id} className="p-6 hover:bg-muted/30 transition-colors flex gap-5 items-start group">
                          <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-500 mt-0.5 shrink-0 border border-rose-500/20 group-hover:bg-rose-500 group-hover:text-white transition-all duration-300">
                            <AlertCircle size={18} strokeWidth={2.5} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1.5 border-b border-border/10 pb-1.5">
                              <span className="text-[10px] font-black uppercase tracking-[0.1em] text-primary truncate">
                                {notif.campaign_name || 'System Broadcast'}
                              </span>
                              <span className="text-[9px] font-bold text-muted-foreground/60 uppercase flex items-center gap-1 shrink-0">
                                <Clock size={10} strokeWidth={3} />
                                {format(new Date(notif.triggered_at), 'HH:mm')}
                              </span>
                            </div>
                            <p className="text-sm text-foreground/80 leading-snug font-medium line-clamp-3">
                              {notif.message}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
              )}
            </div>
            
            <div className="p-5 bg-muted/10 border-t border-border/20 mt-auto">
              <button 
                onClick={() => setView(view === 'alerts' ? 'history' : 'alerts')}
                className="w-full py-3 text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:bg-primary/10 rounded-xl transition-all border border-primary/20"
              >
                {view === 'alerts' ? 'Strategic History' : 'View Live Alerts'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
