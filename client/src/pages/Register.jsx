import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, Zap, UserPlus } from 'lucide-react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const Register = () => {
    const navigate = useNavigate();
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
            await axios.post(`${API_URL}/auth/register`, {
                email: credentials.email,
                password: credentials.password
            });
            
            setStatus('success');
            setTimeout(() => {
                navigate('/login');
            }, 1500);
        } catch (err) {
            setStatus('error');
            if (err.response) {
                if (err.response.data.errors && Array.isArray(err.response.data.errors)) {
                    const messages = err.response.data.errors.map(e => e.msg).join(', ');
                    setErrorMsg(messages || 'Registration Failed');
                } else {
                    setErrorMsg(err.response.data.error || 'Registration Failed');
                }
            } else if (err.request) {
                setErrorMsg('Infrastructure Offline: Check if API (3000) is running');
            } else {
                setErrorMsg(err.message);
            }
        }
    };

    return (
        <div className="min-h-screen bg-background overflow-hidden flex items-center justify-center p-6 font-sans relative transition-colors duration-500">
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
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
                        className="inline-flex p-4 bg-card border border-border/40 rounded-[2rem] shadow-2xl mb-6 backdrop-blur-xl"
                    >
                         <div className="h-14 w-14 bg-gradient-to-br from-secondary to-primary rounded-2xl flex items-center justify-center">
                            <UserPlus size={32} className="text-white" />
                         </div>
                    </motion.div>
                    <h1 className="text-4xl font-black tracking-tight text-foreground mb-3">
                        Create <span className="gradient-text">Account</span>
                    </h1>
                    <p className="text-muted-foreground font-medium uppercase tracking-[0.2em] text-[10px]">Initialize your strategic position</p>
                </div>

                <div className="glass-card rounded-[2.5rem] p-10 border-border/40 shadow-2xl relative overflow-hidden">
                    <form onSubmit={handleRegister} className="relative space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80 ml-2">Email Identity</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-foreground/5 border border-foreground/10 text-foreground/40 group-focus-within:text-primary transition-colors rounded-xl">
                                        <Mail size={16} />
                                    </div>
                                    <input 
                                        type="email" 
                                        required
                                        placeholder="commander@campaign-os.com"
                                        value={credentials.email}
                                        onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                                        className="w-full h-14 bg-foreground/5 border border-foreground/10 rounded-2xl pl-16 pr-6 text-foreground font-bold text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/40"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80 ml-2">Security Key</label>
                                    <div className="relative group">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 bg-foreground/5 border border-foreground/10 text-foreground/40 group-focus-within:text-secondary transition-colors rounded-lg">
                                            <Lock size={14} />
                                        </div>
                                        <input 
                                            type="password" 
                                            required
                                            minLength={6}
                                            value={credentials.password}
                                            onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                                            className="w-full h-14 bg-foreground/5 border border-foreground/10 rounded-2xl pl-12 pr-4 text-foreground font-bold text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80 ml-2">Verification</label>
                                    <div className="relative group">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 bg-foreground/5 border border-foreground/10 text-foreground/40 group-focus-within:text-secondary transition-colors rounded-lg">
                                            <Lock size={14} />
                                        </div>
                                        <input 
                                            type="password" 
                                            required
                                            value={credentials.confirmPassword}
                                            onChange={(e) => setCredentials(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                            className="w-full h-14 bg-foreground/5 border border-foreground/10 rounded-2xl pl-12 pr-4 text-foreground font-bold text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all"
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

                            {status === 'success' && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9 }} 
                                    animate={{ opacity: 1, scale: 1 }} 
                                    className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3 text-emerald-500"
                                >
                                    <CheckCircle2 size={18} />
                                    <span className="text-xs font-black uppercase tracking-widest">Registration successful! Redirecting...</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={status === 'loading' || status === 'success'}
                            type="submit"
                            className="w-full h-16 bg-foreground text-background font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:shadow-primary/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50 group"
                        >
                            {status === 'loading' ? (
                                <div className="w-5 h-5 border-2 border-background/20 border-t-background rounded-full animate-spin" />
                            ) : status === 'success' ? (
                                <CheckCircle2 size={20} />
                            ) : (
                                <>
                                    Establish Command
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </motion.button>

                        <div className="text-center pt-2">
                             <Link to="/login" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
                                Already identified? <span className="text-foreground border-b border-foreground/20 hover:text-primary hover:border-primary transition-all">Sign In</span>
                             </Link>
                        </div>
                    </form>
                </div>

                <div className="mt-8 flex items-center justify-center gap-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
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
