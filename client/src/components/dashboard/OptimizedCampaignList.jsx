/**
 * Section 3: Speed Tasks — Q4: Reactive Component Optimization
 * Features: useMemo, useCallback, React.memo for efficient rendering.
 */

import React, { useState, useMemo, useCallback, memo } from 'react';

// Memoized child component to prevent unnecessary re-renders
const CampaignItem = memo(({ campaign, onToggle }) => {
  console.log(`Rendering CampaignItem: ${campaign.name}`);
  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 transition-all hover:shadow-md">
      <div>
        <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-tight">{campaign.name}</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400">Budget: ${campaign.budget}</p>
      </div>
      <button
        onClick={() => onToggle(campaign.id)}
        className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-200 ${
          campaign.active ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
        }`}
      >
        {campaign.active ? 'ACTIVE' : 'PAUSED'}
      </button>
    </div>
  );
});

const OptimizedCampaignList = ({ data }) => {
  const [filter, setFilter] = useState('');
  const [campaigns, setCampaigns] = useState(data || []);

  // 1. FIXED: Derived state using useMemo to prevent recalculation on every render
  const filteredData = useMemo(() => {
    console.log('Recalculating filteredData...');
    return campaigns.filter((c) =>
      c.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [campaigns, filter]);

  // 2. FIXED: Stable callback for onToggle passing to memoized child components
  const handleToggle = useCallback((id) => {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
    );
  }, []); // Empty deps because it only depends on setCampaigns which is stable

  return (
    <div className="space-y-6">
      <div className="relative">
         <input
           type="text"
           value={filter}
           onChange={(e) => setFilter(e.target.value)}
           placeholder="Search campaigns..."
           className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
         />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredData.map((campaign) => (
           /* 3. FIXED: Using memoized component with stable callback handles */
           <CampaignItem
              key={campaign.id}
              campaign={campaign}
              onToggle={handleToggle}
           />
        ))}
      </div>
      
      {filteredData.length === 0 && (
        <p className="text-center text-slate-500 dark:text-slate-400 py-10">No campaigns found matching "{filter}"</p>
      )}
    </div>
  );
};

export default OptimizedCampaignList;
