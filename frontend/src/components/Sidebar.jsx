import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Code2,
  Target,
  BookOpen,
  Briefcase,
  Settings,
  LogOut,
  UserCircle
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/questions', label: 'Practice Questions', icon: Code2 },
  { path: '/goals', label: 'Daily Goals', icon: Target },
  { path: '/concepts', label: 'Learn Concepts', icon: BookOpen },
  { path: '/jobs', label: 'Job Applications', icon: Briefcase },
];

const Sidebar = () => {
    const { user, logout } = useAuth();
    
    return (
        <div className="w-64 h-screen bg-[#1e293b] border-r border-[#334155] flex flex-col fixed left-0 top-0">
            {/* Logo area */}
            <div className="p-6 mb-4">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent flex items-center gap-2">
                    <Target size={28} className="text-indigo-500" />
                    ProgTrack
                </h1>
            </div>

            {/* Nav Menu */}
            <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                                    isActive
                                        ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]'
                                        : 'text-slate-400 hover:text-white hover:bg-[#334155]/50'
                                }`
                            }
                        >
                            <Icon size={20} className="group-hover:scale-110 transition-transform duration-200" />
                            <span className="font-medium">{item.label}</span>
                        </NavLink>
                    );
                })}
            </nav>

            {/* Bottom Section */}
            <div className="p-4 border-t border-[#334155] space-y-4">
                {user && (
                    <div className="flex items-center gap-3 px-4 bg-[#0f172a]/50 py-3 rounded-xl border border-white/5">
                        <div className="min-w-[40px] h-[40px] rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <span className="text-white font-bold">{user.name?.charAt(0) || 'U'}</span>
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-white font-medium text-sm truncate">{user.name}</span>
                            <span className="text-slate-400 text-xs truncate">{user.email}</span>
                        </div>
                    </div>
                )}
                
                <button className="flex items-center gap-3 px-4 py-2 w-full rounded-lg text-slate-400 hover:text-white hover:bg-[#334155]/50 transition-colors">
                    <Settings size={20} />
                    <span className="font-medium text-sm">Settings</span>
                </button>
                <button onClick={logout} className="flex items-center gap-3 px-4 py-2 w-full rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors group">
                    <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium text-sm">Sign Out</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
