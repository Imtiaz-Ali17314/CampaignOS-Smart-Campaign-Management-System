import React from 'react';
import { CheckCircle2, Building, Target, Palette } from 'lucide-react';

const Step4ReviewSubmit = ({ formData }) => {
  const sections = [
    {
      title: 'Market Orientation',
      icon: <Building className="w-4 h-4 text-primary" />,
      fields: [
        { label: 'Client', value: formData.clientName },
        { label: 'Sector', value: formData.industry },
        { label: 'URL', value: formData.website },
        { label: 'Rivalry', value: formData.keyCompetitors || 'N/A' },
      ],
    },
    {
      title: 'Strategic Intent',
      icon: <Target className="w-4 h-4 text-rose-500" />,
      fields: [
        { label: 'KPI', value: formData.objective },
        { label: 'Segment', value: formData.targetAudience },
        { label: 'Budget', value: `$${formData.budget}` },
      ],
    },
    {
      title: 'Creative DNA',
      icon: <Palette className="w-4 h-4 text-emerald-500" />,
      fields: [
        { label: 'Tone', value: formData.tone },
        { label: 'Visuals', value: formData.imageryStyle },
        { label: 'Do\'s', value: formData.dos || 'N/A' },
        { label: 'Don\'ts', value: formData.donts || 'N/A' },
      ],
    },
  ];

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h2 className="text-2xl font-black tracking-tight text-foreground">Integrity Check</h2>
        <p className="text-sm text-muted-foreground font-medium">Verify the strategic parameters before AI synthesis.</p>
      </div>

      <div className="space-y-6">
        {sections.map((section, idx) => (
          <div key={idx} className="bg-muted/10 p-6 rounded-3xl border border-border/40 space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-background rounded-xl border border-border/40 shadow-sm">
                {section.icon}
              </div>
              <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-foreground">
                {section.title}
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 px-2">
              {section.fields.map((field, fIdx) => (
                <div key={fIdx} className="space-y-1.5 min-w-0">
                  <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50">{field.label}</p>
                  <p className="text-xs text-foreground font-bold tracking-tight break-words uppercase">
                    {field.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center gap-4 py-6 border-t border-dashed border-border/60">
        <div className="status-pill bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
          <CheckCircle2 className="w-3 h-3" />
          System Parameters Validated
        </div>
      </div>
    </div>
  );
};

export default Step4ReviewSubmit;
