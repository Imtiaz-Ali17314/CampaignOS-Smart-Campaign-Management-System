import React, { useState, useMemo } from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  Search, 
  Filter, 
  MoreVertical,
  Target, 
  Activity,
  CheckCircle2,
  Clock,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  LogOut,
  TrendingUp,
  Settings as SettingsIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../../context/NotificationContext';

const CampaignTable = ({ campaigns, onAudit, onToggleStatus, onComplete, onArchive, onLaunch, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeMenu, setActiveMenu] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredCampaigns = useMemo(() => {
    return campaigns
      .filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (c.client_name || '').toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
  }, [campaigns, searchTerm, sortConfig]);

  const totalPages = Math.ceil(filteredCampaigns.length / rowsPerPage);
  const paginatedCampaigns = filteredCampaigns.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const StatusPill = ({ status }) => {
    const config = {
      active: { 
        bg: 'bg-green-100 dark:bg-green-900/30', 
        text: 'text-green-700 dark:text-green-400',
        dot: 'bg-green-500',
        icon: Activity 
      },
      paused: { 
        bg: 'bg-yellow-100 dark:bg-yellow-900/30', 
        text: 'text-yellow-700 dark:text-yellow-400',
        dot: 'bg-yellow-500',
        icon: Clock 
      },
      completed: { 
        bg: 'bg-gray-100 dark:bg-gray-800', 
        text: 'text-gray-700 dark:text-gray-400',
        dot: 'bg-gray-500',
        icon: CheckCircle2 
      },
      draft: {
        bg: 'bg-blue-100 dark:bg-blue-900/30',
        text: 'text-blue-700 dark:text-blue-400',
        dot: 'bg-blue-500',
        icon: Clock
      }
    };
    const { bg, text, dot, icon: Icon } = config[status] || config.completed;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${bg} ${text}`}>
        <span className={`w-1.5 h-1.5 rounded-full mr-2 ${dot}`} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="bg-transparent overflow-hidden">
      <div className="p-8 border-b border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="relative group flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 group-focus-within:text-primary transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Search campaigns, clients or strategies..." 
            className="w-full pl-12 pr-4 py-3 bg-muted/20 border border-border/40 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/40 transition-all placeholder:text-muted-foreground/30 placeholder:uppercase placeholder:tracking-widest"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
            <button 
              onClick={() => showNotification("Multi-Channel Query Engine Initializing...", "info")}
              className="p-3 bg-card border border-border/60 rounded-xl text-muted-foreground hover:text-primary transition-all shadow-sm"
            >
                <Filter size={16} strokeWidth={2.5} />
            </button>
            <button 
              onClick={() => navigate('/brief-builder')}
              className="btn-premium btn-primary py-2.5 px-6 text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
                <TrendingUp size={14} />
                Launch Campaign
            </button>
        </div>
      </div>

      <div className="overflow-x-auto scrollbar-hide pb-48">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border/20">
              {['name', 'status', 'budget', 'spend', 'conversions'].map((key) => (
                <th 
                  key={key} 
                  className="px-8 py-5 text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em] cursor-pointer hover:text-primary transition-colors"
                  onClick={() => handleSort(key)}
                >
                  <div className="flex items-center gap-2">
                    {key.replace('_', ' ')}
                    {sortConfig.key === key ? (
                      sortConfig.direction === 'asc' ? <ChevronUp size={12} className="text-primary" /> : <ChevronDown size={12} className="text-primary" />
                    ) : <ArrowUpDown size={10} className="opacity-20" />}
                  </div>
                </th>
              ))}
              <th className="px-8 py-5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/10">
            {paginatedCampaigns.map((campaign) => (
              <tr key={campaign.id} className="hover:bg-primary/[0.02] transition-colors group">
                <td className="px-8 py-6">
                  <div className="font-black text-sm tracking-tight text-foreground group-hover:text-primary transition-colors">{campaign.name}</div>
                  <div className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mt-0.5">{campaign.client_name}</div>
                </td>
                <td className="px-8 py-6">
                  <StatusPill status={campaign.status} />
                </td>
                <td className="px-8 py-6 font-black text-xs tracking-tighter opacity-80">${(campaign.budget || 0).toLocaleString()}</td>
                <td className="px-8 py-6 font-black text-xs tracking-tighter opacity-80">${(campaign.spend || 0).toLocaleString()}</td>
                <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-primary tracking-tighter">{(campaign.conversions || 0).toLocaleString()}</span>
                        <div className="w-12 h-1.5 bg-muted/20 rounded-full overflow-hidden hidden sm:block">
                            <div className="h-full bg-primary" style={{ width: `${Math.min(((campaign.conversions || 0) / 1000) * 100, 100)}%` }} />
                        </div>
                    </div>
                </td>
                <td className="px-8 py-6 text-right relative">
                  <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenu(activeMenu === campaign.id ? null : campaign.id);
                    }}
                    className={`p-2.5 hover:bg-muted rounded-xl transition-all ${activeMenu === campaign.id ? 'bg-muted opacity-100 text-primary' : 'opacity-0 group-hover:opacity-100'}`}
                  >
                    <MoreVertical size={16} className="text-muted-foreground" />
                  </button>

                  <AnimatePresence>
                    {activeMenu === campaign.id && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setActiveMenu(null)} />
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                className="absolute right-8 mt-2 w-48 bg-card border border-border/60 rounded-2xl shadow-2xl z-20 p-2 backdrop-blur-xl"
                            >
                                <button 
                                    onClick={() => {
                                        onEdit(campaign);
                                        setActiveMenu(null);
                                    }}
                                    className="w-full text-left px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-xl transition-all flex items-center gap-3"
                                >
                                    <SettingsIcon size={14} />
                                    Edit Settings
                                </button>
                                <button 
                                    onClick={() => {
                                        onAudit(campaign.id);
                                        setActiveMenu(null);
                                    }}
                                    className="w-full text-left px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-xl transition-all flex items-center gap-3"
                                >
                                    <Target size={14} />
                                    Deep Audit
                                </button>
                                <button 
                                    onClick={() => {
                                        onToggleStatus(campaign.id);
                                        setActiveMenu(null);
                                    }}
                                    className="w-full text-left px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-amber-500 hover:bg-amber-500/5 rounded-xl transition-all flex items-center gap-3"
                                >
                                    <Clock size={14} />
                                    {campaign.status === 'active' ? 'Pause Strategy' : 'Resume Strategy'}
                                </button>
                                {campaign.status !== 'completed' && (
                                    <button 
                                        onClick={() => {
                                            onComplete(campaign.id);
                                            setActiveMenu(null);
                                        }}
                                        className="w-full text-left px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-emerald-500 hover:bg-emerald-500/5 rounded-xl transition-all flex items-center gap-3"
                                    >
                                        <CheckCircle2 size={14} />
                                        Complete Protocol
                                    </button>
                                )}
                                <div className="h-px bg-border/20 my-1 mx-2" />
                                <button 
                                    onClick={() => {
                                        onDelete(campaign.id);
                                        setActiveMenu(null);
                                    }}
                                    className="w-full text-left px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-500/5 rounded-xl transition-all flex items-center gap-3"
                                >
                                    <LogOut size={14} />
                                    Retire Strategy
                                </button>
                            </motion.div>
                        </>
                    )}
                  </AnimatePresence>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-6 bg-muted/5 border-t border-border/20 flex items-center justify-between">
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
          Viewing <span className="text-foreground">{((currentPage - 1) * rowsPerPage) + 1}</span> - <span className="text-foreground">{Math.min(currentPage * rowsPerPage, filteredCampaigns.length)}</span> of <span className="text-foreground">{filteredCampaigns.length}</span> strategies
        </p>
        <div className="flex gap-3">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className="p-2 bg-card border border-border/60 rounded-xl text-muted-foreground hover:text-primary disabled:opacity-0 transition-all font-black text-[10px] uppercase tracking-widest"
          >
            <ChevronLeft size={16} />
          </button>
          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
            className="p-2 bg-card border border-border/60 rounded-xl text-muted-foreground hover:text-primary disabled:opacity-0 transition-all font-black text-[10px] uppercase tracking-widest"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CampaignTable;
