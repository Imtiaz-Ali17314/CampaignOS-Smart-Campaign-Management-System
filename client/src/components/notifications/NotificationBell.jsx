import React, { useState, useEffect, useRef } from 'react';
import { Bell, AlertCircle, Clock } from 'lucide-react';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:4000';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Authenticate with JWT from local storage
    const token = localStorage.getItem('token');
    if (!token) return;

    const socket = io(WS_URL, {
      auth: { token }
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
          if (!isOpen) markAllAsRead();
        }}
        className={`p-2 sm:p-3 bg-card border border-border rounded-xl text-muted-foreground hover:bg-muted transition-all relative ${unreadCount > 0 ? 'ring-2 ring-red-500/20' : ''}`}
      >
        <Bell size={20} />
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute top-2.5 right-2.5 w-2.5 h-2.5 border-2 border-[var(--card)] bg-red-500 rounded-full" 
            />
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-3 w-80 sm:w-96 bg-card border border-border rounded-2xl shadow-2xl z-[100] overflow-hidden"
          >
            <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
              <h3 className="font-bold text-sm tracking-tight flex items-center gap-2">
                Notifications
                {notifications.length > 0 && (
                  <span className="bg-primary/20 text-primary px-2 py-0.5 rounded-full text-[10px]">
                    {notifications.length}
                  </span>
                )}
              </h3>
              <button 
                onClick={() => setNotifications([])}
                className="text-xs text-muted-foreground hover:text-red-500 transition-colors"
              >
                Clear all
              </button>
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-12 flex flex-col items-center justify-center text-center opacity-40">
                  <Bell size={32} className="mb-3" />
                  <p className="text-sm font-medium">All caught up!</p>
                  <p className="text-xs">No active alerts at this time.</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {notifications.map((notif) => (
                    <div key={notif.id} className="p-4 hover:bg-muted/50 transition-colors flex gap-4 items-start group">
                      <div className="p-2 rounded-xl bg-red-500/10 text-red-500 mt-1">
                        <AlertCircle size={18} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-primary truncate max-w-[150px]">
                            {notif.campaign_name || 'Campaign Alert'}
                          </span>
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Clock size={10} />
                            {format(new Date(notif.triggered_at), 'h:mm a')}
                          </span>
                        </div>
                        <p className="text-sm text-foreground leading-tight">
                          {notif.message}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-3 bg-muted/10 border-t border-border mt-auto">
              <button className="w-full py-2 text-xs font-bold text-primary hover:bg-primary/5 rounded-lg transition-colors">
                View All Alerts
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
