import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  MousePointer2, 
  Target, 
  DollarSign, 
  Sun, 
  Moon,
  Bell,
  Menu,
  BarChart3,
  LogOut,
  User,
  Settings as SettingsIcon
} from 'lucide-react';
import { subDays, format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';


import KPICard from '../components/dashboard/KPICard';
import PerformanceTrend from '../components/dashboard/PerformanceTrend';
import CampaignTable from '../components/dashboard/CampaignTable';
import DateRangePicker from '../components/dashboard/DateRangePicker';
import Sidebar from '../components/dashboard/Sidebar';
import NotificationBell from '../components/notifications/NotificationBell';
import useDarkMode from '../hooks/useDarkMode';
import BudgetAuditModal from '../components/dashboard/BudgetAuditModal';

import campaignData from '../data/campaigns.json';

const Dashboard = () => {
  const navigate = useNavigate();
  const [dark, setDark] = useDarkMode();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuditOpen, setIsAuditOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{"email": "Guest"}');
  const [viewRange, setViewRange] = React.useState(() => {
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    const start = subDays(end, 30);
    start.setHours(0, 0, 0, 0);
    return { start, end };
  });

  const campaigns = campaignData.campaigns;

  const metricsInRange = useMemo(() => {
    const metrics = [];
    campaigns.forEach(c => {
      c.dailyMetrics.forEach(m => {
        const mDate = new Date(m.date);
        if (mDate >= viewRange.start && mDate <= viewRange.end) {
          metrics.push({ ...m, campaignId: c.id, budget: c.budget / c.dailyMetrics.length }); // Mock budget per day
        }
      });
    });
    return metrics;
  }, [campaigns, viewRange]);

  const stats = useMemo(() => {
    const totalImpressions = metricsInRange.reduce((acc, m) => acc + m.impressions, 0);
    const totalClicks = metricsInRange.reduce((acc, m) => acc + m.clicks, 0);
    const totalConversions = metricsInRange.reduce((acc, m) => acc + m.conversions, 0);
    const totalSpend = metricsInRange.reduce((acc, m) => acc + m.spend, 0);
    
    // For budget, we'll use the total budget of campaigns that have metrics in this range
    const activeCampaignIds = new Set(metricsInRange.map(m => m.campaignId));
    const totalBudget = campaigns
      .filter(c => activeCampaignIds.has(c.id))
      .reduce((acc, c) => acc + c.budget, 0);

    const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
    const roas = totalSpend > 0 ? (totalConversions * 50) / totalSpend : 0;

    return {
      impressions: totalImpressions,
      clicks: totalClicks,
      conversions: totalConversions,
      spend: totalSpend,
      ctr: ctr.toFixed(2),
      roas: roas.toFixed(2),
      budgetUtilization: totalBudget > 0 ? ((totalSpend / totalBudget) * 100).toFixed(1) : 0
    };
  }, [metricsInRange, campaigns]);

  const campaignsWithRangeStats = useMemo(() => {
    return campaigns.map(c => {
      const rangeMetrics = c.dailyMetrics.filter(m => {
        const mDate = new Date(m.date);
        return mDate >= viewRange.start && mDate <= viewRange.end;
      });

      return {
        ...c,
        impressions: rangeMetrics.reduce((acc, m) => acc + m.impressions, 0),
        clicks: rangeMetrics.reduce((acc, m) => acc + m.clicks, 0),
        conversions: rangeMetrics.reduce((acc, m) => acc + m.conversions, 0),
        spend: rangeMetrics.reduce((acc, m) => acc + m.spend, 0)
        // Note: we keep the original budget for the campaign
      };
    }).filter(c => c.impressions > 0 || c.spend > 0); // Only show active campaigns in this range
  }, [campaigns, viewRange]);

  // Combined daily metrics for the chart
  const combinedChartData = useMemo(() => {
    const dailyMap = {};
    
    // Initialize the map with 0s for every day in the range
    let current = new Date(viewRange.start);
    while (current <= viewRange.end) {
      const dateStr = format(current, 'yyyy-MM-dd');
      dailyMap[dateStr] = { date: dateStr, impressions: 0, clicks: 0, spend: 0 };
      current.setDate(current.getDate() + 1);
    }

    metricsInRange.forEach(m => {
      if (dailyMap[m.date]) {
        dailyMap[m.date].impressions += m.impressions;
        dailyMap[m.date].clicks += m.clicks;
        dailyMap[m.date].spend += m.spend;
      }
    });

    return Object.values(dailyMap).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [metricsInRange, viewRange]);

  return (
    <div className="flex bg-background min-h-screen text-foreground selection:bg-primary/20">
      <Sidebar campaigns={campaigns} />
      
      <main className="flex-1 overflow-x-hidden pt-6 sm:pt-10">
        <header className="max-w-[1600px] mx-auto px-6 md:px-12 flex flex-col lg:flex-row lg:items-center justify-between mb-12 gap-8 relative z-50">
          <div className="flex items-center gap-5">
             <motion.div 
               whileHover={{ rotate: 90 }}
               className="p-3.5 bg-primary rounded-2xl lg:hidden shadow-lg shadow-primary/20 cursor-pointer"
             >
              <Menu size={20} className="text-white" />
            </motion.div>
            <div>
              <motion.h1 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl sm:text-4xl font-black tracking-tight mb-2 leading-none"
              >
                Strategy <span className="gradient-text">Overview</span>
              </motion.h1>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[10px] font-black uppercase tracking-widest">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live System
                </div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Last Sync: 2m ago</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 self-end lg:self-auto bg-card/40 p-2 rounded-3xl border border-border/40 backdrop-blur-md">
            <DateRangePicker onRangeChange={setViewRange} />
            
            <div className="w-px h-8 bg-border/40 mx-1 hidden sm:block" />

            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setDark(!dark)}
              className="p-3 bg-card border border-border/60 rounded-2xl text-muted-foreground hover:bg-muted/50 hover:text-primary transition-all shadow-sm"
            >
              {dark ? <Sun size={18} strokeWidth={2.5} /> : <Moon size={18} strokeWidth={2.5} />}
            </motion.button>

            <NotificationBell />

            <div className="relative">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="group relative cursor-pointer"
              >
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-secondary p-[2px]">
                      <div className="h-full w-full bg-card rounded-[14px] flex items-center justify-center font-black text-foreground group-hover:bg-transparent group-hover:text-white transition-all text-sm uppercase">
                          {user.email.substring(0, 2)}
                      </div>
                  </div>
              </motion.div>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-64 bg-card border border-border/60 rounded-3xl shadow-2xl z-[100] p-3 backdrop-blur-xl"
                  >
                    <div className="p-4 mb-2 border-b border-border/40">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1">Session Active</p>
                      <p className="text-sm font-black text-foreground truncate">{user.email}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <button 
                        onClick={() => navigate('/settings?tab=profile')}
                        className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-2xl transition-all"
                      >
                        <User size={16} />
                        Strategic Profile
                      </button>
                      <button 
                        onClick={() => navigate('/settings?tab=ai')}
                        className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-2xl transition-all"
                      >
                        <SettingsIcon size={16} />
                        Global Config
                      </button>
                      <div className="h-px bg-border/40 my-2" />
                      <button 
                        onClick={() => {
                          localStorage.removeItem('token');
                          localStorage.removeItem('user');
                          window.location.href = '/login';
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-rose-500 hover:bg-rose-500/10 rounded-2xl transition-all"
                      >
                        <LogOut size={16} />
                        Terminate Session
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <div className="max-w-[1600px] mx-auto px-6 md:px-12 pb-20 space-y-12 page-transition">
          {/* KPI Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <KPICard title="Global Impressions" value={stats.impressions} icon={TrendingUp} trend={12.4} color="text-primary" />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <KPICard title="Target Clicks" value={stats.clicks} icon={MousePointer2} trend={-3.2} color="text-emerald-500" />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <KPICard title="Click Through Rate" value={stats.ctr} suffix="%" icon={Target} trend={0.8} color="text-secondary" />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <KPICard title="Ad Investment" value={stats.spend} icon={DollarSign} color="text-accent" />
            </motion.div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-stretch">
            <div className="xl:col-span-8">
              <div className="glass-card rounded-[2.5rem] p-8 h-full border-border/40 overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -mr-32 -mt-32" />
                <div className="flex items-center justify-between mb-8 relative">
                    <div>
                        <h2 className="text-xl font-black tracking-tight">Performance Stream</h2>
                        <p className="text-xs text-muted-foreground font-medium">Real-time engagement metrics across all active channels</p>
                    </div>
                    <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary-dark transition-colors border-b-2 border-primary/20 pb-0.5">Export Analytics</button>
                </div>
                <PerformanceTrend data={combinedChartData} />
              </div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="xl:col-span-4 glass-card rounded-[2.5rem] p-8 flex flex-col items-center justify-center border-primary/10 shadow-xl shadow-primary/5 relative overflow-hidden group"
            >
               <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
               <div className="mb-8 relative h-56 w-56 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90">
                    <circle 
                      cx="112" cy="112" r="95" 
                      stroke="currentColor" 
                      strokeWidth="16" 
                      fill="transparent" 
                      className="text-muted/10"
                    />
                    <motion.circle 
                      initial={{ strokeDashoffset: 597 }}
                      animate={{ strokeDashoffset: 597 - (597 * stats.budgetUtilization / 100) }}
                      transition={{ duration: 2, ease: "circOut" }}
                      cx="112" cy="112" r="95" 
                      stroke="url(#gradient)" 
                      strokeWidth="16" 
                      strokeDasharray="597"
                      fill="transparent" 
                      strokeLinecap="round"
                    />
                    <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="var(--color-primary)" />
                            <stop offset="100%" stopColor="var(--color-secondary)" />
                        </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-5xl font-black tracking-tighter text-foreground">{stats.budgetUtilization}%</span>
                    <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-1 opacity-60">Utilization</span>
                  </div>
                </div>
                
                <div className="text-center">
                    <h3 className="font-black text-xl mb-3 tracking-tight">Financial Health</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed px-4 opacity-80">
                        Your current spend is within the <span className="text-emerald-500 font-bold">Safety Zone</span>. No overpacing detected for current flight.
                    </p>
                </div>
                
                <motion.button 
                  whileHover={{ scale: 1.02, backgroundColor: 'var(--color-primary)', color: 'white' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsAuditOpen(true)}
                  className="mt-8 w-full py-4 bg-foreground text-background font-black rounded-2xl shadow-xl hover:shadow-primary/20 transition-all text-[10px] uppercase tracking-widest relative z-10"
                >
                  Deep Budget Audit
                </motion.button>
            </motion.div>
          </div>

          <div className="pt-4">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-card border border-border rounded-xl">
                        <BarChart3 size={18} className="text-primary" />
                    </div>
                    <div>
                        <h2 className="font-black text-xl tracking-tight">Active Campaigns</h2>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest opacity-60">Operational Monitoring</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{campaigns.length} Active Records</span>
                </div>
            </div>
            <div className="glass-card rounded-[2.5rem] border-border/40 overflow-hidden shadow-2xl shadow-black/5">
                <CampaignTable campaigns={campaignsWithRangeStats} />
            </div>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {isAuditOpen && (
          <BudgetAuditModal 
            onClose={() => setIsAuditOpen(false)} 
            stats={stats}
            campaigns={campaignsWithRangeStats}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
