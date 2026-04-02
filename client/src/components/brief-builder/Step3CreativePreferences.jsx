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
    'Photorealistic', 'Illustrative', 'Abstract', 'Video-focused', 'UGC-Style', 'Infographic'
  ];

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h2 className="text-2xl font-black tracking-tight text-foreground">Creative DNA</h2>
        <p className="text-sm text-muted-foreground font-medium">Fine-tune the aesthetic vibrations and narrative tone.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
            <MessageSquareText className="w-3 h-3" />
            Narrative Tone
          </label>
          <select
            name="tone"
            value={formData.tone || 'Professional'}
            onChange={handleChange}
            className="input-field font-bold text-xs"
          >
            {tones.map((tone) => (
              <option key={tone} value={tone}>{tone}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
            <Image className="w-3 h-3" />
            Visual Aesthetic
          </label>
          <select
            name="imageryStyle"
            value={formData.imageryStyle || 'Photorealistic'}
            onChange={handleChange}
            className="input-field font-bold text-xs"
          >
            {imageryStyles.map((style) => (
              <option key={style} value={style}>{style}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
            <Palette className="w-3 h-3" />
            Primary Hue Spectrum
          </label>
          <div className="flex items-center gap-4">
              <input
                type="color"
                name="colorDirection"
                value={formData.colorDirection || '#8b5cf6'}
                onChange={handleChange}
                className="w-16 h-10 rounded-xl bg-card border border-border/40 cursor-pointer overflow-hidden"
              />
              <span className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">{formData.colorDirection}</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
            <CheckCircle size={12} className="text-emerald-500" />
            Strategic Do's
          </label>
          <textarea
            name="dos"
            value={formData.dos || ''}
            onChange={handleChange}
            placeholder="MANDATORY ELEMENTS..."
            className="input-field h-32 resize-none text-[10px] tracking-widest font-black uppercase"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
            <XCircle size={12} className="text-rose-500" />
            Strategic Don'ts
          </label>
          <textarea
            name="donts"
            value={formData.donts || ''}
            onChange={handleChange}
            placeholder="RESTRICTED ELEMENTS..."
            className="input-field h-32 resize-none text-[10px] tracking-widest font-black uppercase"
          />
        </div>
      </div>
    </div>
  );
};

export default Step3CreativePreferences;
