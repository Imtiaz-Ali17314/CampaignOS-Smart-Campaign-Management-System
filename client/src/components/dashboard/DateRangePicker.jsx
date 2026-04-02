import React, { useState } from 'react';
import { Calendar, ChevronDown, Check, ArrowRight } from 'lucide-react';
import { subDays, format } from 'date-fns';

const DateRangePicker = ({ onRangeChange }) => {
  const [selectedRange, setSelectedRange] = useState('Last 30 Days');
  const [isOpen, setIsOpen] = useState(false);
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customRange, setCustomRange] = useState({ 
    start: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    end: format(new Date(), 'yyyy-MM-dd')
  });

  const ranges = [
    { label: 'Last 7 Days', days: 7 },
    { label: 'Last 30 Days', days: 30 },
    { label: 'Last 90 Days', days: 90 },
    { label: 'Custom Range', days: 0 }
  ];

  const handleSelect = (range) => {
    if (range.days === 0) {
      setIsCustomMode(true);
      setSelectedRange(range.label);
      return; // Keep open to show date inputs
    }

    setIsCustomMode(false);
    setSelectedRange(range.label);
    setIsOpen(false);
    
    if (range.days > 0) {
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      const start = subDays(end, range.days);
      start.setHours(0, 0, 0, 0);
      onRangeChange({ start, end });
    }
  };

  const handleApplyCustom = () => {
    const start = new Date(customRange.start);
    start.setHours(0, 0, 0, 0);
    const end = new Date(customRange.end);
    end.setHours(23, 59, 59, 999);
    onRangeChange({ start, end });
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2 bg-card border border-border rounded-xl text-sm font-medium hover:bg-muted transition-all active:scale-95 shadow-sm"
      >
        <Calendar size={18} className="text-primary" />
        {selectedRange}
        <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-64 bg-card border border-border rounded-2xl shadow-2xl z-[100] p-2 animate-in fade-in slide-in-from-top-2 backdrop-blur-xl">
          {!isCustomMode ? (
            <div className="space-y-1">
               {ranges.map((range) => (
                <button
                  key={range.label}
                  onClick={() => handleSelect(range)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-sm rounded-xl transition-colors ${
                    selectedRange === range.label 
                      ? 'bg-primary/10 text-primary font-bold' 
                      : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {range.label}
                  {selectedRange === range.label && <Check size={16} />}
                </button>
              ))}
            </div>
          ) : (
            <div className="p-3 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Configure Span</span>
                <button 
                  onClick={() => setIsCustomMode(false)}
                  className="text-[10px] font-bold text-primary hover:underline"
                >
                  Back
                </button>
              </div>
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 px-1">Start Date</label>
                  <input 
                    type="date" 
                    value={customRange.start}
                    onChange={(e) => setCustomRange(prev => ({ ...prev, start: e.target.value }))}
                    className="w-full bg-muted/20 border border-border/60 rounded-xl p-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 px-1">End Date</label>
                  <input 
                    type="date" 
                    value={customRange.end}
                    onChange={(e) => setCustomRange(prev => ({ ...prev, end: e.target.value }))}
                    className="w-full bg-muted/20 border border-border/60 rounded-xl p-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                  />
                </div>
              </div>
              <button 
                onClick={handleApplyCustom}
                className="w-full py-2.5 bg-primary text-white text-[10px] uppercase font-black tracking-widest rounded-xl hover:bg-primary-dark transition-all flex items-center justify-center gap-2"
              >
                Apply Range 
                <ArrowRight size={12} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
