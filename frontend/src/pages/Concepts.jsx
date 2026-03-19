import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit } from 'lucide-react';
import api, { currentUserId } from '../api/config';
import { toast } from 'react-toastify';

const Concepts = () => {
    const [concepts, setConcepts] = useState([]);
    
    useEffect(() => {
        const fetchConcepts = async () => {
            try {
                const res = await api.get('/concepts', { params: { user_id: currentUserId } });
                setConcepts(res.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchConcepts();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        const form = e.target;
        const newConcept = {
            title: form.title.value,
            priority: form.priority.value,
            resources: form.resources.value,
            user_id: currentUserId
        };
        
        try {
            const res = await api.post('/concepts', newConcept);
            setConcepts([{ id: res.data.id, ...newConcept, status: 'Not Started', created_at: new Date() }, ...concepts]);
            form.reset();
            toast.success("Concept added");
        } catch (error) {
            toast.error("Error adding concept");
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await api.put(`/concepts/${id}`, { status });
            setConcepts(concepts.map(c => c.id === id ? { ...c, status } : c));
        } catch (error) {
            toast.error("Error updating status");
        }
    };

    const handleDelete = async (id) => {
        if(!window.confirm("Delete this concept?")) return;
        try {
            await api.delete(`/concepts/${id}`);
            setConcepts(concepts.filter(c => c.id !== id));
            toast.success("Deleted");
        } catch (error) {
            toast.error("Delete failed");
        }
    };

    const getPriColor = (pri) => {
        if(pri === 'High') return 'text-red-400 bg-red-400/10 border-red-400/20';
        if(pri === 'Medium') return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
        return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
    };

    const StatusBadge = ({ concept }) => {
        const statuses = ['Not Started', 'In Progress', 'Learned'];
        return (
            <select 
                value={concept.status} 
                onChange={(e) => updateStatus(concept.id, e.target.value)}
                className={`text-sm rounded-full px-3 py-1 font-medium border appearance-none cursor-pointer focus:outline-none ${
                    concept.status === 'Learned' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    concept.status === 'In Progress' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                    'bg-slate-500/10 text-slate-400 border-slate-500/20'
                }`}
            >
                {statuses.map(s => <option key={s} value={s} className="bg-[#1e293b] text-white">{s}</option>)}
            </select>
        );
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
                <h1 className="text-3xl font-bold tracking-tight mb-6">Learn Concepts</h1>
                
                <div className="grid gap-4">
                    {concepts.map(c => (
                        <div key={c.id} className="bg-[#1e293b]/50 border border-[#334155] p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:border-[#475569] transition-colors">
                            <div className="flex-1">
                                <h3 className={`text-xl font-bold ${c.status === 'Learned' ? 'text-slate-500 line-through' : 'text-white'}`}>{c.title}</h3>
                                {c.resources && (
                                    <p className="text-sm text-blue-400 mt-1 truncate">
                                        <a href={c.resources.startsWith('http') ? c.resources : `http://${c.resources}`} target="_blank" rel="noreferrer" className="hover:underline hover:text-blue-300">
                                            {c.resources}
                                        </a>
                                    </p>
                                )}
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`text-xs px-2 py-1 rounded-md font-bold border ${getPriColor(c.priority)}`}>{c.priority}</span>
                                <StatusBadge concept={c} />
                                <button onClick={() => handleDelete(c.id)} className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-2">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {concepts.length === 0 && <div className="text-center p-8 text-slate-500">No concepts added yet. Start learning!</div>}
                </div>
            </div>

            {/* Sidebar form */}
            <div>
                <div className="bg-[#1e293b] border border-[#334155] p-6 rounded-xl sticky top-8">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Plus className="text-blue-400"/> Add Concept</h3>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div>
                            <label className="text-sm text-slate-400 block mb-1">Concept Name</label>
                            <input name="title" required className="w-full bg-[#0f172a] border border-[#334155] rounded-lg p-2.5 text-white focus:border-blue-500 outline-none" placeholder="e.g. Dynamic Programming" />
                        </div>
                        <div>
                            <label className="text-sm text-slate-400 block mb-1">Priority</label>
                            <select name="priority" className="w-full bg-[#0f172a] border border-[#334155] rounded-lg p-2.5 text-white focus:border-blue-500 outline-none">
                                <option>High</option>
                                <option selected>Medium</option>
                                <option>Low</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm text-slate-400 block mb-1">Resource Link / Notes</label>
                            <textarea name="resources" rows="3" className="w-full bg-[#0f172a] border border-[#334155] rounded-lg p-2.5 text-white focus:border-blue-500 outline-none" placeholder="Link to tutorial or docs..." />
                        </div>
                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-lg transition-colors shadow-lg shadow-blue-500/20">
                            Save Concept
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Concepts;
