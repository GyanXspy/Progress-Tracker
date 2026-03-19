import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Mail, Lock, UserCircle, User, ArrowRight, Target, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

const Register = () => {
    const { register } = useAuth();
    const [formData, setFormData] = useState({ username: '', name: '', email: '', password: '' });
    const [status, setStatus] = useState({ loading: false, error: null });
    const [pwdStrength, setPwdStrength] = useState(0);

    const checkPasswordStrength = (pass) => {
        let score = 0;
        if (pass.length > 7) score++;
        if (/[A-Z]/.test(pass)) score++;
        if (/[0-9]/.test(pass)) score++;
        if (/[^A-Za-z0-9]/.test(pass)) score++;
        setPwdStrength(score);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (name === 'password') checkPasswordStrength(value);
    };

    const validateForm = () => {
        if (!formData.username || !formData.name || !formData.email || !formData.password) {
            setStatus({ loading: false, error: 'Please fill in all fields.' });
            return false;
        }
        if (formData.username.length < 3) {
            setStatus({ loading: false, error: 'Username must be at least 3 characters.' });
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setStatus({ loading: false, error: 'Please enter a valid email address.' });
            return false;
        }
        if (formData.password.length < 6) {
            setStatus({ loading: false, error: 'Password must be at least 6 characters.' });
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, error: null });
        if (!validateForm()) return;

        try {
            await register(formData);
        } catch (err) {
            setStatus({ 
                loading: false, 
                error: err.response?.data?.msg || 'Failed to register. Username or email might be taken.' 
            });
        }
    };

    const strengthLabels = ['Too Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-400', 'bg-emerald-500'];

    return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px]"></div>
            </div>

            <div className="w-full max-w-lg bg-[#1e293b]/80 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl z-10 relative">
                <div className="flex flex-col items-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/30">
                        <Target size={32} className="text-white" />
                    </div>
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Join ProgTrack</h2>
                    <p className="text-slate-400 mt-2">Start dominating your placements today</p>
                </div>

                {status.error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-400 text-sm animate-in fade-in slide-in-from-top-2">
                        <AlertCircle size={18} className="shrink-0" />
                        <p>{status.error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-300 ml-1">Full Name</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                    <User size={18} />
                                </div>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full bg-[#0f172a]/50 border border-slate-700/50 text-white rounded-xl pl-11 pr-4 py-3 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-300 ml-1">Username</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                    <UserCircle size={18} />
                                </div>
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="johndoe123"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="w-full bg-[#0f172a]/50 border border-slate-700/50 text-white rounded-xl pl-11 pr-4 py-3 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                <Mail size={18} />
                            </div>
                            <input
                                type="email"
                                name="email"
                                placeholder="john@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full bg-[#0f172a]/50 border border-slate-700/50 text-white rounded-xl pl-11 pr-4 py-3 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full bg-[#0f172a]/50 border border-slate-700/50 text-white rounded-xl pl-11 pr-4 py-3 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                                />
                            </div>
                        </div>
                        
                        {/* Password Strength Indicator */}
                        {formData.password.length > 0 && (
                            <div className="px-1 animate-in fade-in">
                                <div className="flex gap-1 h-1.5 w-full rounded-full overflow-hidden bg-slate-800">
                                    {[1, 2, 3, 4].map((level) => (
                                        <div 
                                            key={level} 
                                            className={`flex-1 transition-colors duration-300 ${pwdStrength >= level ? strengthColors[pwdStrength] : 'bg-transparent'}`}
                                        />
                                    ))}
                                </div>
                                <p className={`text-xs mt-1.5 font-medium ${pwdStrength >= 3 ? 'text-green-400' : 'text-slate-400'}`}>
                                    {strengthLabels[pwdStrength]} password
                                </p>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={status.loading}
                        className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-medium py-3 mt-4 rounded-xl shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {status.loading ? (
                            <Loader2 size={20} className="animate-spin" />
                        ) : (
                            <>
                                Create Account
                                <CheckCircle2 size={18} className="group-hover:scale-110 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-slate-400">
                    <p>Already have an account? <Link to="/signin" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">Sign in here</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;
