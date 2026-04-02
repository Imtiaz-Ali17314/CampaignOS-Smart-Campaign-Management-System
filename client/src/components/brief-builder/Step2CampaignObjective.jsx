import React from 'react';
import { Target, Users2, CircleDollarSign } from 'lucide-react';

const Step2CampaignObjective = ({ formData, setFormData, errors }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const objectives = [
    { value: 'awareness', label: 'Brand Awareness', description: 'Maximize reach and visibility' },
    { value: 'consideration', label: 'Market Interest', description: 'Drive traffic and engagement' },
    { value: 'conversion', label: 'Growth/Sales', description: 'Lead gen and direct response' },
  ];

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h2 className="text-2xl font-black tracking-tight text-foreground">Strategic Intent</h2>
        <p className="text-sm text-muted-foreground font-medium">Define the core KPIs and audience segment for this flight.</p>
      </div>

      <div className="space-y-8">
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
            <Target className="w-3 h-3" />
            Core Objective*
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {objectives.map((obj) => (
              <label
                key={obj.value}
                className={`group relative flex flex-col p-5 border rounded-2xl cursor-pointer transition-all duration-300 ${
                  formData.objective === obj.value
                    ? 'border-primary bg-primary/[0.03] shadow-lg shadow-primary/5 ring-4 ring-primary/5'
                    : 'border-border/40 bg-card hover:border-primary/20'
                }`}
              >
                <input
                  type="radio"
                  name="objective"
                  value={obj.value}
                  checked={formData.objective === obj.value}
                  onChange={handleChange}
                  className="sr-only"
                />
                <span className={`block text-sm font-black mb-1.5 transition-colors ${
                  formData.objective === obj.value ? 'text-primary' : 'text-foreground'
                }`}>
                  {obj.label}
                </span>
                <span className="block text-[10px] font-bold text-muted-foreground leading-relaxed">
                  {obj.description}
                </span>
                {formData.objective === obj.value && (
                    <motion.div layoutId="badge" className="absolute top-2 right-2 w-1.5 h-1.5 bg-primary rounded-full" />
                )}
              </label>
            ))}
          </div>
          {errors.objective && <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">{errors.objective}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
            <Users2 className="w-3 h-3" />
            Segment Description*
          </label>
          <textarea
            name="targetAudience"
            value={formData.targetAudience || ''}
            onChange={handleChange}
            placeholder="e.g. TECH DECISION MAKERS AGED 25-45 IN URBAN HUBS..."
            className={`input-field h-32 resize-none uppercase text-[10px] tracking-widest font-black ${errors.targetAudience ? 'border-rose-500/50' : ''}`}
          />
          {errors.targetAudience && <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">{errors.targetAudience}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
            <CircleDollarSign className="w-3 h-3" />
            Budgetary Commitment (USD)*
          </label>
          <input
            type="number"
            name="budget"
            value={formData.budget || ''}
            onChange={handleChange}
            placeholder="MIN: 1,000"
            className={`input-field font-black ${errors.budget ? 'border-rose-500/50' : ''}`}
          />
          {errors.budget && <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">{errors.budget}</p>}
        </div>
      </div>
    </div>
  );
};

export default Step2CampaignObjective;
