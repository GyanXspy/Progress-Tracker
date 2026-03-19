import React, { useState, useEffect } from 'react';
import { Briefcase, Building2, MapPin, ExternalLink, Activity } from 'lucide-react';
import api, { currentUserId } from '../api/config';
import { toast } from 'react-toastify';

const Jobs = () => {
    const [jobs, setJobs] = useState([]);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await api.get('/job-applications', { params: { user_id: currentUserId } });
                setJobs(res.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchJobs();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        const form = e.target;
        
        const newJob = {
            company_name: form.company.value,
            position: form.position.value,
            application_date: form.date.value || new Date().toISOString().split('T')[0],
            job_link: form.link.value,
            status: 'Applied',
            user_id: currentUserId
        };

        try {
            const res = await api.post('/job-applications', newJob);
            setJobs([{ id: res.data.id, ...newJob }, ...jobs]);
            setShowForm(false);
            toast.success("Job application saved");
        } catch (error) {
            toast.error("Failed to save application");
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await api.put(`/job-applications/${id}`, { status });
            setJobs(jobs.map(j => j.id === id ? { ...j, status } : j));
            toast.success(`Moved to ${status}`);
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const statusColors = {
        'Applied': 'bg-blue-500 text-blue-100',
        'Under Review': 'bg-yellow-500 text-yellow-100',
        'Interview Scheduled': 'bg-purple-500 text-purple-100',
        'Technical Round': 'bg-indigo-500 text-indigo-100',
        'HR Round': 'bg-pink-500 text-pink-100',
        'Offer Received': 'bg-emerald-500 text-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.5)]',
        'Rejected': 'bg-red-500 text-red-100',
        'Withdrawn': 'bg-slate-500 text-slate-100'
    };

    const allStatuses = Object.keys(statusColors);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center bg-[#1e293b]/80 border border-[#334155] p-6 rounded-2xl backdrop-blur-md">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Job Tracker</h1>
                    <p className="text-slate-400 mt-1">Keep track of your applications and interview stages.</p>
                </div>
                <button 
                    onClick={() => setShowForm(!showForm)}
                    className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-5 py-2.5 rounded-lg transition-colors shadow-lg shadow-purple-500/20"
                >
                    + New Application
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleCreate} className="bg-[#1e293b] border border-[#334155] p-6 rounded-xl grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm text-slate-400 block mb-1">Company</label>
                        <input name="company" required className="w-full bg-[#0f172a] border border-[#334155] rounded-lg p-2.5 text-white focus:border-purple-500 outline-none" placeholder="e.g. Google" />
                    </div>
                    <div>
                        <label className="text-sm text-slate-400 block mb-1">Position</label>
                        <input name="position" required className="w-full bg-[#0f172a] border border-[#334155] rounded-lg p-2.5 text-white focus:border-purple-500 outline-none" placeholder="e.g. Frontend Engineer" />
                    </div>
                    <div>
                        <label className="text-sm text-slate-400 block mb-1">Date Applied</label>
                        <input type="date" name="date" required defaultValue={new Date().toISOString().split('T')[0]} className="w-full bg-[#0f172a] border border-[#334155] rounded-lg p-2.5 text-white focus:border-purple-500 outline-none [color-scheme:dark]" />
                    </div>
                    <div>
                        <label className="text-sm text-slate-400 block mb-1">Job Link</label>
                        <input name="link" className="w-full bg-[#0f172a] border border-[#334155] rounded-lg p-2.5 text-white focus:border-purple-500 outline-none" placeholder="https://..." />
                    </div>
                    <div className="md:col-span-2 flex justify-end gap-3 mt-2">
                        <button type="button" onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white px-4">Cancel</button>
                        <button type="submit" className="bg-purple-600 hover:bg-purple-500 px-6 py-2 rounded-lg text-white font-bold">Save</button>
                    </div>
                </form>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {jobs.map(job => (
                    <div key={job.id} className="bg-[#1e293b]/60 border border-[#334155] p-6 rounded-2xl group hover:border-[#475569] hover:-translate-y-1 transition-all duration-300">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-[#0f172a] rounded-xl flex items-center justify-center font-bold text-xl text-white border border-[#334155]">
                                {job.company_name.charAt(0)}
                            </div>
                            <select 
                                value={job.status} 
                                onChange={(e) => updateStatus(job.id, e.target.value)}
                                className={`text-xs font-bold px-3 py-1.5 rounded-full appearance-none outline-none cursor-pointer ${statusColors[job.status]}`}
                            >
                                {allStatuses.map(s => <option key={s} value={s} className="bg-[#1e293b] text-white">{s}</option>)}
                            </select>
                        </div>
                        
                        <h3 className="text-xl font-bold text-white leading-tight">{job.position}</h3>
                        <div className="flex items-center gap-2 text-slate-400 mt-2 text-sm">
                            <Building2 size={16} /> {job.company_name}
                        </div>
                        
                        <div className="mt-6 pt-4 border-t border-[#334155] flex justify-between items-center text-sm text-slate-500">
                            <span>{new Date(job.application_date).toLocaleDateString()}</span>
                            {job.job_link && (
                                <a href={job.job_link} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-blue-400 hover:text-blue-300 hover:underline">
                                    Link <ExternalLink size={14} />
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            {jobs.length === 0 && <div className="text-center p-12 text-slate-500 bg-[#1e293b]/30 rounded-2xl border border-[#334155] border-dashed">No job applications tracked yet. Start applying!</div>}
        </div>
    );
};

export default Jobs;
