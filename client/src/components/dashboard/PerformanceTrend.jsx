import React, { useState, useMemo } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card/95 backdrop-blur-md border border-border p-4 rounded-xl shadow-2xl">
        <p className="text-sm font-bold border-b border-border mb-2 pb-2 text-foreground">{label}</p>
        <div className="space-y-1.5">
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-6">
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: entry.color }} 
                />
                <span className="text-xs text-muted-foreground font-medium">{entry.name}</span>
              </div>
              <span className="text-xs font-bold text-foreground">
                {entry.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const PerformanceTrend = ({ data }) => {
  const [activeLines, setActiveLines] = useState({
    impressions: true,
    clicks: true,
    spend: true
  });

  const toggleLine = (key) => {
    setActiveLines(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-card p-6 rounded-2xl border border-border shadow-sm w-full h-[400px]"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-lg font-bold tracking-tight">Performance Trend</h2>
          <p className="text-sm text-muted-foreground">Historical data for selected range</p>
        </div>
        <div className="flex gap-2">
          {['impressions', 'clicks', 'spend'].map((key) => (
            <button
              key={key}
              onClick={() => toggleLine(key)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeLines[key] 
                  ? 'bg-primary/20 text-primary border border-primary/30 ring-2 ring-primary/10' 
                  : 'bg-muted text-muted-foreground border border-transparent'
              }`}
            >
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height="80%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorImpressions" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#aa3bff" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#aa3bff" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
          <XAxis 
            dataKey="date" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
            dy={10}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
            dx={-10}
            tickFormatter={(value) => value > 1000 ? `${(value/1000).toFixed(1)}k` : value}
          />
          <Tooltip content={<CustomTooltip />} />
          
          {activeLines.impressions && (
            <Area 
              type="monotone" 
              dataKey="impressions" 
              stroke="#aa3bff" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorImpressions)" 
              animationDuration={1500}
            />
          )}
          {activeLines.clicks && (
            <Area 
              type="monotone" 
              dataKey="clicks" 
              stroke="#10b981" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorClicks)" 
              animationDuration={1500}
            />
          )}
          {activeLines.spend && (
            <Area 
              type="monotone" 
              dataKey="spend" 
              stroke="#f59e0b" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorSpend)" 
              animationDuration={1500}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default PerformanceTrend;
