import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Layout = () => {
    return (
        <div className="flex min-h-screen bg-[#0f172a] text-slate-50 font-sans selection:bg-blue-500/30">
            <Sidebar />
            <main className="flex-1 ml-64 p-8 relative">
                {/* Background glow effects */}
                <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none" />
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[100px] pointer-events-none" />
                
                <div className="relative z-10 max-w-7xl mx-auto min-h-full">
                    <Outlet />
                </div>
            </main>
            
            <ToastContainer 
                theme="dark"
                position="bottom-right"
                toastClassName="bg-[#1e293b] text-white border border-[#334155]"
            />
        </div>
    );
};

export default Layout;
