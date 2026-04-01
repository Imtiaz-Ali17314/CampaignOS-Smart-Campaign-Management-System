import React, { useState } from 'react';
import { Calendar, ChevronDown, Check } from 'lucide-react';
import { subDays, format, isWithinInterval } from 'date-fns';

const DateRangePicker = ({ onRangeChange }) => {
  const [selectedRange, setSelectedRange] = useState('Last 30 Days');
  const [isOpen, setIsOpen] = useState(false);

  const ranges = [
    { label: 'Last 7 Days', days: 7 },
    { label: 'Last 30 Days', days: 30 },
    { label: 'Last 90 Days', days: 90 },
    { label: 'Custom Range', days: 0 }
  ];

  const handleSelect = (range) => {
    setSelectedRange(range.label);
    setIsOpen(false);
    if (range.days > 0) {
      const end = new Date();
      const start = subDays(end, range.days);
      onRangeChange({ start, end });
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2 bg-card border border-border rounded-xl text-sm font-medium hover:bg-muted transition-all active:scale-95"
      >
        <Calendar size={18} className="text-primary" />
        {selectedRange}
        <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-2xl shadow-2xl z-[100] p-2 animate-in fade-in slide-in-from-top-2">
          {ranges.map((range) => (
            <button
              key={range.label}
              onClick={() => handleSelect(range)}
              className={`w-full flex items-center justify-between px-4 py-2 text-sm rounded-lg transition-colors ${
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
      )}
    </div>
  );
};

export default DateRangePicker;
