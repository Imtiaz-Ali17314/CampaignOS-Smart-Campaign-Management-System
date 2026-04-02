import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Target, DollarSign, Activity, Users, Calendar, Loader2, Sparkles } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

const CampaignManagerModal = ({ isOpen, onClose, campaign = null, onComplete }) => {
  const { showNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    client_id: '',
    budget: '',
    status: 'draft',
    start_date: new Date().toISOString().split('T')[0],
    end_date: ''
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
          name: '',
          client_id: '',
          budget: '',
          status: 'draft',
          start_date: new Date().toISOString().split('T')[0],
          end_date: ''
        });
      }
    }
  }, [isOpen, campaign]);

  const fetchClients = async () => {
    try {
      const token = localStorage.getItem('token');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const url = campaign 
        ? `${apiUrl}/campaigns/${campaign.id}` 
        : `${apiUrl}/campaigns`;
      
      const response = await fetch(url, {
        method: campaign ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        showNotification(
          campaign ? 'Strategic Pivot Synchronized' : 'New Campaign Launched Successfully', 
          'success'
        );
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
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-background/60 backdrop-blur-xl"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-2xl bg-card border border-border/40 rounded-[3rem] shadow-2xl overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-8 opacity-5">
            <Activity size={160} className="text-primary" />
        </div>

        <div className="relative p-10 sm:p-12">
            <header className="flex items-center justify-between mb-10">
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
                <button onClick={onClose} className="p-3 hover:bg-muted rounded-2xl transition-all">
                    <X size={20} className="text-muted-foreground" />
                </button>
            </header>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80 ml-2">Campaign Identity</label>
                        <div className="relative">
                            <input 
                                type="text" 
                                required
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                className="w-full h-14 bg-muted/20 border border-border/40 rounded-2xl px-6 font-bold text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                placeholder="Enter campaign name..."
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80 ml-2">Target Brand Portfolio</label>
                        <select 
                            required
                            value={formData.client_id}
                            onChange={(e) => setFormData(prev => ({ ...prev, client_id: e.target.value }))}
                            className="w-full h-14 bg-muted/20 border border-border/40 rounded-2xl px-6 font-bold text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none"
                        >
                            <option value="">Select Client...</option>
                            {clients.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80 ml-2">Allocated Budget ($)</label>
                        <div className="relative">
                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-primary font-black">$</div>
                            <input 
                                type="number" 
                                required
                                value={formData.budget}
                                onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                                className="w-full h-14 bg-muted/20 border border-border/40 rounded-2xl pl-12 pr-6 font-bold text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80 ml-2">Strategic Status</label>
                        <select 
                            value={formData.status}
                            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                            className="w-full h-14 bg-muted/20 border border-border/40 rounded-2xl px-6 font-bold text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none"
                        >
                            <option value="active">Active Execution</option>
                            <option value="paused">Strategy Paused</option>
                            <option value="completed">Objective Met</option>
                            <option value="draft">Draft Proposal</option>
                        </select>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80 ml-2">Initiation Date</label>
                        <input 
                            type="date" 
                            required
                            value={formData.start_date}
                            onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                            className="w-full h-14 bg-muted/20 border border-border/40 rounded-2xl px-6 font-bold text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80 ml-2">Flight End Date (Optional)</label>
                        <input 
                            type="date" 
                            value={formData.end_date}
                            onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                            className="w-full h-14 bg-muted/20 border border-border/40 rounded-2xl px-6 font-bold text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="pt-6 flex gap-4">
                    <button 
                        type="button" 
                        onClick={onClose}
                        className="flex-1 py-4 border border-border/60 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-muted transition-all"
                    >
                        Abort Operation
                    </button>
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="flex-[2] py-4 bg-primary text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <Loader2 className="animate-spin w-4 h-4" />
                        ) : (
                            <>
                                {campaign ? <Activity size={14} /> : <Sparkles size={14} />}
                                {campaign ? 'Apply Strategic Pivot' : 'Initialize Strategy Launch'}
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
      </motion.div>
    </div>
  );
};

export default CampaignManagerModal;
