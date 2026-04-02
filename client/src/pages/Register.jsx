import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, Zap, UserPlus } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const Register = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '', confirmPassword: '' });
    const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'
    const [errorMsg, setErrorMsg] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        
        if (credentials.password !== credentials.confirmPassword) {
            setStatus('error');
            setErrorMsg('Passwords do not match');
            return;
        }

        setStatus('loading');
        setErrorMsg('');

        try {
            const response = await axios.post(`${API_URL}/auth/register`, {
                email: credentials.email,
                password: credentials.password
            });
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
                setErrorMsg(err.response.data.error || 'Registration Failed');
            } else if (err.request) {
                setErrorMsg('Infrastructure Offline: Check if API (3000) is running');
            } else {
                setErrorMsg(err.message);
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] overflow-hidden flex items-center justify-center p-6 font-sans relative">
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05]" />
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[520px] relative z-10"
            >
                <div className="text-center mb-10">
                    <motion.div 
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="inline-flex p-4 bg-white/5 border border-white/10 rounded-[2rem] shadow-2xl mb-6 backdrop-blur-xl"
                    >
                         <div className="h-14 w-14 bg-gradient-to-br from-secondary to-primary rounded-2xl flex items-center justify-center">
                            <UserPlus size={32} className="text-white" />
                         </div>
                    </motion.div>
                    <h1 className="text-4xl font-black tracking-tight text-white mb-3">
                        Create <span className="gradient-text">Account</span>
                    </h1>
                    <p className="text-muted-foreground font-medium uppercase tracking-[0.2em] text-[10px]">Initialize your strategic position</p>
                </div>

                <div className="glass-card rounded-[2.5rem] p-10 border-white/5 shadow-2xl relative overflow-hidden">
                    <form onSubmit={handleRegister} className="relative space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-2">Email Identity</label>
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
                                        className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-16 pr-6 text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-white/10"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-2">Security Key</label>
                                    <div className="relative group">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 bg-white/5 rounded-lg border border-white/10 text-white/40 group-focus-within:text-secondary transition-colors">
                                            <Lock size={14} />
                                        </div>
                                        <input 
                                            type="password" 
                                            required
                                            minLength={6}
                                            value={credentials.password}
                                            onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                                            className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-2">Verification</label>
                                    <div className="relative group">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 bg-white/5 rounded-lg border border-white/10 text-white/40 group-focus-within:text-secondary transition-colors">
                                            <Lock size={14} />
                                        </div>
                                        <input 
                                            type="password" 
                                            required
                                            value={credentials.confirmPassword}
                                            onChange={(e) => setCredentials(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                            className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <AnimatePresence mode="wait">
                            {status === 'error' && (
                                <motion.div 
                                    initial={{ opacity: 0, x: -10 }} 
                                    animate={{ opacity: 1, x: 0 }} 
                                    className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-500"
                                >
                                    <AlertCircle size={18} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">{errorMsg}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button 
                            disabled={status === 'loading'}
                            type="submit"
                            className="w-full h-16 bg-white text-black font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:shadow-white/10 transition-all flex items-center justify-center gap-3 disabled:opacity-50 group"
                        >
                            {status === 'loading' ? (
                                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                            ) : (
                                <>
                                    Establish Command
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>

                        <div className="text-center pt-2">
                             <Link to="/login" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 hover:text-primary transition-colors">
                                Already identified? <span className="text-white border-b border-white/20">Sign In</span>
                             </Link>
                        </div>
                    </form>
                </div>

                <div className="mt-8 flex items-center justify-center gap-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
                    <div className="flex items-center gap-2">
                        <ShieldCheck size={14} className="text-emerald-500" />
                        Master Protocol Active
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
