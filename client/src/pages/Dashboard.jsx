import React, { useMemo } from 'react';
import { 
  TrendingUp, 
  MousePointer2, 
  Target, 
  DollarSign, 
  Sun, 
  Moon,
  Bell,
  Menu,
  BarChart3
} from 'lucide-react';
import { subDays } from 'date-fns';
import { motion } from 'framer-motion';


import KPICard from '../components/dashboard/KPICard';
import PerformanceTrend from '../components/dashboard/PerformanceTrend';
import CampaignTable from '../components/dashboard/CampaignTable';
import DateRangePicker from '../components/dashboard/DateRangePicker';
import Sidebar from '../components/dashboard/Sidebar';
import NotificationBell from '../components/notifications/NotificationBell';
import useDarkMode from '../hooks/useDarkMode';

import campaignData from '../data/campaigns.json';

const Dashboard = () => {
  const [dark, setDark] = useDarkMode();
  const [, setViewRange] = React.useState({
    start: subDays(new Date(), 30),
    end: new Date()
  });

  const campaigns = campaignData.campaigns;

  const stats = useMemo(() => {
    const totalImpressions = campaigns.reduce((acc, c) => acc + c.impressions, 0);
    const totalClicks = campaigns.reduce((acc, c) => acc + c.clicks, 0);
    const totalConversions = campaigns.reduce((acc, c) => acc + c.conversions, 0);
    const totalSpend = campaigns.reduce((acc, c) => acc + c.spend, 0);
    const totalBudget = campaigns.reduce((acc, c) => acc + c.budget, 0);

    const ctr = (totalClicks / totalImpressions) * 100;
    const roas = totalSpend > 0 ? (totalConversions * 50) / totalSpend : 0; // Assuming $50/conv average

    return {
      impressions: totalImpressions,
      clicks: totalClicks,
      conversions: totalConversions,
      spend: totalSpend,
      ctr: ctr.toFixed(2),
      roas: roas.toFixed(2),
      budgetUtilization: ((totalSpend / totalBudget) * 100).toFixed(1)
    };
  }, [campaigns]);

  // Combined daily metrics for the chart
  const combinedChartData = useMemo(() => {
    const dailyMap = {};
    campaigns.forEach(c => {
      c.dailyMetrics.forEach(m => {
        if (!dailyMap[m.date]) {
          dailyMap[m.date] = { date: m.date, impressions: 0, clicks: 0, spend: 0 };
        }
        dailyMap[m.date].impressions += m.impressions;
        dailyMap[m.date].clicks += m.clicks;
        dailyMap[m.date].spend += m.spend;
      });
    });
    return Object.values(dailyMap).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [campaigns]);

  return (
    <div className="flex bg-background min-h-screen text-foreground selection:bg-primary/20">
      <Sidebar campaigns={campaigns} />
      
      <main className="flex-1 overflow-x-hidden pt-6 sm:pt-10">
        <header className="max-w-[1600px] mx-auto px-6 md:px-12 flex flex-col lg:flex-row lg:items-center justify-between mb-12 gap-8">
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

            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="group relative cursor-pointer"
            >
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-secondary p-[2px]">
                    <div className="h-full w-full bg-card rounded-[14px] flex items-center justify-center font-black text-foreground group-hover:bg-transparent group-hover:text-white transition-all text-sm">
                        IA
                    </div>
                </div>
            </motion.div>
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
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-10 w-full py-4 bg-foreground text-background font-black rounded-2xl shadow-2xl hover:shadow-primary/20 transition-all text-xs uppercase tracking-widest"
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
                <CampaignTable campaigns={campaigns} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
