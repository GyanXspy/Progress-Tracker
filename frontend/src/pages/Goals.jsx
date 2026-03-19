import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import api, { currentUserId } from '../api/config';
import { toast } from 'react-toastify';

const Goals = () => {
    const defaultGoal = {
        problems_target: 3, problems_completed: 0,
        concepts_target: 1, concepts_completed: 0,
        applications_target: 2, applications_completed: 0,
        status: 'Incomplete'
    };
    
    const [goal, setGoal] = useState(defaultGoal);
    const [loading, setLoading] = useState(true);
    const date = new Date().toISOString().split('T')[0];

    useEffect(() => {
        const fetchGoal = async () => {
            try {
                const res = await api.get('/daily-goals', { params: { user_id: currentUserId, date: date } });
                if (res.data) {
                    setGoal(res.data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchGoal();
    }, [date]);

    const handleUpdate = async (field, value) => {
        const newGoal = { ...goal, [field]: value };
        // Check if all targets met
        const isComplete = newGoal.problems_completed >= newGoal.problems_target &&
                           newGoal.concepts_completed >= newGoal.concepts_target &&
                           newGoal.applications_completed >= newGoal.applications_target;
        newGoal.status = isComplete ? 'Completed' : 'Incomplete';
        
        setGoal(newGoal);

        try {
            await api.post('/daily-goals', { ...newGoal, user_id: currentUserId, date });
            if(isComplete && goal.status !== 'Completed') {
                toast.success("🎉 All daily goals achieved! Great job!");
            }
        } catch (error) {
            toast.error("Failed to save goals");
        }
    };

    const GoalItem = ({ title, target, completed, targetField, completedField, colorMode }) => {
        const progress = target > 0 ? Math.min((completed / target) * 100, 100) : 0;
        
        return (
            <div className="bg-[#1e293b]/50 border border-[#334155] p-6 rounded-2xl flex flex-col gap-4 backdrop-blur-sm transition-all hover:bg-[#1e293b]/80">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold">{title}</h3>
                    <div className="flex items-center gap-2">
                        <input 
                            type="number" className="w-16 bg-[#0f172a] border border-[#334155] rounded p-1 text-center font-bold"
                            value={target} onChange={(e) => handleUpdate(targetField, parseInt(e.target.value) || 0)}
                        />
                        <span className="text-slate-400">Target</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => handleUpdate(completedField, Math.max(0, completed - 1))}
                        className="bg-[#334155] hover:bg-[#475569] text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl transition-colors"
                    >-</button>
                    <span className="text-3xl font-bold font-mono w-16 text-center">{completed}</span>
                    <button 
                        onClick={() => handleUpdate(completedField, completed + 1)}
                        className={`hover:opacity-80 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl transition-colors ${colorMode}`}
                    >+</button>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-[#0f172a] rounded-full h-3 overflow-hidden mt-2">
                    <div className={`${colorMode} h-3 rounded-full transition-all duration-500`} style={{ width: `${progress}%` }}></div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold tracking-tight mb-2">Daily Goals</h1>
                <p className="text-slate-400 text-lg">Set your targets for <span className="text-white font-semibold">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span></p>
                {goal.status === 'Completed' && (
                    <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full font-medium">
                        <CheckCircle2 size={20} /> Targets Achieved
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-6">
                <GoalItem 
                    title="Problems to Solve" 
                    target={goal.problems_target} 
                    completed={goal.problems_completed} 
                    targetField="problems_target" 
                    completedField="problems_completed"
                    colorMode="bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                />
                
                <GoalItem 
                    title="Concepts to Learn" 
                    target={goal.concepts_target} 
                    completed={goal.concepts_completed} 
                    targetField="concepts_target" 
                    completedField="concepts_completed"
                    colorMode="bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                />

                <GoalItem 
                    title="Job Applications" 
                    target={goal.applications_target} 
                    completed={goal.applications_completed} 
                    targetField="applications_target" 
                    completedField="applications_completed"
                    colorMode="bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                />
            </div>
        </div>
    );
};

export default Goals;
