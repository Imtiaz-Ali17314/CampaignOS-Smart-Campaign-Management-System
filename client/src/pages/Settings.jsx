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
  Trash2
} from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import campaignData from '../data/campaigns.json';

const Settings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'profile';

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

  const handleSaveProfile = () => {
    const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const updatedUser = { ...savedUser, ...profileData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    alert('Strategist Intel Synchronized Successfully');
  };

  const handleResetProfile = () => {
    if (window.confirm('Initialize Strategic Reset? This will revert unsaved changes to defaults.')) {
        setProfileData({
            name: 'Lead Strategist',
            email: profileData.email,
            rank: 'Commander',
            specialty: 'Performance Marketing',
            bio: 'Architecting high-conversion campaign systems.'
        });
    }
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
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
             <div className="absolute top-0 right-0 p-8 opacity-5">
                <Cpu size={120} className="text-primary" />
            </div>
            <h2 className="text-xl font-black mb-1">AI Engine Configuration</h2>
            <div className="space-y-6 relative">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Primary Intelligence Model</label>
                    <select className="input-field bg-card font-bold text-sm">
                        <option>gpt-4o-mini (Optimal Speed)</option>
                        <option>gpt-4o (High Precision)</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Creativity Index</label>
                    <input type="range" className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary" />
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
                                onClick={handleResetProfile}
                                className="px-6 py-4 border border-border/60 hover:bg-rose-500/10 hover:border-rose-500/20 text-muted-foreground hover:text-rose-500 rounded-2xl transition-all"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
