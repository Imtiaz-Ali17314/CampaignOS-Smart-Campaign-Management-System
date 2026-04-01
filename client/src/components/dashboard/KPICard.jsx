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
      className="bg-card p-6 rounded-2xl border border-border shadow-sm hover:shadow-xl transition-all duration-300"
    >
      <div className="flex justify-between items-start">
        <div className={`p-3 rounded-xl bg-opacity-10 ${color}`}>
          <Icon className="text-current" size={24} />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${isPositive ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'}`}>
            {isPositive ? <TrendingUp size={12} className="mr-1" /> : <TrendingDown size={12} className="mr-1" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      
      <div className="mt-4">
        <p className="text-muted-foreground text-sm font-medium">{title}</p>
        <div className="flex items-baseline mt-1">
          <h3 className="text-2xl font-bold tracking-tight">
            {typeof value === 'number' ? value.toLocaleString() : value}{suffix}
          </h3>
        </div>
      </div>
      
      <div className="mt-4 w-full bg-muted h-1 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: "70%" }}
          transition={{ duration: 1, delay: 0.5 }}
          className={`h-full ${color.replace('text-', 'bg-')}`}
        />
      </div>
    </motion.div>
  );
};

export default KPICard;
