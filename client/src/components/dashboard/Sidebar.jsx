import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  Settings, 
  ChevronRight, 
  ChevronLeft,
  LayoutDashboard,
  FileEdit,
  Bell
} from 'lucide-react';

const Sidebar = ({ campaigns }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Group campaigns by client
  const clients = Array.from(new Set(campaigns.map(c => c.client))).map(clientName => ({
    name: clientName,
    campaigns: campaigns.filter(c => c.client === clientName)
  }));

  return (
    <aside className={`${isCollapsed ? 'w-20' : 'w-64'} h-screen bg-card border-r border-border flex flex-col transition-all duration-300 overflow-y-auto z-50`}>
      <div className="p-6 flex items-center justify-between border-b border-border">
        {!isCollapsed && <h1 className="text-xl font-bold text-primary">CampaignOS</h1>}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 hover:bg-muted rounded-lg transition-colors text-muted-foreground"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="flex-1 mt-6 px-3 space-y-2">
        <NavLink 
          to="/" 
          className={({ isActive }) => `flex items-center p-3 rounded-xl transition-all ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-muted'}`}
        >
          <LayoutDashboard size={20} />
          {!isCollapsed && <span className="ml-3 font-medium">Dashboard</span>}
        </NavLink>
        
        <NavLink 
          to="/brief" 
          className={({ isActive }) => `flex items-center p-3 rounded-xl transition-all ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-muted'}`}
        >
          <FileEdit size={20} />
          {!isCollapsed && <span className="ml-3 font-medium">Brief Builder</span>}
        </NavLink>

        <div className="pt-4 pb-2">
          {!isCollapsed && <p className="px-3 text-xs font-semibold text-muted tracking-wider uppercase mb-2">Clients</p>}
          <div className="space-y-1">
            {clients.map((client) => (
              <div key={client.name} className="px-3">
                <button className={`w-full flex items-center py-2 text-sm text-muted-foreground hover:text-foreground transition-all`}>
                  <Users size={18} />
                  {!isCollapsed && <span className="ml-3 truncate">{client.name}</span>}
                </button>
                {!isCollapsed && (
                  <div className="ml-7 border-l border-border pl-4 space-y-1 mt-1 transition-all">
                    {client.campaigns.map(campaign => (
                      <button key={campaign.id} className="text-xs text-muted-foreground hover:text-primary transition-colors truncate block w-full text-left py-1">
                        {campaign.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </nav>

      <div className="p-4 border-t border-border mt-auto">
        <NavLink 
          to="/settings" 
          className={({ isActive }) => `flex items-center p-3 rounded-xl transition-all ${isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'}`}
        >
          <Settings size={20} />
          {!isCollapsed && <span className="ml-3 font-medium">Settings</span>}
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
