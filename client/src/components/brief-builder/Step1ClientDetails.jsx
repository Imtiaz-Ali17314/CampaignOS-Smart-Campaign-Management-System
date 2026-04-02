import React from 'react';
import { User, Building2, Globe, Users } from 'lucide-react';

const Step1ClientDetails = ({ formData, setFormData, errors }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCompetitorsChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, keyCompetitors: value }));
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Client Information</h2>
        <p className="text-slate-500 dark:text-slate-400">Tell us about the brand we're building this campaign for.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Client Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Client Name *
          </label>
          <input
            type="text"
            name="clientName"
            value={formData.clientName || ''}
            onChange={handleChange}
            placeholder="e.g. Acme Corp"
            className={`w-full px-4 py-2 rounded-lg border ${
              errors.clientName ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-700 focus:ring-indigo-500'
            } bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all duration-200`}
          />
          {errors.clientName && <p className="text-xs text-red-500 mt-1">{errors.clientName}</p>}
        </div>

        {/* Industry */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <User className="w-4 h-4" />
            Industry *
          </label>
          <input
            type="text"
            name="industry"
            value={formData.industry || ''}
            onChange={handleChange}
            placeholder="e.g. SaaS / E-commerce"
            className={`w-full px-4 py-2 rounded-lg border ${
              errors.industry ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-700 focus:ring-indigo-500'
            } bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all duration-200`}
          />
          {errors.industry && <p className="text-xs text-red-500 mt-1">{errors.industry}</p>}
        </div>

        {/* Website */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Website URL *
          </label>
          <input
            type="url"
            name="website"
            value={formData.website || ''}
            onChange={handleChange}
            placeholder="https://example.com"
            className={`w-full px-4 py-2 rounded-lg border ${
              errors.website ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-700 focus:ring-indigo-500'
            } bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all duration-200`}
          />
          {errors.website && <p className="text-xs text-red-500 mt-1">{errors.website}</p>}
        </div>

        {/* Key Competitors */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Key Competitors (Comma separated)
          </label>
          <textarea
            name="keyCompetitors"
            value={formData.keyCompetitors || ''}
            onChange={handleCompetitorsChange}
            placeholder="e.g. Competitor A, Competitor B"
            className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 h-24 resize-none"
          />
        </div>
      </div>
    </div>
  );
};

export default Step1ClientDetails;
