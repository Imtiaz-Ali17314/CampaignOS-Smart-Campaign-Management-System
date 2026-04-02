import React from 'react';
import { Palette, MessageSquareText, Image, CheckCircle, XCircle } from 'lucide-react';

const Step3CreativePreferences = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const tones = [
    'Professional', 'Playful', 'Authoritative', 'Minimalist', 'Energetic', 'Empathetic', 'Luxury'
  ];

  const imageryStyles = [
    'Photorealistic', 'Illustrative', 'Abstract', 'Video-focused', 'User-Generated Content (UGC)', 'Infographic'
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Creative & Visual Style</h2>
        <p className="text-slate-500 dark:text-slate-400">Set the look and feel for the campaign's visual assets.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Brand Tone */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <MessageSquareText className="w-4 h-4" />
            Brand Tone
          </label>
          <select
            name="tone"
            value={formData.tone || 'Professional'}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
          >
            {tones.map((tone) => (
              <option key={tone} value={tone}>{tone}</option>
            ))}
          </select>
        </div>

        {/* Imagery Style */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Image className="w-4 h-4" />
            Imagery Style
          </label>
          <select
            name="imageryStyle"
            value={formData.imageryStyle || 'Photorealistic'}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
          >
            {imageryStyles.map((style) => (
              <option key={style} value={style}>{style}</option>
            ))}
          </select>
        </div>

        {/* Brand Color Direction */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Primary Brand Color Direction
          </label>
          <input
            type="color"
            name="colorDirection"
            value={formData.colorDirection || '#4f46e5'}
            onChange={handleChange}
            className="w-full h-10 p-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 cursor-pointer"
          />
        </div>

        {/* Do's */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            Do's (What to include)
          </label>
          <textarea
            name="dos"
            value={formData.dos || ''}
            onChange={handleChange}
            placeholder="e.g. Include client logo, emphasize sustainable features..."
            className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 h-32 resize-none"
          />
        </div>

        {/* Don'ts */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <XCircle className="w-4 h-4 text-rose-500" />
            Don'ts (What to avoid)
          </label>
          <textarea
            name="donts"
            value={formData.donts || ''}
            onChange={handleChange}
            placeholder="e.g. No dark imagery, avoid technical jargon..."
            className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 h-32 resize-none"
          />
        </div>
      </div>
    </div>
  );
};

export default Step3CreativePreferences;
