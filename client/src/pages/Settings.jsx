import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Bell, 
  Shield, 
  Database, 
  Cloud, 
  Cpu,
  Save,
  Trash2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import campaignData from '../data/campaigns.json';
import { useNotification } from '../context/NotificationContext';

const Settings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'profile';
  const { showNotification } = useNotification();

  const sections = [
    { id: 'profile', icon: User, label: 'Profile Details', desc: 'Strategist personal configuration' },
    { id: 'notifications', icon: Bell, label: 'Alert Engine', desc: 'Notification threshold triggers' },
    { id: 'security', icon: Shield, label: 'Security & Keys', desc: 'API access and encryption' },
    { id: 'ai', icon: Cpu, label: 'AI Configuration', desc: 'Large language model parameters' }
  ];

  const [profileData, setProfileData] = useState(() => {
    const saved = localStorage.getItem('user');
    const existing = saved ? JSON.parse(saved) : {};
    return {
      name: existing.name || 'Lead Strategist',
      email: existing.email || '',
      rank: existing.rank || 'Commander',
      specialty: existing.specialty || 'Performance Marketing',
      bio: existing.bio || 'Architecting high-conversion campaign systems.'
    };
  });

  const [aiSettings, setAiSettings] = useState({
    model: 'gpt-4o-mini (Optimized Velocity)',
    streaming: true,
    creativity: 85,
    persona: 'You are the lead marketing strategist at CampaignOS. Your output must be data-driven, punchy, and highly tactical.'
  });

  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleSaveProfile = () => {
    const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const updatedUser = { ...savedUser, ...profileData, aiSettings };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    showNotification('Strategist Intel Synchronized', 'success');
  };

  const handleResetConfirm = () => {
    setProfileData({
        name: 'Lead Strategist',
        email: profileData.email,
        rank: 'Commander',
        specialty: 'Performance Marketing',
        bio: 'Architecting high-conversion campaign systems.'
    });
    setAiSettings({
        model: 'gpt-4o-mini (Optimized Velocity)',
        streaming: true,
        creativity: 85,
        persona: 'You are the lead marketing strategist at CampaignOS. Your output must be data-driven, punchy, and highly tactical.'
    });
    setShowResetConfirm(false);
    showNotification('Strategic Matrix Initialized', 'warning');
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'profile':
        return (
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
            <div>
                <h2 className="text-2xl font-black mb-1 truncate">Strategist Details</h2>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest opacity-60">Personal Identity & Specialization</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80 ml-2">Full Identity</label>
                <input 
                    type="text" 
                    value={profileData.name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full h-14 bg-card border border-border/40 rounded-2xl px-6 font-bold text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none" 
                    placeholder="Enter full name"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80 ml-2">Strategic Rank</label>
                <select 
                    value={profileData.rank}
                    onChange={(e) => setProfileData(prev => ({ ...prev, rank: e.target.value }))}
                    className="w-full h-14 bg-card border border-border/40 rounded-2xl px-6 font-bold text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none appearance-none"
                >
                  <option>Commander</option>
                  <option>Analyst</option>
                  <option>Growth Architect</option>
                  <option>Creative Director</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80 ml-2">Primary Specialty</label>
                <select 
                    value={profileData.specialty}
                    onChange={(e) => setProfileData(prev => ({ ...prev, specialty: e.target.value }))}
                    className="w-full h-14 bg-card border border-border/40 rounded-2xl px-6 font-bold text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none appearance-none"
                >
                  <option>Performance Marketing</option>
                  <option>Creative Strategy</option>
                  <option>Data Analytics</option>
                  <option>Omnichannel Scaling</option>
                </select>
              </div>
               <div className="space-y-3 opacity-50 cursor-not-allowed">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80 ml-2">Authentication Key (Email)</label>
                <input type="email" disabled value={profileData.email} className="w-full h-14 bg-muted/20 border border-border/20 rounded-2xl px-6 font-bold text-sm italic" />
              </div>
            </div>

            <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80 ml-2">Operational Bio / Mission</label>
                <textarea 
                    value={profileData.bio}
                    onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                    className="w-full h-32 bg-card border border-border/40 rounded-3xl p-6 font-bold text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-none leading-relaxed"
                    placeholder="Describe your strategic mission..."
                />
            </div>
          </motion.div>
        );
      case 'ai':
        return (
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
             <div className="absolute top-0 right-0 p-8 opacity-5">
                <Cpu size={120} className="text-primary" />
            </div>
            
            <div>
                <h2 className="text-2xl font-black mb-1">AI Intelligence Core</h2>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest opacity-60">Tuning the Neural Strategic Engine</p>
            </div>

            <div className="space-y-8 relative">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80 ml-2">Standard Intelligence Model</label>
                        <select 
                            value={aiSettings.model}
                            onChange={(e) => setAiSettings(prev => ({ ...prev, model: e.target.value }))}
                            className="input-field bg-card font-bold text-sm h-14 rounded-2xl border-border/40 focus:ring-primary/20 transition-all outline-none appearance-none"
                        >
                            <option>gpt-4o-mini (Optimized Velocity)</option>
                            <option>gpt-4o (Superior Precision)</option>
                            <option>o1-preview (Logical Reasoning)</option>
                        </select>
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80 ml-2">Response Velocity</label>
                        <div className="h-14 bg-card border border-border/40 rounded-2xl px-6 flex items-center justify-between">
                            <span className="text-xs font-black uppercase tracking-widest opacity-40">Streaming Mode</span>
                            <div 
                                onClick={() => setAiSettings(prev => ({ ...prev, streaming: !prev.streaming }))}
                                className={`w-10 h-5 rounded-full relative cursor-pointer transition-all duration-300 ${aiSettings.streaming ? 'bg-primary/20' : 'bg-muted/10'}`}
                            >
                                <motion.div 
                                    animate={{ x: aiSettings.streaming ? 20 : 0 }}
                                    className={`absolute top-1 left-1 w-3 h-3 rounded-full shadow-lg ${aiSettings.streaming ? 'bg-primary shadow-primary/40' : 'bg-muted/40'}`} 
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">Creativity Index (Temperature)</label>
                        <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-lg tracking-widest">{aiSettings.creativity / 100} (Dynamic)</span>
                    </div>
                    <input 
                        type="range" 
                        value={aiSettings.creativity}
                        onChange={(e) => setAiSettings(prev => ({ ...prev, creativity: parseInt(e.target.value) }))}
                        className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary" 
                    />
                    <div className="flex justify-between text-[8px] font-bold text-muted-foreground/40 uppercase tracking-[0.2em] px-1">
                        <span>Literal</span>
                        <span>Hallucinatory</span>
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80 ml-2">System Persona / Instructions</label>
                    <textarea 
                        value={aiSettings.persona}
                        onChange={(e) => setAiSettings(prev => ({ ...prev, persona: e.target.value }))}
                        className="w-full h-32 bg-card border border-border/40 rounded-3xl p-6 font-bold text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-none leading-relaxed"
                        placeholder="Describe the AI's persona..."
                    />
                </div>
            </div>
          </motion.div>
        );
      default:
        return (
          <div className="p-20 text-center flex flex-col items-center justify-center space-y-4">
            <div className="p-6 bg-muted/20 rounded-[2rem]">
                <Shield size={40} className="text-muted-foreground/40" />
            </div>
            <h2 className="font-black uppercase tracking-[0.3em] overflow-hidden text-sm text-muted-foreground/60">Module Locked</h2>
            <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">Enhanced security clearance required</p>
          </div>
        );
    }
  };

  return (
    <div className="flex bg-background min-h-screen text-foreground">
      <Sidebar campaigns={campaignData.campaigns} />
      
      <main className="flex-1 overflow-x-hidden pt-10 px-6 md:px-12 pb-20">
        <header className="max-w-4xl mx-auto mb-12 flex items-center justify-between">
            <div>
                <motion.h1 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-black tracking-tight mb-2 uppercase italic"
                >
                    Config <span className="gradient-text">Matrix</span>
                </motion.h1>
                <p className="text-muted-foreground font-medium text-xs tracking-widest uppercase">Operational Parameters for CampaignOS</p>
            </div>
            <div className="p-4 bg-muted/10 border border-border/40 rounded-2xl">
                 <Shield size={24} className="text-primary" />
            </div>
        </header>

        <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <nav className="space-y-1">
                    {sections.map(s => (
                        <button 
                            key={s.id}
                            onClick={() => setSearchParams({ tab: s.id })}
                            className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all text-[10px] font-black uppercase tracking-widest ${activeTab === s.id ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-105' : 'text-muted-foreground hover:bg-muted/50 border border-transparent'}`}
                        >
                            <s.icon size={16} strokeWidth={3} />
                            {s.label}
                        </button>
                    ))}
                </nav>

                <div className="md:col-span-3">
                    <section className="glass-card rounded-[3rem] p-10 border-primary/20 min-h-[400px] relative overflow-hidden flex flex-col justify-between shadow-2xl">
                        {renderContent()}
                        
                        <div className="pt-10 flex gap-4 mt-auto">
                            <button 
                                onClick={handleSaveProfile}
                                className="flex-1 py-4 bg-foreground text-background font-black uppercase tracking-widest text-[10px] rounded-2xl hover:shadow-xl transition-all"
                            >
                                Apply Sync
                            </button>
                            <button 
                                onClick={() => setShowResetConfirm(true)}
                                className="px-6 py-4 border border-border/60 hover:bg-rose-500/10 hover:border-rose-500/20 text-muted-foreground hover:text-rose-500 rounded-2xl transition-all"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        </div>

        {/* Strategic Reset Modal */}
        <AnimatePresence>
            {showResetConfirm && (
                <div className="fixed inset-0 z-[3000] flex items-center justify-center p-6">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowResetConfirm(false)}
                        className="absolute inset-0 bg-background/80 backdrop-blur-xl"
                    />
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-md bg-card border border-border/40 rounded-[3rem] p-10 shadow-2xl overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <Trash2 size={120} className="text-rose-500" />
                        </div>
                        
                        <div className="relative">
                            <div className="h-16 w-16 bg-rose-500/10 rounded-[1.5rem] flex items-center justify-center mb-8">
                                <AlertCircle size={32} className="text-rose-500" />
                            </div>
                            
                            <h3 className="text-2xl font-black mb-4 tracking-tight">Initialize Strategic <span className="text-rose-500">Wipe?</span></h3>
                            <p className="text-sm text-muted-foreground font-medium leading-relaxed mb-10">
                                This will permanently revert all strategist details and AI configurations to factory defaults. This action cannot be reversed within the current session.
                            </p>
                            
                            <div className="flex flex-col gap-3">
                                <button 
                                    onClick={handleResetConfirm}
                                    className="w-full py-4 bg-rose-500 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl hover:shadow-xl hover:shadow-rose-500/20 transition-all"
                                >
                                    Confirm Strategic Wipe
                                </button>
                                <button 
                                    onClick={() => setShowResetConfirm(false)}
                                    className="w-full py-4 bg-muted/10 text-muted-foreground font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-muted/20 transition-all"
                                >
                                    Abort Operation
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Settings;
