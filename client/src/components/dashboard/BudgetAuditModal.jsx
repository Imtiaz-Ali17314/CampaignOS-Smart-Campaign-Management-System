import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotification } from '../../context/NotificationContext';
import { 
  X, 
  DollarSign, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowUpRight,
  Zap,
  BarChart2,
  PieChart as PieIcon
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const BudgetAuditModal = ({ stats, campaigns, onClose }) => {
  const { showNotification } = useNotification();
  const [isApplying, setIsApplying] = React.useState(false);
  const modalRef = React.useRef();

  const COLORS = ['#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#3b82f6'];

  const campaignData = campaigns.map(c => ({
    name: c.name,
    value: c.spend,
    budget: c.budget
  })).sort((a, b) => b.value - a.value).slice(0, 5);

  const recommendations = [
    {
      id: 1,
      type: 'warning',
      title: 'Pacing Alert',
      desc: 'Campaign "Summer Launch" is on track to exhaust budget 4 days early. Consider reducing daily bids by 12%.',
      impact: '+$4.2k Saved',
      icon: AlertTriangle
    },
    {
      id: 2,
      type: 'success',
      title: 'Performance Spike',
      desc: 'ROAS for "Flash Sale" is 4.2x above average. Reallocating $5,000 from underperforming "Legacy Awareness".',
      impact: '+18% Conversions',
      icon: TrendingDown
    },
    {
      id: 3,
      type: 'info',
      title: 'Inventory Opportunity',
      desc: 'CPM in the "European Market" has dropped by 22%. Ideal window for aggressive scaling.',
      impact: 'Lower CAC',
      icon: Zap
    }
  ];

  const handleApplyAll = () => {
    setIsApplying(true);
    showNotification("Strategic Protocol Active: Initializing Balancing...", "info");
    
    setTimeout(() => {
      showNotification("Mitigating Pacing Risk: Adjusting 'Summer Launch' bids.", "warning");
    }, 1500);

    setTimeout(() => {
      showNotification("ROI Maximized: Applied all recommendations.", "success");
      setIsApplying(false);
      onClose();
    }, 3500);
  };

    const handleShowBreakdown = async () => {
    showNotification("Compiling Deep Metric Audit Report...", "info");
    
    // Synthetic delay to allow UI to settle
    await new Promise(resolve => setTimeout(resolve, 800));

    // ULTIMATE PROJECT-WIDE STABILIZATION: HYBRID SYNC-PURGE
    const styleTags = Array.from(document.querySelectorAll('style'));
    const linkTags = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
    const originalStyles = styleTags.map(s => s.innerHTML);
    const originalLinks = linkTags.map(l => ({ node: l, parent: l.parentNode, next: l.nextSibling }));

    try {
        // 1. PROJECT-WIDE NEUTRALIZATION
        linkTags.forEach(l => l.remove());
        styleTags.forEach(s => {
          s.innerHTML = s.innerHTML.replace(/okl[chb]\([^)]+\)/g, '#8b5cf6');
        });

        const canvas = await html2canvas(modalRef.current, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#0b0c10',
            width: modalRef.current.offsetWidth,
            height: modalRef.current.scrollHeight,
            onclone: (clonedDoc) => {
              // Now we bake resolved layout for rendering fidelity
              const allElements = clonedDoc.querySelectorAll('*');
              allElements.forEach(el => {
                const s = window.getComputedStyle(el);
                el.style.color = s.color.replace(/okl[chb]\([^)]+\)/g, '#ffffff');
                el.style.backgroundColor = s.backgroundColor.replace(/okl[chb]\([^)]+\)/g, '#0b0c10');
                el.style.borderColor = s.borderColor.replace(/okl[chb]\([^)]+\)/g, '#232530');
                el.style.transition = 'none';
                el.style.animation = 'none';
              });

              const sectors = clonedDoc.querySelectorAll('.recharts-pie-sector');
              sectors.forEach((s, i) => {
                const colors = ['#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#3b82f6'];
                s.setAttribute('fill', colors[i % colors.length]);
              });
            }
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('l', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Audit_Breakdown_${new Date().getTime()}.pdf`);
        
        showNotification("Full Breakdown Report synced & downloaded.", "success");
    } catch (error) {
        console.error("PDF Component Export Collision Error:", error);
        showNotification("Report generation failed.", "error");
    } finally {
        // 2. COMPULSORY PROJECT-WIDE RESTORATION
        styleTags.forEach((s, idx) => { s.innerHTML = originalStyles[idx]; });
        originalLinks.forEach(l => { if (l.parent) l.parent.insertBefore(l.node, l.next); });
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 sm:p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-background/80 backdrop-blur-xl"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-5xl bg-card border border-border/40 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div ref={modalRef} className="flex flex-col h-full overflow-hidden">
            <div className="p-8 border-b border-border/40 flex items-center justify-between sticky top-0 bg-card/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-2xl text-primary border border-primary/20">
                <BarChart2 size={24} strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight">Deep Budget <span className="gradient-text">Audit</span></h2>
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-60">Financial Efficiency Protocol Active</p>
              </div>
          </div>
          <button 
            onClick={onClose}
            className="p-3 bg-muted/10 hover:bg-muted/20 border border-border/40 rounded-2xl transition-all group"
          >
            <X size={20} className="text-muted-foreground group-hover:text-foreground transition-colors" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-8 scrollbar-hide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Visual Metrics */}
            <div className="lg:col-span-7 space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="p-8 bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10 rounded-[2rem] relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-500">
                          <DollarSign size={80} />
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Total Investment</p>
                      <h4 className="text-4xl font-black text-foreground mb-4">${stats.spend.toLocaleString()}</h4>
                      <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase bg-emerald-500/10 px-3 py-1 rounded-full w-fit">
                        <CheckCircle2 size={12} />
                        Within Limits
                      </div>
                  </div>
                  
                  <div className="p-8 bg-muted/5 border border-border/40 rounded-[2rem] relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:rotate-12 transition-transform duration-500">
                          <PieIcon size={80} />
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Utilization Rate</p>
                      <h4 className="text-4xl font-black text-foreground mb-4">{stats.budgetUtilization}%</h4>
                      <div className="w-full bg-muted/20 h-1.5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${stats.budgetUtilization}%` }}
                          className="h-full bg-primary"
                        />
                      </div>
                  </div>
              </div>

              <div className="p-8 bg-card border border-border/40 rounded-[2rem]">
                  <div className="flex items-center justify-between mb-8">
                      <h3 className="font-black text-xs uppercase tracking-widest text-muted-foreground">Top Channel Allocation</h3>
                      <button 
                        onClick={handleShowBreakdown}
                        className="text-[10px] font-black uppercase text-primary hover:underline"
                      >
                        Full Breakdown
                      </button>
                  </div>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={campaignData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={8}
                          dataKey="value"
                          isAnimationActive={false}
                        >
                          {campaignData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                           contentStyle={{ 
                             backgroundColor: 'var(--color-card)', 
                             borderRadius: '1.5rem', 
                             border: '1px solid var(--color-border)',
                             boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                             fontSize: '12px',
                             fontWeight: '800'
                           }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                      {campaignData.map((entry, index) => (
                        <div key={entry.name} className="flex items-center gap-3 p-3 bg-muted/5 rounded-xl border border-border/20">
                           <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                           <span className="text-[10px] font-black uppercase tracking-tight truncate flex-1">{entry.name}</span>
                        </div>
                      ))}
                  </div>
              </div>
            </div>

            {/* Right Column: Recommendations */}
            <div className="lg:col-span-5 space-y-8">
               <div className="p-8 bg-card border border-border/40 rounded-[2rem] h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-8">
                    <Zap size={18} className="text-amber-500 fill-amber-500" />
                    <h3 className="font-black text-xs uppercase tracking-widest text-foreground">Strategic Optimization</h3>
                  </div>
                  
                  <div className="space-y-4 flex-1">
                    {recommendations.map((rec) => (
                      <motion.div 
                        key={rec.id}
                        whileHover={{ x: 5 }}
                        className="p-5 bg-muted/5 border border-border/40 rounded-3xl group cursor-pointer hover:border-primary/20 transition-all"
                      >
                        <div className="flex items-start gap-4">
                           <div className={`p-3 rounded-2xl bg-card border border-border/40 ${rec.type === 'warning' ? 'text-amber-500' : rec.type === 'success' ? 'text-emerald-500' : 'text-primary'}`}>
                              <rec.icon size={20} />
                           </div>
                           <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <h5 className="text-[10px] font-black uppercase tracking-widest text-foreground">{rec.title}</h5>
                                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${rec.type === 'warning' ? 'bg-amber-500/10 text-amber-500' : rec.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-primary/10 text-primary'}`}>
                                   {rec.impact}
                                </span>
                              </div>
                              <p className="text-[11px] text-muted-foreground font-medium leading-relaxed group-hover:text-foreground/80 transition-colors">
                                {rec.desc}
                              </p>
                           </div>
                           <ArrowUpRight size={14} className="text-muted-foreground/40 group-hover:text-primary transition-colors duration-300" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <button 
                    disabled={isApplying}
                    onClick={handleApplyAll}
                    className="mt-8 w-full py-4 bg-primary text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    <div className="flex items-center justify-center gap-3">
                        {isApplying ? (
                            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Zap size={14} className="group-hover:animate-pulse" />
                        )}
                        {isApplying ? "Processing Protocol..." : "Apply All Recommendations"}
                    </div>
                  </button>
               </div>
            </div>
          </div>
        </div>
      </div>
     </motion.div>
    </div>
  );
};

export default BudgetAuditModal;
