import React, { useRef } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Download, Share2, Printer, Sparkles, Layout, MessageSquare, Target, Palette } from 'lucide-react';
import { motion } from 'framer-motion';

const BriefOutput = ({ result, onReset }) => {
  const briefRef = useRef();

  const exportPDF = async () => {
    const canvas = await html2canvas(briefRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      onclone: (clonedDoc) => {
        const allElements = clonedDoc.querySelectorAll('*');
        allElements.forEach(el => {
            const style = window.getComputedStyle(el);
            // Replace modern oklch/oklab with safe HEX fallbacks
            if (style.color.includes('okl')) el.style.color = '#000000';
            if (style.backgroundColor.includes('okl')) el.style.backgroundColor = '#ffffff';
            if (style.borderColor.includes('okl')) el.style.borderColor = '#dddddd';
            if (style.backgroundImage.includes('okl')) {
                el.style.backgroundImage = 'linear-gradient(to right, #8b5cf6, #ec4899)';
            }
            if (style.boxShadow.includes('okl')) el.style.boxShadow = 'none';
            // Disable filters and transitions in the clone
            el.style.transition = 'none';
            el.style.animation = 'none';
            if (style.backdropFilter !== 'none') el.style.backdropFilter = 'none';
        });
      }
    });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${result.campaignTitle.replace(/\s+/g, '_').toLowerCase()}_brief.pdf`);
  };

  if (!result) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-fadeIn">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 glass-card p-6 rounded-[2.5rem] border-primary/10">
        <div className="flex items-center gap-4 px-2">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
            <Sparkles className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight text-foreground uppercase tracking-widest text-xs">Synthesis Complete</h2>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">Strategy engine v4.0.2 generated</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={exportPDF}
            className="btn-premium btn-primary py-2.5 px-6 text-[10px] uppercase tracking-widest group"
          >
            <Download className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
            Archive PDF
          </button>
          <button
            onClick={() => window.print()}
            className="p-3 text-muted-foreground hover:text-foreground transition-all hover:bg-muted/50 rounded-2xl border border-border/40 shadow-sm"
          >
            <Printer size={16} strokeWidth={2.5} />
          </button>
          <button
             onClick={onReset}
             className="px-6 py-2.5 bg-card border border-border/60 text-foreground hover:text-primary transition-all rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-sm"
          >
            New Flight
          </button>
        </div>
      </div>

      <div 
        ref={briefRef}
        id="brief-output"
        className="bg-card p-12 md:p-20 rounded-[3rem] border border-border/40 shadow-2xl relative overflow-hidden print:p-0 print:border-none print:shadow-none"
      >
        {/* Aesthetic Accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -mr-48 -mt-48 blur-[100px] opacity-40 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-500/5 rounded-full -ml-48 -mb-48 blur-[100px] opacity-40 pointer-events-none" />

        <div className="relative space-y-20">
          {/* Header Section */}
          <div className="space-y-6 text-center border-b border-border/20 pb-12">
            <div className="status-pill bg-primary/10 text-primary border-primary/20 mx-auto">
                Confidential Strategic Asset
            </div>
            <h1 className="text-5xl font-black text-foreground tracking-tight leading-none uppercase italic">
              {result.campaignTitle}
            </h1>
            <div className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40">
               Flight Intelligence & Narrative Framework
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* Headlines Section */}
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-xl border border-primary/20">
                    <MessageSquare className="w-4 h-4 text-primary" strokeWidth={2.5} />
                </div>
                <h3 className="font-black text-foreground uppercase tracking-[0.2em] text-[10px]">Primary Rhetoric</h3>
              </div>
              <div className="space-y-6">
                {result.headlines.map((headline, idx) => (
                  <div key={idx} className="p-6 bg-muted/5 rounded-3xl border border-border/30 relative overflow-hidden group hover:border-primary/40 transition-colors">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />
                    <p className="text-foreground/80 font-black italic text-sm tracking-tight leading-relaxed">"{headline}"</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Direction Section */}
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-rose-500/10 rounded-xl border border-rose-500/20">
                    <Palette className="w-4 h-4 text-rose-500" strokeWidth={2.5} />
                </div>
                <h3 className="font-black text-foreground uppercase tracking-[0.2em] text-[10px]">Visual Grammar</h3>
              </div>
              <div className="p-8 bg-rose-500/[0.02] rounded-[2.5rem] border border-rose-500/10 backdrop-blur-3xl">
                <p className="text-foreground/70 text-xs leading-loose font-bold tracking-widest uppercase">
                  {result.visualDirection}
                </p>
              </div>
            </div>

            {/* Channels & Budget Section */}
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                    <Layout className="w-4 h-4 text-emerald-500" strokeWidth={2.5} />
                </div>
                <h3 className="font-black text-foreground uppercase tracking-[0.2em] text-[10px]">Strategic Placement</h3>
              </div>
              <div className="space-y-8">
                {result.channels.map((channel, idx) => (
                  <div key={idx} className="space-y-3">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{channel.name}</span>
                      <span className="text-sm font-black text-emerald-500 tracking-tighter">{channel.budgetPct}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted/20 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${channel.budgetPct}%` }}
                        transition={{ duration: 1, delay: 0.5 + idx * 0.1 }}
                        className="h-full bg-emerald-500/60 rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tone Strategy Section */}
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-orange-500/10 rounded-xl border border-orange-500/20">
                    <Target className="w-4 h-4 text-orange-500" strokeWidth={2.5} />
                </div>
                <h3 className="font-black text-foreground uppercase tracking-[0.2em] text-[10px]">Vocal Signature</h3>
              </div>
              <div className="p-8 bg-orange-500/[0.02] rounded-[2.5rem] border border-orange-500/10 backdrop-blur-3xl italic">
                <p className="text-foreground/70 text-xs leading-loose font-bold tracking-widest uppercase">
                  {result.toneGuide}
                </p>
              </div>
            </div>
          </div>
          
          <div className="pt-16 border-t border-border/20 text-center">
            <div className="inline-block px-10 py-4 bg-muted/5 border border-border/40 rounded-2xl text-[9px] font-black tracking-[0.5em] text-muted-foreground/30 uppercase italic">
                Generated via CampaignOS Neural Engine Model 4.0 // 2025 Standard
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BriefOutput;
