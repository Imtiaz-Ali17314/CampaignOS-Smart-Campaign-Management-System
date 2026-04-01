import React, { useMemo, useState } from 'react';
import { 
  TrendingUp, 
  MousePointer2, 
  Target, 
  DollarSign, 
  Sun, 
  Moon,
  Bell,
  Menu
} from 'lucide-react';
import { motion } from 'framer-motion';
import { subDays } from 'date-fns';

import KPICard from '../components/dashboard/KPICard';
import PerformanceTrend from '../components/dashboard/PerformanceTrend';
import CampaignTable from '../components/dashboard/CampaignTable';
import DateRangePicker from '../components/dashboard/DateRangePicker';
import Sidebar from '../components/dashboard/Sidebar';
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
    <div className="flex bg-[var(--background)] min-h-screen">
      <Sidebar campaigns={campaigns} />
      
      <main className="flex-1 overflow-x-hidden pt-4 sm:pt-8">
        <header className="px-6 md:px-12 flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-6">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-primary/10 rounded-2xl sm:hidden">
              <Menu size={20} className="text-primary" />
            </div>
            <div>
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-2xl sm:text-3xl font-bold tracking-tight mb-1"
              >
                Campaign Overview
              </motion.h1>
              <p className="text-sm text-muted-foreground flex items-center">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
                Live dashboard • Updated 2m ago
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 self-end sm:self-auto">
            <DateRangePicker onRangeChange={setViewRange} />
            
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setDark(!dark)}
              className="p-2 sm:p-3 bg-card border border-border rounded-xl text-muted-foreground hover:bg-muted transition-all"
            >
              {dark ? <Sun size={20} /> : <Moon size={20} />}
            </motion.button>

            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 sm:p-3 bg-card border border-border rounded-xl text-muted-foreground hover:bg-muted transition-all relative"
            >
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 border-2 border-[var(--card)] bg-red-500 rounded-full" />
            </motion.button>

            <div className="h-10 sm:h-12 w-10 sm:w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary cursor-pointer hover:bg-primary/20 transition-all">
              IA
            </div>
          </div>
        </header>

        <div className="max-w-[1600px] mx-auto px-6 md:px-12 pb-12">
          {/* KPI Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
            <KPICard 
              title="Total Impressions" 
              value={stats.impressions} 
              icon={TrendingUp} 
              trend={12.4} 
              color="text-primary" 
            />
            <KPICard 
              title="Total Clicks" 
              value={stats.clicks} 
              icon={MousePointer2} 
              trend={-3.2} 
              color="text-green-500" 
            />
            <KPICard 
              title="Avg CTR" 
              value={stats.ctr} 
              suffix="%" 
              icon={Target} 
              trend={0.8} 
              color="text-secondary" 
            />
            <KPICard 
              title="Total Spend" 
              value={stats.spend} 
              icon={DollarSign} 
              color="text-orange-500" 
            />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2">
              <PerformanceTrend data={combinedChartData} />
            </div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-card border border-border rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-sm h-full"
            >
               <div className="mb-6 relative h-48 w-48 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90">
                    <circle 
                      cx="96" cy="96" r="80" 
                      stroke="currentColor" 
                      strokeWidth="12" 
                      fill="transparent" 
                      className="text-muted/30"
                    />
                    <motion.circle 
                      initial={{ strokeDashoffset: 504 }}
                      animate={{ strokeDashoffset: 504 - (504 * stats.budgetUtilization / 100) }}
                      transition={{ duration: 2, ease: "easeOut" }}
                      cx="96" cy="96" r="80" 
                      stroke="currentColor" 
                      strokeWidth="12" 
                      strokeDasharray="504"
                      fill="transparent" 
                      strokeLinecap="round"
                      className="text-primary"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-4xl font-black text-foreground">{stats.budgetUtilization}%</span>
                    <span className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">Utilization</span>
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-2">Budget Health</h3>
                <p className="text-sm text-muted-foreground px-4">Your campaigns are performing optimally within the allocated budgets.</p>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  className="mt-8 px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all w-full"
                >
                  Manage Budgets
                </motion.button>
            </motion.div>
          </div>

          <div className="mt-10">
            <CampaignTable campaigns={campaigns} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
