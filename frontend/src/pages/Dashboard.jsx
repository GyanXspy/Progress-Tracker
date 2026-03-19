import React, { useState, useEffect } from 'react';
import { Target, Code2, Briefcase } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api, { currentUserId } from '../api/config';
import moment from 'moment';

const Dashboard = () => {
    const [stats, setStats] = useState({
        questionsSolved: 0,
        goalsCompleted: 0,
        activeApplications: 0
    });
    
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // In a perfect system we'd fetch these from an aggregate dashboard endpoint
                // But for now we can approximate or just rely on the UI mockup structure
                const [qRes, gRes, jRes, qAllRes] = await Promise.all([
                    api.get('/questions/analytics/solved').catch(() => ({ data: { difficultyStats: [] } })),
                    api.get('/daily-goals/history', { params: { user_id: currentUserId } }).catch(() => ({ data: [] })),
                    api.get('/job-applications', { params: { user_id: currentUserId } }).catch(() => ({ data: [] })),
                    api.get('/questions').catch(() => ({ data: [] }))
                ]);

                let qSolved = 0;
                if (qRes.data && qRes.data.difficultyStats) {
                    qSolved = qRes.data.difficultyStats.reduce((acc, curr) => acc + curr.count, 0);
                }

                const goalsCompleted = gRes.data ? gRes.data.filter(g => g.status === 'Completed').length : 0;
                const activeApps = jRes.data ? jRes.data.filter(j => !['Rejected', 'Withdrawn'].includes(j.status)).length : 0;

                setStats({
                    questionsSolved: qSolved,
                    goalsCompleted,
                    activeApplications: activeApps
                });

                // Calculate chart data based on actual question records
                const last7Days = Array.from({length: 7}).map((_, i) => moment().subtract(6 - i, 'days').format('YYYY-MM-DD'));
                const newChartData = last7Days.map(dateStr => ({
                    name: moment(dateStr).format('ddd'),
                    date: dateStr,
                    solved: 0
                }));

                const allQuestions = qAllRes.data || [];
                allQuestions.forEach(q => {
                    if (q.status === 'Solved' && q.created_at) {
                        const qDate = moment(q.created_at).format('YYYY-MM-DD');
                        const dayMatch = newChartData.find(d => d.date === qDate);
                        if (dayMatch) {
                            dayMatch.solved += 1;
                        }
                    }
                });
                
                setChartData(newChartData);
            } catch (error) {
                console.error("Error fetching dashboard data", error);
            }
        };
        fetchDashboardData();
    }, []);

    const StatCard = ({ title, value, icon: Icon, colorClass }) => (
        <div className="bg-[#1e293b]/80 border border-[#334155] p-6 rounded-2xl flex items-center gap-6 backdrop-blur-md hover:border-[#475569] transition-colors relative overflow-hidden group">
            <div className={`p-4 rounded-xl ${colorClass.bg} text-white relative z-10 transition-transform group-hover:scale-110 duration-300`}>
                <Icon size={24} />
            </div>
            <div className="relative z-10">
                <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
                <h3 className="text-3xl font-bold text-white">{value}</h3>
            </div>
            {/* Background glow trace */}
            <div className={`absolute -right-6 -top-6 w-32 h-32 rounded-full ${colorClass.glow} blur-2xl opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity duration-300`} />
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome back, Developer! 👋</h1>
                <p className="text-slate-400">Here is your placement journey progress overview.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                    title="Problems Solved" 
                    value={stats.questionsSolved} 
                    icon={Code2} 
                    colorClass={{ bg: 'bg-emerald-500', glow: 'bg-emerald-500' }} 
                />
                <StatCard 
                    title="Goals Achieved" 
                    value={stats.goalsCompleted} 
                    icon={Target} 
                    colorClass={{ bg: 'bg-blue-500', glow: 'bg-blue-500' }} 
                />
                <StatCard 
                    title="Active Applications" 
                    value={stats.activeApplications} 
                    icon={Briefcase} 
                    colorClass={{ bg: 'bg-purple-500', glow: 'bg-purple-500' }} 
                />
            </div>

            {/* Weekly Activity Chart */}
            <div className="bg-[#1e293b]/50 border border-[#334155] rounded-2xl p-6 backdrop-blur-sm">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Target className="text-blue-400" size={24} />
                    Weekly Problem Solving Activity
                </h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                            <XAxis 
                                dataKey="name" 
                                stroke="#94a3b8" 
                                tick={{fill: '#94a3b8'}}
                                axisLine={false}
                                tickLine={false}
                                dy={10}
                            />
                            <YAxis 
                                stroke="#94a3b8" 
                                tick={{fill: '#94a3b8'}}
                                axisLine={false}
                                tickLine={false}
                                dx={-10}
                            />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                                itemStyle={{ color: '#60a5fa' }}
                            />
                            <Line 
                                type="monotone" 
                                dataKey="solved" 
                                stroke="#3b82f6" 
                                strokeWidth={3}
                                dot={{ fill: '#0f172a', stroke: '#3b82f6', strokeWidth: 2, r: 4 }}
                                activeDot={{ r: 6, fill: '#3b82f6' }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
