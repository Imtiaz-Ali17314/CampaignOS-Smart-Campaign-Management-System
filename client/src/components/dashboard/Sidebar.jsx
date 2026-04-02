import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  Settings, 
  ChevronRight, 
  ChevronLeft,
  LayoutDashboard,
  FileEdit
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ campaigns, onClientSelect, activeClient }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const clients = Array.from(new Set(campaigns.map(c => c.client))).map(clientName => ({
    name: clientName,
    campaigns: campaigns.filter(c => c.client === clientName)
  }));

  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/brief-builder', icon: FileEdit, label: 'Brief Builder' },
  ];

  return (
    <motion.aside 
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      className="h-screen bg-card sticky top-0 left-0 border-r border-border/60 flex flex-col transition-all z-[1000] shadow-sm backdrop-blur-3xl overflow-hidden"
    >
      <div className="p-6 flex items-center justify-between mb-4">
        <AnimatePresence mode="wait">
          {!isCollapsed && (
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
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2.5 hover:bg-muted/80 rounded-xl transition-all text-muted-foreground border border-transparent hover:border-border active:scale-95"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto overflow-x-hidden pt-2 scrollbar-hide">
        {!isCollapsed && <p className="px-3 text-[10px] font-black tracking-widest text-muted-foreground/60 uppercase mb-3">Principal Menu</p>}
        {menuItems.map((item) => (
          <NavLink 
            key={item.path}
            to={item.path} 
            className={({ isActive }) => `
              group flex items-center p-3 rounded-xl transition-all duration-300 relative
              ${isActive ? 'bg-primary/10 text-primary font-bold' : 'text-muted-foreground hover:bg-muted/50'}
            `}
          >
            <item.icon size={20} className="shrink-0" />
            <AnimatePresence>
              {!isCollapsed && (
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
          {!isCollapsed && (
            <div className="flex items-center justify-between px-3 mb-4">
              <p className="text-[10px] font-black tracking-widest text-muted-foreground/60 uppercase">Portfolio</p>
              <Users size={12} className="text-muted-foreground/40" />
            </div>
          )}
          <div className="space-y-1">
            {/* NEW: Campaigns Link that resets filter */}
            <button 
              onClick={() => onClientSelect(null)}
              className={`w-full flex items-center p-3 rounded-xl text-sm transition-all ${!activeClient ? 'bg-primary/5 text-primary font-bold' : 'text-muted-foreground hover:bg-muted/30'} ${isCollapsed ? 'justify-center' : ''}`}
            >
               <BarChart3 size={16} className={`shrink-0 ${isCollapsed ? '' : 'mr-3'}`} />
               {!isCollapsed && <span>Campaigns Overview</span>}
            </button>

            {clients.map((client) => (
              <div key={client.name} className="group/item">
                <button 
                  onClick={() => onClientSelect(client.name)}
                  className={`w-full flex items-center p-3 rounded-xl text-sm transition-all ${activeClient === client.name ? 'bg-primary/10 text-primary font-bold' : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'} ${isCollapsed ? 'justify-center' : ''}`}
                >
                  <div className={`w-2 h-2 rounded-full mr-1.5 transition-colors shrink-0 ${activeClient === client.name ? 'bg-primary' : 'bg-primary/40 group-hover/item:bg-primary'}`} />
                  {!isCollapsed && <span className="truncate font-medium">{client.name}</span>}
                </button>
              </div>
            ))}
          </div>
        </div>
      </nav>

      <div className="p-4 mt-auto border-t border-border/40 bg-muted/5">
         <NavLink 
            to="/settings" 
            className={({ isActive }) => `
              flex items-center p-3 rounded-xl transition-all duration-300
              ${isActive ? 'bg-card border border-border shadow-sm text-primary' : 'text-muted-foreground hover:bg-muted/50'}
            `}
          >
            <Settings size={20} className="shrink-0" />
            {!isCollapsed && <span className="ml-3.5 text-sm font-medium">Settings</span>}
          </NavLink>
          {!isCollapsed && (
            <div className="mt-4 p-4 bg-primary/5 rounded-2xl border border-primary/10">
              <p className="text-[10px] uppercase font-black text-primary/60 tracking-wider mb-1">Status</p>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold">Premium Plan</span>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            </div>
          )}
      </div>
    </motion.aside>
  );
};

export default Sidebar;
