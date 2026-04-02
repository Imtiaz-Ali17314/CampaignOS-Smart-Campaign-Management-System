import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

const KPICard = ({ title, value, icon: Icon, trend, color, suffix = "" }) => {
  const isPositive = trend > 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="glass-card p-6 rounded-[2rem] glass-card-hover group relative overflow-hidden"
    >
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
      
      <div className="flex justify-between items-start mb-6">
        <div className={`p-4 rounded-2xl ${color.replace('text-', 'bg-')}/10 ${color}`}>
          <Icon className="text-current" size={24} strokeWidth={2.5} />
        </div>
        {trend !== undefined && (
          <div className={`status-pill ${isPositive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
            {isPositive ? <TrendingUp size={12} strokeWidth={3} /> : <TrendingDown size={12} strokeWidth={3} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      
      <div>
        <p className="text-muted-foreground/70 text-xs font-black uppercase tracking-widest mb-1">{title}</p>
        <div className="flex items-baseline gap-1">
          <h3 className="text-3xl font-black tracking-tighter text-foreground">
            {typeof value === 'number' ? value.toLocaleString() : value}
            <span className="text-primary ml-1">{suffix}</span>
          </h3>
        </div>
      </div>
      
      <div className="mt-6 flex items-center justify-between">
        <div className="flex -space-x-2">
            {[1,2,3].map(i => (
                <div key={i} className="w-6 h-6 rounded-full border-2 border-card bg-muted/20" />
            ))}
        </div>
        <span className="text-[10px] font-bold text-muted-foreground/50">+12 active now</span>
      </div>
    </motion.div>
  );
};

export default KPICard;
