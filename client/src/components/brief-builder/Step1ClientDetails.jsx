import React from 'react';
import { User, Building2, Globe, Users } from 'lucide-react';

const Step1ClientDetails = ({ formData, setFormData, errors }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h2 className="text-2xl font-black tracking-tight text-foreground">Market Orientation</h2>
        <p className="text-sm text-muted-foreground font-medium">Define the core brand identity and operational industry.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
            <Building2 className="w-3 h-3" />
            Client Identity*
          </label>
          <input
            type="text"
            name="clientName"
            value={formData.clientName || ''}
            onChange={handleChange}
            placeholder="Search or enter brand name"
            className={`input-field ${errors.clientName ? 'border-rose-500/50' : ''}`}
          />
          {errors.clientName && <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">{errors.clientName}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
            <User className="w-3 h-3" />
            Industry Sector*
          </label>
          <input
            type="text"
            name="industry"
            value={formData.industry || ''}
            onChange={handleChange}
            placeholder="e.g. FINTECH / AG-TECH"
            className={`input-field ${errors.industry ? 'border-rose-500/50' : ''}`}
          />
          {errors.industry && <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">{errors.industry}</p>}
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
            <Globe className="w-3 h-3" />
            Digital Presence (URL)*
          </label>
          <input
            type="url"
            name="website"
            value={formData.website || ''}
            onChange={handleChange}
            placeholder="https://platform.brand.com"
            className={`input-field ${errors.website ? 'border-rose-500/50' : ''}`}
          />
          {errors.website && <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">{errors.website}</p>}
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
            <Users className="w-3 h-3" />
            Strategic Competitors
          </label>
          <input
            type="text"
            name="keyCompetitors"
            value={formData.keyCompetitors || ''}
            onChange={handleChange}
            placeholder="Competitor A, Competitor B..."
            className="input-field"
          />
        </div>
      </div>
    </div>
  );
};

export default Step1ClientDetails;
