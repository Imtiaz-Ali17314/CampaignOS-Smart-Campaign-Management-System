import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  Settings, 
  ChevronRight, 
  ChevronLeft,
  LayoutDashboard,
  FileEdit,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ campaigns, onClientSelect, activeClient, isMobileOpen, setIsMobileOpen }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  
  const clients = Array.from(new Set(campaigns.map(c => c.client_name || c.client))).filter(Boolean).map(clientName => ({
    name: clientName,
    campaigns: campaigns.filter(c => (c.client_name || c.client) === clientName)
  }));

  const handleClientClick = (clientName) => {
    if (onClientSelect) {
      onClientSelect(clientName);
    } else {
      // If we're on another page, navigate to dashboard with the client filter
      navigate(`/?client=${encodeURIComponent(clientName || '')}`);
    }
  };

  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/brief-builder', icon: FileEdit, label: 'Brief Builder' },
  ];

  const renderContent = (collapsedState, closeOnClick = false) => {
    return (
      <>
        <div className="p-6 flex items-center justify-between mb-4">
          <AnimatePresence mode="wait">
            {!collapsedState && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center gap-2.5"
              >
                <div className="w-9 h-9 bg-primary flex items-center justify-center rounded-xl shadow-lg shadow-primary/30">
                  <BarChart3 className="text-white" size={20} />
                </div>
                <h1 className="text-xl font-black tracking-tight gradient-text">CampaignOS</h1>
              </motion.div>
            )}
          </AnimatePresence>
          {closeOnClick ? (
            <button 
              onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
              className="p-2.5 hover:bg-muted/80 rounded-xl transition-all text-muted-foreground border border-transparent hover:border-border active:scale-95 lg:hidden"
            >
              <X size={18} />
            </button>
          ) : (
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2.5 hover:bg-muted/80 rounded-xl transition-all text-muted-foreground border border-transparent hover:border-border active:scale-95"
            >
              {collapsedState ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto overflow-x-hidden pt-2 scrollbar-hide">
          {!collapsedState && <p className="px-3 text-[10px] font-black tracking-widest text-muted-foreground uppercase mb-3">Principal Menu</p>}
          {menuItems.map((item) => (
            <NavLink 
              key={item.path}
              to={item.path} 
              onClick={() => closeOnClick && setIsMobileOpen && setIsMobileOpen(false)}
              className={({ isActive }) => `
                group flex items-center p-3 rounded-xl transition-all duration-300 relative
                ${isActive ? 'bg-primary/10 text-primary font-bold' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}
              `}
            >
              <item.icon size={20} className="shrink-0" />
              <AnimatePresence>
                {!collapsedState && (
                  <motion.span 
                    initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}
                    className="ml-3.5 text-sm whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          ))}

          <div className="pt-8 pb-4">
            {!collapsedState && (
              <div className="flex items-center justify-between px-3 mb-4">
                <p className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">Portfolio</p>
                <Users size={12} className="text-muted-foreground/80" />
              </div>
            )}
            <div className="space-y-1">
              <button 
                onClick={() => { handleClientClick(null); closeOnClick && setIsMobileOpen && setIsMobileOpen(false); }}
                className={`w-full flex items-center p-3 rounded-xl text-sm transition-all ${!activeClient ? 'bg-primary/5 text-primary font-bold' : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'} ${collapsedState ? 'justify-center' : ''}`}
              >
                 <BarChart3 size={16} className={`shrink-0 ${collapsedState ? '' : 'mr-3'}`} />
                 {!collapsedState && <span>Campaigns Overview</span>}
              </button>

              {clients.map((client) => (
                <div key={client.name} className="group/item">
                  <button 
                    onClick={() => { handleClientClick(client.name); closeOnClick && setIsMobileOpen && setIsMobileOpen(false); }}
                    className={`w-full flex items-center p-3 rounded-xl text-sm transition-all ${activeClient === client.name ? 'bg-primary/10 text-primary font-bold' : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'} ${collapsedState ? 'justify-center' : ''}`}
                  >
                    <div className={`w-2 h-2 rounded-full mr-1.5 transition-colors shrink-0 ${activeClient === client.name ? 'bg-primary' : 'bg-primary/40 group-hover/item:bg-primary'}`} />
                    {!collapsedState && <span className="truncate font-medium">{client.name}</span>}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </nav>

        <div className="p-4 mt-auto border-t border-border/40 bg-muted/5">
           <NavLink 
              to="/settings" 
              onClick={() => closeOnClick && setIsMobileOpen && setIsMobileOpen(false)}
              className={({ isActive }) => `
                flex items-center p-3 rounded-xl transition-all duration-300
                ${isActive ? 'bg-card border border-border shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}
              `}
            >
              <Settings size={20} className="shrink-0" />
              {!collapsedState && <span className="ml-3.5 text-sm font-medium">Settings</span>}
            </NavLink>
            {!collapsedState && (
              <div className="mt-4 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                <p className="text-[10px] uppercase font-black text-primary/60 tracking-wider mb-1">Status</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">Premium Plan</span>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
              </div>
            )}
        </div>
      </>
    );
  };

  return (
    <>
      {/* Desktop Sidebar (hidden on mobile/tablet) */}
      <motion.aside 
        initial={false}
        animate={{ width: isCollapsed ? 80 : 280 }}
        className="hidden lg:flex h-screen bg-card sticky top-0 left-0 border-r border-border/60 flex-col transition-all z-[1000] shadow-sm backdrop-blur-3xl overflow-hidden"
      >
        {renderContent(isCollapsed, false)}
      </motion.aside>

      {/* Mobile Drawer (visible on mobile/tablet) */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-md z-[2000] lg:hidden"
            />
            {/* Sidebar drawer panel */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[280px] bg-card border-r border-border/60 z-[2001] flex flex-col shadow-2xl lg:hidden overflow-hidden"
            >
              {renderContent(false, true)}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
