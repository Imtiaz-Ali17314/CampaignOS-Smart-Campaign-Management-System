import React from 'react';
import { Target, Users2, CircleDollarSign } from 'lucide-react';

const Step2CampaignObjective = ({ formData, setFormData, errors }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const objectives = [
    { value: 'awareness', label: 'Awareness', description: 'Reach new potential customers' },
    { value: 'consideration', label: 'Consideration', description: 'Engagement and traffic' },
    { value: 'conversion', label: 'Conversion', description: 'Sales and lead generation' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Campaign Goals</h2>
        <p className="text-slate-500 dark:text-slate-400">Define what you want to achieve with this campaign.</p>
      </div>

      <div className="space-y-6">
        {/* Campaign Objective */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Target className="w-4 h-4" />
            Objective *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {objectives.map((obj) => (
              <label
                key={obj.value}
                className={`relative flex flex-col p-4 border rounded-xl cursor-pointer transition-all duration-200 group ${
                  formData.objective === obj.value
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800'
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
                <span className={`block text-sm font-bold mb-1 transition-colors ${
                  formData.objective === obj.value ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-900 dark:text-white'
                }`}>
                  {obj.label}
                </span>
                <span className="block text-xs text-slate-500 dark:text-slate-400">
                  {obj.description}
                </span>
              </label>
            ))}
          </div>
          {errors.objective && <p className="text-xs text-red-500 mt-1">{errors.objective}</p>}
        </div>

        {/* Target Audience */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Users2 className="w-4 h-4" />
            Target Audience *
          </label>
          <textarea
            name="targetAudience"
            value={formData.targetAudience || ''}
            onChange={handleChange}
            placeholder="Describe your ideal customer persona..."
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.targetAudience ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-700 focus:ring-indigo-500'
            } bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all duration-200 h-32 resize-none`}
          />
          {errors.targetAudience && <p className="text-xs text-red-500 mt-1">{errors.targetAudience}</p>}
        </div>

        {/* Budget */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <CircleDollarSign className="w-4 h-4" />
            Allocated Budget (USD) *
          </label>
          <input
            type="number"
            name="budget"
            value={formData.budget || ''}
            onChange={handleChange}
            min="1"
            placeholder="e.g. 5000"
            className={`w-full px-4 py-2 rounded-lg border ${
              errors.budget ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-700 focus:ring-indigo-500'
            } bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all duration-200`}
          />
          {errors.budget && <p className="text-xs text-red-500 mt-1">{errors.budget}</p>}
        </div>
      </div>
    </div>
  );
};

export default Step2CampaignObjective;
