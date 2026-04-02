import React from 'react';
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
  const sections = [
    { id: 'profile', icon: User, label: 'Profile Details', desc: 'Manage your public and private strategist information' },
    { id: 'notifications', icon: Bell, label: 'Alert Engine', desc: 'Configure threshold triggers and notification channels' },
    { id: 'security', icon: Shield, label: 'Security & Keys', desc: 'API Keys, 2FA, and session management' },
    { id: 'data', icon: Database, label: 'Core Database', desc: 'PostgreSQL connection strings and backup policy' },
    { id: 'ai', icon: Cpu, label: 'AI Configuration', desc: 'OpenAI model selection and temperature settings' }
  ];

  return (
    <div className="flex bg-background min-h-screen text-foreground">
      <Sidebar campaigns={campaignData.campaigns} />
      
      <main className="flex-1 overflow-x-hidden pt-10 px-6 md:px-12 pb-20">
        <header className="max-w-4xl mx-auto mb-12">
            <motion.h1 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-black tracking-tight mb-2"
            >
                System <span className="gradient-text">Preferences</span>
            </motion.h1>
            <p className="text-muted-foreground font-medium">Global configuration for your CampaignOS instance.</p>
        </header>

        <div className="max-w-4xl mx-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <nav className="space-y-1">
                    {sections.map(s => (
                        <button 
                            key={s.id}
                            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-sm font-bold ${s.id === 'ai' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/50'}`}
                        >
                            <s.icon size={18} />
                            {s.label}
                        </button>
                    ))}
                </nav>

                <div className="md:col-span-3 space-y-8">
                    <section className="glass-card rounded-[2rem] p-8 border-primary/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <Cpu size={120} className="text-primary" />
                        </div>
                        
                        <div className="relative">
                            <h2 className="text-xl font-black mb-1">AI Engine Configuration</h2>
                            <p className="text-xs text-muted-foreground mb-8">Tweak the parameters of the Brief Builder and Content Generator.</p>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Primary Intelligence Model</label>
                                    <select className="input-field bg-card font-bold text-sm">
                                        <option>gpt-4o-mini (Optimal Speed)</option>
                                        <option>gpt-4o (High Precision)</option>
                                        <option>o1-preview (Analytical)</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">System Temperature (Creativity)</label>
                                    <input type="range" className="w-full accent-primary" />
                                    <div className="flex justify-between text-[10px] font-black opacity-40">
                                        <span>PRECISE</span>
                                        <span>CREATIVE</span>
                                    </div>
                                </div>

                                <div className="pt-4 flex gap-4">
                                    <button className="btn-premium btn-primary text-xs tracking-widest uppercase py-3 flex-1">
                                        <Save size={16} /> Save Changes
                                    </button>
                                    <button className="p-3 bg-rose-500/10 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all">
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="glass-card rounded-[2rem] p-8 opacity-50 cursor-not-allowed">
                         <h2 className="text-xl font-black mb-1 uppercase tracking-tighter opacity-40 italic">Coming Soon: Advanced Analytics</h2>
                         <p className="text-xs text-muted-foreground">Unlock custom reporting and BI tool integrations.</p>
                    </section>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
