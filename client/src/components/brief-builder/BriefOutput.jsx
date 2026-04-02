import React, { useRef } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Download, Share2, Printer, Sparkles, Layout, MessageSquare, Target, Palette } from 'lucide-react';

const BriefOutput = ({ result, onReset }) => {
  const briefRef = useRef();

  const exportPDF = async () => {
    const canvas = await html2canvas(briefRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff'
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
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-700">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">AI Brief Generated</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Your professional creative direction is ready.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={exportPDF}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
          >
            <Download className="w-4 h-4" />
            Export PDF
          </button>
          <button
            onClick={() => window.print()}
            className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-200"
          >
            <Printer className="w-4 h-4" />
          </button>
          <button
             onClick={onReset}
             className="px-4 py-2 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all duration-200 font-medium"
          >
            Build Another
          </button>
        </div>
      </div>

      <div 
        ref={briefRef}
        id="brief-output"
        className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl relative overflow-hidden print:p-0 print:border-none print:shadow-none"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-500/5 dark:bg-rose-500/10 rounded-full -ml-32 -mb-32 blur-3xl opacity-50" />

        <div className="relative space-y-12">
          {/* Header Section */}
          <div className="space-y-4 text-center border-b border-slate-100 dark:border-slate-800 pb-10">
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {result.campaignTitle}
            </h1>
            <div className="flex items-center justify-center gap-4 text-sm font-medium uppercase tracking-[0.2em] text-indigo-500">
               Creative Strategy Brief
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Headlines Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-indigo-500" />
                <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">Primary Messaging</h3>
              </div>
              <div className="space-y-4">
                {result.headlines.map((headline, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50 relative overflow-hidden group">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 opacity-30" />
                    <p className="text-slate-700 dark:text-slate-300 font-medium italic">"{headline}"</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Direction Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Palette className="w-5 h-5 text-rose-500" />
                <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">Visual Direction</h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed p-6 bg-rose-50/50 dark:bg-rose-500/5 rounded-3xl border border-rose-100 dark:border-rose-900/20">
                {result.visualDirection}
              </p>
            </div>

            {/* Channels & Budget Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Layout className="w-5 h-5 text-emerald-500" />
                <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">Channel Allocation</h3>
              </div>
              <div className="space-y-4">
                {result.channels.map((channel, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                      <span>{channel.name}</span>
                      <span>{channel.budgetPct}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${channel.budgetPct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tone Strategy Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-orange-500" />
                <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">Tone & Voice Strategy</h3>
              </div>
              <div className="p-6 bg-orange-50/50 dark:bg-orange-500/5 rounded-3xl border border-orange-100 dark:border-orange-900/20">
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed italic">
                  {result.toneGuide}
                </p>
              </div>
            </div>
          </div>
          
          <div className="pt-10 border-t border-slate-100 dark:border-slate-800 text-center text-[10px] text-slate-400 dark:text-slate-600 uppercase tracking-widest">
            Generated by CampaignOS AI Content Engine © 2025
          </div>
        </div>
      </div>
    </div>
  );
};

export default BriefOutput;
