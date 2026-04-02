import React from 'react';
import { CheckCircle2, Building, Target, Palette } from 'lucide-react';

const Step4ReviewSubmit = ({ formData }) => {
  const sections = [
    {
      title: 'Client Details',
      icon: <Building className="w-5 h-5 text-indigo-500" />,
      fields: [
        { label: 'Client Name', value: formData.clientName },
        { label: 'Industry', value: formData.industry },
        { label: 'Website', value: formData.website },
        { label: 'Competitors', value: formData.keyCompetitors || 'None specified' },
      ],
    },
    {
      title: 'Campaign Goals',
      icon: <Target className="w-5 h-5 text-rose-500" />,
      fields: [
        { label: 'Objective', value: formData.objective },
        { label: 'Target Audience', value: formData.targetAudience },
        { label: 'Budget', value: `$${formData.budget}` },
      ],
    },
    {
      title: 'Creative Preferences',
      icon: <Palette className="w-5 h-5 text-emerald-500" />,
      fields: [
        { label: 'Tone', value: formData.tone },
        { label: 'Imagery Style', value: formData.imageryStyle },
        { label: 'Do\'s', value: formData.dos || 'None' },
        { label: 'Don\'ts', value: formData.donts || 'None' },
      ],
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center">Final Review</h2>
        <p className="text-slate-500 dark:text-slate-400 text-center">Please verify the details before submitting to the AI.</p>
      </div>

      <div className="space-y-8">
        {sections.map((section, idx) => (
          <div key={idx} className="bg-slate-50 dark:bg-slate-900/40 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
              {section.icon}
              <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">
                {section.title}
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
              {section.fields.map((field, fIdx) => (
                <div key={fIdx} className="space-y-1">
                  <p className="text-xs font-medium text-slate-400 dark:text-slate-500">{field.label}</p>
                  <p className="text-sm text-slate-700 dark:text-slate-300 break-words">
                    {field.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center gap-4 py-4">
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm font-medium animate-pulse">
          <CheckCircle2 className="w-4 h-4" />
          Ready for AI Brief Generation
        </div>
      </div>
    </div>
  );
};

export default Step4ReviewSubmit;
