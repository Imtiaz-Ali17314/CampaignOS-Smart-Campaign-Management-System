import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'
    const [errorMsg, setErrorMsg] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMsg('');

        try {
            const response = await axios.post(`${API_URL}/auth/login`, credentials);
            const { token, user } = response.data;
            
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            
            setStatus('success');
            setTimeout(() => {
                window.location.href = '/';
            }, 1500);
        } catch (err) {
            setStatus('error');
            if (err.response) {
                setErrorMsg(err.response.data.error || 'Authentication Failed');
            } else if (err.request) {
                setErrorMsg('Infrastructure Offline: Check if API (3000) is running');
            } else {
                setErrorMsg(err.message);
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] overflow-hidden flex items-center justify-center p-6 font-sans relative">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[480px] relative z-10"
            >
                {/* Brand Header */}
                <div className="text-center mb-10">
                    <motion.div 
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="inline-flex p-4 bg-white/5 border border-white/10 rounded-[2rem] shadow-2xl mb-6 backdrop-blur-xl"
                    >
                         <div className="h-14 w-14 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center">
                            <Zap size={32} className="text-white fill-white" />
                         </div>
                    </motion.div>
                    <h1 className="text-4xl font-black tracking-tight text-white mb-3">
                        Campaign<span className="gradient-text">OS</span>
                    </h1>
                    <p className="text-muted-foreground font-medium uppercase tracking-[0.2em] text-[10px]">Strategic Management Interface</p>
                </div>

                {/* Login Card */}
                <div className="glass-card rounded-[2.5rem] p-10 border-white/5 shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50 pointer-events-none" />
                    
                    <form onSubmit={handleLogin} className="relative space-y-8">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-2">Access Token (Email)</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/5 rounded-xl border border-white/10 text-white/40 group-focus-within:text-primary transition-colors">
                                        <Mail size={16} />
                                    </div>
                                    <input 
                                        type="email" 
                                        required
                                        placeholder="commander@campaign-os.com"
                                        value={credentials.email}
                                        onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                                        className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl pl-16 pr-6 text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-white/10"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-2">Security Key (Password)</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/5 rounded-xl border border-white/10 text-white/40 group-focus-within:text-secondary transition-colors">
                                        <Lock size={16} />
                                    </div>
                                    <input 
                                        type="password" 
                                        required
                                        placeholder="••••••••••••"
                                        value={credentials.password}
                                        onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                                        className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl pl-16 pr-6 text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all placeholder:text-white/10"
                                    />
                                </div>
                            </div>
                        </div>

                        <AnimatePresence mode="wait">
                            {status === 'error' && (
                                <motion.div 
                                    initial={{ opacity: 0, x: -10 }} 
                                    animate={{ opacity: 1, x: 0 }} 
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-500"
                                >
                                    <AlertCircle size={18} />
                                    <span className="text-xs font-black uppercase tracking-widest">{errorMsg}</span>
                                </motion.div>
                            )}

                            {status === 'success' && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9 }} 
                                    animate={{ opacity: 1, scale: 1 }} 
                                    className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3 text-emerald-500"
                                >
                                    <CheckCircle2 size={18} />
                                    <span className="text-xs font-black uppercase tracking-widest">Decryption Successful. Welcome back.</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={status === 'loading' || status === 'success'}
                            className="w-full h-16 bg-white text-black font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:shadow-white/10 transition-all flex items-center justify-center gap-3 disabled:opacity-50 group"
                        >
                            {status === 'loading' ? (
                                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                            ) : status === 'success' ? (
                                <CheckCircle2 size={20} />
                            ) : (
                                <>
                                    Initialize Session
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </motion.button>

                        <div className="text-center pt-2">
                             <Link to="/register" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 hover:text-primary transition-colors">
                                New commander? <span className="text-white border-b border-white/20">Sign Up</span>
                             </Link>
                        </div>
                    </form>
                </div>

                {/* Footer Info */}
                <div className="mt-8 flex items-center justify-center gap-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
                    <div className="flex items-center gap-2">
                        <ShieldCheck size={14} className="text-primary" />
                        AES-256 Bit Encryption
                    </div>
                    <div className="w-1 h-1 bg-white/10 rounded-full" />
                    <div className="flex items-center gap-2">
                        <Zap size={14} className="text-secondary" />
                        H-Sync Real-time
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
