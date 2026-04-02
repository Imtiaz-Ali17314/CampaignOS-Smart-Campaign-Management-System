import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
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
  AlertCircle,
  ChevronLeft,
  X
} from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import campaignData from '../data/campaigns.json';
import { useNotification } from '../context/NotificationContext';

const Settings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const activeTab = searchParams.get('tab') || 'profile';
  const { showNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(true);

  // PRIMARY STRATEGIC STATES
  const [profileData, setProfileData] = useState({
    name: 'Lead Strategist',
    email: '',
    rank: 'Commander',
    specialty: 'Performance Marketing',
    bio: 'Architecting high-conversion campaign systems.'
  });

  const [aiSettings, setAiSettings] = useState({
    model: 'gpt-4o-mini (Optimized Velocity)',
    streaming: true,
    creativity: 85,
    persona: 'You are the lead marketing strategist at CampaignOS. Your output must be data-driven, punchy, and highly tactical.'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    neuralAnomaly: true,
    budgetPacing: true,
    strategyDrift: false,
    weeklyDigest: true,
    mobilePush: false
  });

  const [securitySettings, setSecuritySettings] = useState({
    apiKey: 'sk-proj-••••••••••••••••••••••••••••',
    apiStatus: 'Connected',
    vpcTunnel: true,
    twoFactor: false
  });

  // FETCH STRATEGIC INTEL ON MOUNT
  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        
        const response = await fetch(`${apiUrl}/user/profile`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          const { user } = data;
          setProfileData({
            name: user.name,
            email: user.email,
            rank: user.rank,
            specialty: user.specialty,
            bio: user.bio
          });
          if (user.settings) {
            if (user.settings.ai) setAiSettings(user.settings.ai);
            if (user.settings.notifications) setNotificationSettings(user.settings.notifications);
            if (user.settings.security) setSecuritySettings(user.settings.security);
          }
        }
      } catch (err) {
        console.error('Strategic Sync Failed:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleSaveProfile = async () => {
    try {
        const token = localStorage.getItem('token');
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        
        const payload = {
            ...profileData,
            settings: {
                ai: aiSettings,
                notifications: notificationSettings,
                security: securitySettings
            }
        };

        const response = await fetch(`${apiUrl}/user/profile`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error('Sync failed');

        // Update local session storage for title/icon persistence
        const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
        localStorage.setItem('user', JSON.stringify({ ...savedUser, name: profileData.name }));
        
        showNotification('Strategic Matrix Synchronized with Central Vault', 'success');
    } catch (err) {
        showNotification('Sync Operation Failed: Critical Collision', 'error');
    }
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
      case 'notifications':
        return (
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            <div>
                <h2 className="text-2xl font-black mb-1">Alert Engine</h2>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest opacity-60">Predictive Anomaly & Performance Triggers</p>
            </div>
            
            <div className="space-y-4">
                {[
                    { id: 'neuralAnomaly', label: 'Neural Anomaly Detection', desc: 'Alert if AI detects divergence from historical performance norms' },
                    { id: 'budgetPacing', label: 'Budget Pacing Guard', desc: 'Instant notification if spend exceeds daily flight projections' },
                    { id: 'strategyDrift', label: 'Strategic Drift Warning', desc: 'Monitor for campaign creative misalignment with initial brief' },
                    { id: 'weeklyDigest', label: 'Weekly Strategy Digest', desc: 'Comprehensive PDF report of all portfolio activity' }
                ].map(item => (
                    <div key={item.id} className="p-6 bg-card border border-border/40 rounded-[2.5rem] flex items-center justify-between group hover:border-primary/20 transition-all">
                        <div className="max-w-[70%]">
                            <p className="text-sm font-black mb-1">{item.label}</p>
                            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest leading-relaxed opacity-60">{item.desc}</p>
                        </div>
                        <div 
                            onClick={() => setNotificationSettings(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                            className={`w-12 h-6 rounded-full relative cursor-pointer transition-all duration-300 ${notificationSettings[item.id] ? 'bg-primary/20' : 'bg-muted/10'}`}
                        >
                            <motion.div 
                                animate={{ x: notificationSettings[item.id] ? 24 : 0 }}
                                className={`absolute top-1 left-1 w-4 h-4 rounded-full shadow-lg ${notificationSettings[item.id] ? 'bg-primary shadow-primary/40' : 'bg-muted/40'}`} 
                            />
                        </div>
                    </div>
                ))}
            </div>
          </motion.div>
        );
      case 'security':
        return (
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
            <div>
                <h2 className="text-2xl font-black mb-1">Security & Key Matrix</h2>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest opacity-60">Credential Encryption & VPC Access</p>
            </div>

            <div className="space-y-8">
                <div className="space-y-3">
                    <div className="flex items-center justify-between px-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">AI Service API Key</label>
                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 rounded-lg">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span className="text-[8px] font-black uppercase text-emerald-500 tracking-widest">Active</span>
                        </div>
                    </div>
                    <div className="relative group">
                        <input 
                            type="password" 
                            disabled
                            value={securitySettings.apiKey}
                            className="w-full h-14 bg-muted/10 border border-border/40 rounded-2xl px-6 font-mono text-xs text-muted-foreground/60 italic" 
                        />
                        <button className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-muted/20 rounded-lg transition-all text-[8px] font-black uppercase tracking-widest text-primary">
                            Rotate Key
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="p-6 bg-card border border-border/40 rounded-3xl space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
                                <Database size={18} />
                            </div>
                            <p className="text-sm font-black">Secure VPC Tunnel</p>
                        </div>
                        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest leading-relaxed opacity-60">Encrypt all data packets via custom virtual private cloud</p>
                        <button 
                            onClick={() => setSecuritySettings(prev => ({ ...prev, vpcTunnel: !prev.vpcTunnel }))}
                            className={`w-full py-3 rounded-xl border transition-all text-[10px] font-black uppercase tracking-widest ${securitySettings.vpcTunnel ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-muted/5 border-border/40 text-muted-foreground'}`}
                        >
                            {securitySettings.vpcTunnel ? 'Tunnel Enabled' : 'Enable Tunnel'}
                        </button>
                    </div>
                    <div className="p-6 bg-card border border-border/40 rounded-3xl space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
                                <Shield size={18} />
                            </div>
                            <p className="text-sm font-black">Two-Factor Strat</p>
                        </div>
                        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest leading-relaxed opacity-60">Required verification for all campaign archival actions</p>
                        <button 
                            onClick={() => setSecuritySettings(prev => ({ ...prev, twoFactor: !prev.twoFactor }))}
                            className={`w-full py-3 rounded-xl border transition-all text-[10px] font-black uppercase tracking-widest ${securitySettings.twoFactor ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-muted/5 border-border/40 text-muted-foreground'}`}
                        >
                            {securitySettings.twoFactor ? 'Active Security' : 'Initialize 2FA'}
                        </button>
                    </div>
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
            <h2 className="font-black uppercase tracking-[0.3em] overflow-hidden text-sm text-muted-foreground/60">Module Error</h2>
            <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">Contact system architect</p>
          </div>
        );
    }
  };

  return (
    <div className="flex bg-background min-h-screen text-foreground transition-colors duration-500">
      <Sidebar campaigns={campaignData.campaigns} />
      
      <main className="flex-1 overflow-x-hidden pt-10 px-6 md:px-12 pb-20">
        <header className="max-w-4xl mx-auto mb-12 flex items-center justify-between">
            <div className="flex items-center gap-6">
                <motion.button 
                    whileHover={{ x: -5 }}
                    onClick={() => navigate('/')}
                    className="p-3 bg-card border border-border/40 rounded-2xl text-muted-foreground hover:text-primary transition-all shadow-sm"
                >
                    <ChevronLeft size={20} strokeWidth={3} />
                </motion.button>
                <div>
                    <motion.h1 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-black tracking-tight mb-1 uppercase italic"
                    >
                        Config <span className="gradient-text">Matrix</span>
                    </motion.h1>
                    <p className="text-muted-foreground font-medium text-[10px] tracking-widest uppercase">Operational Parameters for CampaignOS</p>
                </div>
            </div>
            <div className="p-4 bg-muted/10 border border-border/40 rounded-2xl hidden sm:block">
                 <Shield size={24} className="text-primary" />
            </div>
        </header>

        <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <nav className="space-y-1">
                    {[
                        { id: 'profile', icon: User, label: 'Profile Details' },
                        { id: 'notifications', icon: Bell, label: 'Alert Engine' },
                        { id: 'security', icon: Shield, label: 'Security & Keys' },
                        { id: 'ai', icon: Cpu, label: 'AI Configuration' }
                    ].map(s => (
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
                        {isLoading ? (
                            <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-50">
                                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="p-4 bg-primary rounded-full shadow-lg">
                                    <Cpu className="text-white" size={32} />
                                </motion.div>
                            </div>
                        ) : renderContent()}
                        
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
