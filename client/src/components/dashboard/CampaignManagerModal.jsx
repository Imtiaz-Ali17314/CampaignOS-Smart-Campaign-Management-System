import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Target, DollarSign, Activity, Users, Calendar, Loader2, Sparkles, MessageSquare, Share2, Hash, Wand2 } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';

const AI_URL = import.meta.env.VITE_AI_SERVICE_URL || 'http://localhost:3001';

const CampaignManagerModal = ({ isOpen, onClose, campaign = null, onComplete }) => {
  const { showNotification } = useNotification();
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [clients, setClients] = useState([]);
  const [activeTab, setActiveTab] = useState('settings'); // 'settings', 'creative'
  
  const [formData, setFormData] = useState({
    name: '',
    client_id: '',
    budget: '',
    status: 'draft',
    start_date: new Date().toISOString().split('T')[0],
    end_date: ''
  });

  // AI STATES
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState({
    headlines: [],
    socialPosts: [],
    hashtags: []
  });

  useEffect(() => {
    if (isOpen) {
      fetchClients();
      if (campaign) {
        setFormData({
          name: campaign.name || '',
          client_id: campaign.client_id || '',
          budget: campaign.budget || '',
          status: campaign.status || 'draft',
          start_date: campaign.start_date ? campaign.start_date.split('T')[0] : '',
          end_date: campaign.end_date ? campaign.end_date.split('T')[0] : ''
        });
      } else {
        setFormData({
            name: '', client_id: '', budget: '', status: 'draft',
            start_date: new Date().toISOString().split('T')[0], end_date: ''
        });
      }
    }
  }, [isOpen, campaign]);

  const fetchClients = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/clients`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setClients(data.clients);
      }
    } catch (err) {
      console.error('Portfolio Sync Failed:', err);
    }
  };

  const handleSuggestCopy = async () => {
    if (!formData.name) return showNotification("Please enter a campaign name first.", "info");
    setAiLoading(true);
    try {
        const res = await fetch(`${AI_URL}/generate/copy`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ product: formData.name, tone: 'professional', platform: 'multi-channel' })
        });
        
        // Handle SSE
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let fullContent = '';
        
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value);
            const lines = chunk.split('\n\n');
            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const dataStr = line.substring(6);
                    if (dataStr === '[DONE]') break;
                    try {
                        const data = JSON.parse(dataStr);
                        // If it's the full JSON string from fallback or first chunk
                        if (data.content.startsWith('{')) {
                            const parsed = JSON.parse(data.content);
                            setAiSuggestions(prev => ({ ...prev, headlines: [parsed.headline, parsed.body] }));
                        } else {
                            fullContent += data.content;
                        }
                    } catch (e) {}
                }
            }
        }
        showNotification("Creative Copy Engine Synchronized", "success");
    } catch (err) {
        showNotification("Creative Suggestion Engine offline.", "error");
    } finally {
        setAiLoading(false);
    }
  };

  const handleSuggestSocial = async () => {
    setAiLoading(true);
    try {
        const res = await fetch(`${AI_URL}/generate/social`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ platform: 'Meta/LinkedIn', campaign_goal: formData.name || 'Growth', brand_voice: 'Professional' })
        });
        if (res.ok) {
            const data = await res.json();
            setAiSuggestions(prev => ({ ...prev, socialPosts: data.captions }));
            showNotification("Social Narrative Framework Constructed", "success");
        }
    } catch (err) {
        showNotification("Social Engine collision.", "error");
    } finally {
        setAiLoading(false);
    }
  };

  const handleSuggestTags = async () => {
    setAiLoading(true);
    try {
        const res = await fetch(`${AI_URL}/generate/hashtags`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: formData.name || 'Marketing Strategy', industry: 'General Business' })
        });
        if (res.ok) {
            const data = await res.json();
            setAiSuggestions(prev => ({ ...prev, hashtags: data.hashtags }));
            showNotification("Strategic Hashtags Indexed", "success");
        }
    } catch (err) {
        showNotification("Tag Indexer offline.", "error");
    } finally {
        setAiLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const url = campaign ? `${apiUrl}/campaigns/${campaign.id}` : `${apiUrl}/campaigns`;
      
      const response = await fetch(url, {
        method: campaign ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        showNotification(campaign ? 'Strategic Pivot Synchronized' : 'New Campaign Launched Successfully', 'success');
        onComplete();
        onClose();
      } else {
        throw new Error('Transaction failed');
      }
    } catch (err) {
      showNotification('Strategic Transaction Collision: Operation Aborted', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4 sm:p-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-background/60 backdrop-blur-xl" />
      
      <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-4xl bg-card border border-border/40 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <header className="relative p-10 sm:p-12 pb-6 border-b border-border/20">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center">
                        <Target className="text-primary" size={28} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black tracking-tight uppercase italic">
                            {campaign ? 'Strategic' : 'Launch'} <span className="gradient-text">{campaign ? 'Pivot' : 'Campaign'}</span>
                        </h2>
                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-60">Operations Command Center</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <nav className="hidden sm:flex bg-muted/20 p-1 rounded-2xl border border-border/40">
                        <button onClick={() => setActiveTab('settings')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'settings' ? 'bg-primary text-white shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}>System Config</button>
                        <button onClick={() => setActiveTab('creative')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'creative' ? 'bg-secondary text-white shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}>
                            <Sparkles size={14} />
                            Creative Lab
                        </button>
                    </nav>
                    <button onClick={onClose} className="p-3 hover:bg-muted rounded-2xl transition-all">
                        <X size={20} className="text-muted-foreground" />
                    </button>
                </div>
            </div>
        </header>

        <div className="flex-grow overflow-y-auto p-10 sm:p-12 scrollbar-hide">
            {activeTab === 'settings' ? (
                <form id="campaign-form" onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80 ml-2">Campaign Identity</label>
                            <input type="text" required value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} className="w-full h-14 bg-muted/20 border border-border/40 rounded-2xl px-6 font-bold text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="Enter campaign name..." />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80 ml-2">Target Brand Portfolio</label>
                            <select required value={formData.client_id} onChange={(e) => setFormData(prev => ({ ...prev, client_id: e.target.value }))} className="w-full h-14 bg-muted/20 border border-border/40 rounded-2xl px-6 font-bold text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none">
                                <option value="">Select Client...</option>
                                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80 ml-2">Allocated Budget ($)</label>
                            <div className="relative">
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-primary font-black">$</div>
                                <input type="number" required value={formData.budget} onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))} className="w-full h-14 bg-muted/20 border border-border/40 rounded-2xl pl-12 pr-6 font-bold text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80 ml-2">Strategic Status</label>
                            <select value={formData.status} onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))} className="w-full h-14 bg-muted/20 border border-border/40 rounded-2xl px-6 font-bold text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none">
                                <option value="active">Active Execution</option>
                                <option value="paused">Strategy Paused</option>
                                <option value="completed">Objective Met</option>
                                <option value="draft">Draft Proposal</option>
                            </select>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80 ml-2">Initiation Date</label>
                            <input type="date" required value={formData.start_date} onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))} className="w-full h-14 bg-muted/20 border border-border/40 rounded-2xl px-6 font-bold text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80 ml-2">Flight End Date (Optional)</label>
                            <input type="date" value={formData.end_date} onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))} className="w-full h-14 bg-muted/20 border border-border/40 rounded-2xl px-6 font-bold text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                        </div>
                    </div>
                </form>
            ) : (
                <div className="space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <motion.button whileHover={{ scale: 1.02 }} onClick={handleSuggestCopy} className="p-6 bg-primary/5 border border-primary/20 rounded-3xl text-center group">
                            <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary group-hover:text-white transition-all text-primary">
                                <MessageSquare size={20} />
                            </div>
                            <h3 className="text-xs font-black uppercase tracking-widest mb-1">Headline Lab</h3>
                            <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">Multi-Channel Copy</p>
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.02 }} onClick={handleSuggestSocial} className="p-6 bg-secondary/5 border border-secondary/20 rounded-3xl text-center group">
                            <div className="h-12 w-12 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-secondary group-hover:text-white transition-all text-secondary">
                                <Share2 size={20} />
                            </div>
                            <h3 className="text-xs font-black uppercase tracking-widest mb-1">Social Intel</h3>
                            <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">Narrative Frameworks</p>
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.02 }} onClick={handleSuggestTags} className="p-6 bg-amber-500/5 border border-amber-500/20 rounded-3xl text-center group">
                            <div className="h-12 w-12 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-500 group-hover:text-white transition-all text-amber-500">
                                <Hash size={20} />
                            </div>
                            <h3 className="text-xs font-black uppercase tracking-widest mb-1">Tag Cloud</h3>
                            <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">Strategic Indexing</p>
                        </motion.button>
                    </div>

                    <div className="space-y-8">
                        {aiLoading && <div className="flex items-center justify-center py-12"><Loader2 className="animate-spin text-primary" size={40} /></div>}
                        
                        {!aiLoading && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {aiSuggestions.headlines.length > 0 && (
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Creative Headlines</h4>
                                        <div className="space-y-3">
                                            {aiSuggestions.headlines.map((h, i) => (
                                                <div key={i} className="p-4 bg-muted/20 border border-border/40 rounded-2xl text-xs font-bold leading-relaxed">{h}</div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {aiSuggestions.socialPosts.length > 0 && (
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary">Social Narratives</h4>
                                        <div className="space-y-3">
                                            {aiSuggestions.socialPosts.map((p, i) => (
                                                <div key={i} className="p-4 bg-muted/20 border border-border/40 rounded-2xl text-xs font-bold leading-relaxed">{p}</div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {aiSuggestions.hashtags.length > 0 && (
                                    <div className="col-span-full space-y-4">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500">Strategic Tags</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {aiSuggestions.hashtags.map((t, i) => (
                                                <span key={i} className="px-3 py-1.5 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full text-[9px] font-black uppercase tracking-widest">{t}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {!aiLoading && aiSuggestions.headlines.length === 0 && !campaign && (
                             <div className="text-center py-12 opacity-30">
                                <Wand2 size={40} className="mx-auto mb-4" />
                                <p className="text-[10px] font-black uppercase tracking-widest">Select an engine to generate strategic assets</p>
                             </div>
                        )}
                    </div>
                </div>
            )}
        </div>

        <footer className="p-10 sm:p-12 bg-muted/5 border-t border-border/20 flex gap-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 border border-border/60 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-muted transition-all">Abort Operation</button>
            <button form="campaign-form" type="submit" disabled={isLoading} className="flex-[2] py-4 bg-foreground text-background font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl shadow-xl hover:shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                {isLoading ? <Loader2 className="animate-spin w-4 h-4" /> : (
                    <>
                        {campaign ? <Activity size={14} /> : <Sparkles size={14} />}
                        {campaign ? 'Apply Strategic Pivot' : 'Initialize Strategy Launch'}
                    </>
                )}
            </button>
        </footer>
      </motion.div>
    </div>
  );
};

export default CampaignManagerModal;
