import React, { useState, useEffect } from 'react';
import { Plus, Search, CheckCircle2, Circle, Clock, ExternalLink, Trash2 } from 'lucide-react';
import api, { currentUserId } from '../api/config';
import { toast } from 'react-toastify';

const Questions = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDifficulty, setFilterDifficulty] = useState('All');
    
    // Form state
    const [showForm, setShowForm] = useState(false);
    const [newQuestion, setNewQuestion] = useState({ title: '', topic: '', difficulty: 'Medium', source: '' });

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            const res = await api.get('/questions');
            setQuestions(res.data);
        } catch (error) {
            console.error(error);
            // Ignore toast error for now if db is not connected
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/questions', { ...newQuestion, user_id: currentUserId });
            toast.success("Question added successfully!");
            setQuestions([{ id: res.data.id, ...newQuestion, status: 'Unsolved', created_at: new Date() }, ...questions]);
            setShowForm(false);
            setNewQuestion({ title: '', topic: '', difficulty: 'Medium', source: '' });
        } catch (error) {
            toast.error("Failed to add question.");
        }
    };

    const toggleStatus = async (q) => {
        const newStatus = q.status === 'Solved' ? 'Unsolved' : 'Solved';
        try {
            await api.put(`/questions/${q.id}`, { status: newStatus });
            setQuestions(questions.map(item => item.id === q.id ? { ...item, status: newStatus } : item));
            toast.success(`Marked as ${newStatus}`);
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const handleDelete = async (id) => {
        if(!window.confirm("Delete this question?")) return;
        try {
            await api.delete(`/questions/${id}`);
            setQuestions(questions.filter(item => item.id !== id));
            toast.success("Question deleted");
        } catch (error) {
            toast.error("Delete failed");
        }
    };

    const diffColors = {
        Easy: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
        Medium: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
        Hard: 'text-red-400 bg-red-400/10 border-red-400/20'
    };

    const filtered = questions.filter(q => {
        const matchesSearch = q.title.toLowerCase().includes(searchTerm.toLowerCase()) || q.topic.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDiff = filterDifficulty === 'All' || q.difficulty === filterDifficulty;
        return matchesSearch && matchesDiff;
    });

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Practice Questions</h1>
                    <p className="text-slate-400">Track your coding problems by topic and difficulty.</p>
                </div>
                <button 
                    onClick={() => setShowForm(!showForm)}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-lg shadow-blue-500/20"
                >
                    <Plus size={20} /> Add Question
                </button>
            </div>

            {/* Add Form */}
            {showForm && (
                <form onSubmit={handleCreate} className="bg-[#1e293b] border border-[#334155] p-6 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Title</label>
                        <input required value={newQuestion.title} onChange={e => setNewQuestion({...newQuestion, title: e.target.value})} className="w-full bg-[#0f172a] border border-[#334155] rounded-lg p-2.5 text-white focus:border-blue-500 focus:outline-none" placeholder="e.g. Two Sum" />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Topic</label>
                        <input required value={newQuestion.topic} onChange={e => setNewQuestion({...newQuestion, topic: e.target.value})} className="w-full bg-[#0f172a] border border-[#334155] rounded-lg p-2.5 text-white focus:border-blue-500 focus:outline-none" placeholder="e.g. Arrays" />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Difficulty</label>
                        <select value={newQuestion.difficulty} onChange={e => setNewQuestion({...newQuestion, difficulty: e.target.value})} className="w-full bg-[#0f172a] border border-[#334155] rounded-lg p-3 text-white focus:border-blue-500 focus:outline-none">
                            <option>Easy</option>
                            <option>Medium</option>
                            <option>Hard</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Source / Platform</label>
                        <input value={newQuestion.source} onChange={e => setNewQuestion({...newQuestion, source: e.target.value})} className="w-full bg-[#0f172a] border border-[#334155] rounded-lg p-2.5 text-white focus:border-blue-500 focus:outline-none" placeholder="e.g. LeetCode" />
                    </div>
                    <div className="md:col-span-2 flex justify-end gap-3 mt-2">
                        <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg text-slate-400 hover:text-white transition-colors">Cancel</button>
                        <button type="submit" className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-lg text-white transition-colors">Save Question</button>
                    </div>
                </form>
            )}

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                        className="w-full bg-[#1e293b] border border-[#334155] rounded-lg py-2.5 pl-10 pr-4 text-white focus:border-blue-500 focus:outline-none"
                        placeholder="Search questions or topics..." 
                        value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <select value={filterDifficulty} onChange={e => setFilterDifficulty(e.target.value)} className="bg-[#1e293b] border border-[#334155] rounded-lg py-2.5 px-4 text-white focus:border-blue-500 focus:outline-none">
                    <option value="All">All Difficulties</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                </select>
            </div>

            {/* List */}
            <div className="bg-[#1e293b]/50 border border-[#334155] rounded-xl overflow-hidden backdrop-blur-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[#334155] text-slate-400 text-sm bg-[#0f172a]/50">
                                <th className="p-4 font-medium">Status & Title</th>
                                <th className="p-4 font-medium">Topic</th>
                                <th className="p-4 font-medium">Difficulty</th>
                                <th className="p-4 font-medium">Source</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#334155]">
                            {filtered.map(q => (
                                <tr key={q.id} className="hover:bg-[#334155]/20 group transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => toggleStatus(q)} className="focus:outline-none">
                                                {q.status === 'Solved' ? 
                                                    <CheckCircle2 className="text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" size={24} /> : 
                                                    <Circle className="text-slate-500 hover:text-emerald-400 transition-colors" size={24} />
                                                }
                                            </button>
                                            <span className={`font-medium ${q.status === 'Solved' ? 'text-slate-400 line-through' : 'text-slate-200'}`}>{q.title}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-slate-300">
                                        <span className="bg-[#0f172a] px-3 py-1 rounded-full text-sm border border-[#334155]">{q.topic}</span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-md text-xs font-semibold border ${diffColors[q.difficulty]}`}>
                                            {q.difficulty}
                                        </span>
                                    </td>
                                    <td className="p-4 text-slate-400 flex items-center gap-2">
                                        {q.source}
                                    </td>
                                    <td className="p-4 text-right">
                                        <button onClick={() => handleDelete(q.id)} className="text-slate-500 hover:text-red-400 p-2 rounded-lg hover:bg-red-400/10 transition-colors opacity-0 group-hover:opacity-100">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-slate-500">
                                        No questions found. Enjoy the silence, or add some!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Questions;
