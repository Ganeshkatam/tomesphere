'use client';

import { useState, useEffect } from 'react';
import { generateDailyStudyPlan } from '@/modules/learning/foundation/actions/study-plan';
import { Target, BookOpen, Brain, Zap, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function StudyPlanWidget() {
    const [plan, setPlan] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchPlan = async () => {
            try {
                const res = await generateDailyStudyPlan();
                if (res.success && res.data) {
                    setPlan(res.data);
                }
            } catch (err) {
                console.error('Failed to load study plan', err);
            } finally {
                setLoading(false);
            }
        };
        fetchPlan();
    }, []);

    if (loading) {
        return (
            <div className="bg-slate-900/50 rounded-xl p-6 border border-white/5 animate-pulse">
                <div className="h-6 w-32 bg-white/10 rounded mb-4"></div>
                <div className="space-y-3">
                    <div className="h-16 bg-white/5 rounded-lg"></div>
                    <div className="h-16 bg-white/5 rounded-lg"></div>
                </div>
            </div>
        );
    }

    if (plan.length === 0) return null;

    const getIconForTask = (type: string) => {
        switch (type) {
            case 'continue': return <BookOpen size={16} className="text-indigo-400" />;
            case 'revise': return <Brain size={16} className="text-pink-400" />;
            case 'improve': return <Zap size={16} className="text-amber-400" />;
            default: return <Target size={16} className="text-emerald-400" />;
        }
    };

    return (
        <div className="bg-slate-900/50 rounded-xl p-6 border border-white/5">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <Target className="text-indigo-400" size={18} />
                Today&apos;s Plan
            </h3>
            <div className="space-y-3">
                {plan.map((task, idx) => (
                    <div 
                        key={task.id || idx}
                        className={`p-3 rounded-lg border transition-colors cursor-pointer group ${
                            task.completed 
                            ? 'bg-green-900/10 border-green-500/20 opacity-70' 
                            : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'
                        }`}
                        onClick={() => {
                            if (task.task_type === 'revise') router.push('/exam-prep/review'); // Spaced repetition page
                            else if (task.book_id) router.push(`/read/${task.book_id}`);
                            else router.push('/home');
                        }}
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="mt-1 bg-slate-800 p-1.5 rounded-md">
                                {getIconForTask(task.task_type)}
                            </div>
                            <div className="flex-1">
                                <h4 className={`text-sm font-semibold mb-1 ${task.completed ? 'text-green-400 line-through' : 'text-white'}`}>
                                    {task.task_type === 'continue' && 'Continue Reading'}
                                    {task.task_type === 'revise' && 'Review Session'}
                                    {task.task_type === 'improve' && 'Speed Practice'}
                                    {task.task_type === 'start' && 'Start a New Book'}
                                    <span className="text-xs text-slate-400 font-normal ml-2">
                                        {task.duration_minutes}m
                                    </span>
                                </h4>
                                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                                    {task.reason}
                                </p>
                            </div>
                            {task.completed && (
                                <CheckCircle2 size={16} className="text-green-500 mt-1" />
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
