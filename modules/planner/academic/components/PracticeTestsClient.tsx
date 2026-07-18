'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Clock, Award } from 'lucide-react';

interface PracticeTest {
    id: string;
    title: string;
    subject: string;
    difficulty: string | null;
    time_limit_minutes: number | null;
    questions_count?: number;
}

interface PracticeTestsClientProps {
    initialTests: PracticeTest[];
}

export default function PracticeTestsClient({ initialTests }: PracticeTestsClientProps) {
    const router = useRouter();
    const [selectedSubject, setSelectedSubject] = useState('All');

    const subjects = ['All', 'Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Engineering', 'Business'];

    const filteredTests = useMemo(() => {
        if (selectedSubject === 'All') return initialTests;
        return initialTests.filter(t => t.subject === selectedSubject);
    }, [initialTests, selectedSubject]);

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'easy': return 'text-green-400 bg-green-600/20';
            case 'medium': return 'text-yellow-400 bg-yellow-600/20';
            case 'hard': return 'text-red-400 bg-red-600/20';
            default: return 'text-slate-400 bg-slate-600/20';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-page py-12 px-4">
            <div className="max-w-7xl mx-auto">
                <button
                    onClick={() => router.push('/exam-prep')}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4"
                >
                    <ArrowLeft size={20} />
                    Back to Exam Prep
                </button>

                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Practice Tests</h1>
                    <p className="text-slate-400">Choose a test to start practicing</p>
                </div>

                {/* Subject Filter */}
                <div className="mb-8">
                    <div className="flex flex-wrap gap-2">
                        {subjects.map(subject => (
                            <button
                                key={subject}
                                onClick={() => setSelectedSubject(subject)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedSubject === subject
                                    ? 'bg-pink-600 text-white'
                                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                                    }`}
                            >
                                {subject}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tests Grid */}
                {filteredTests.length === 0 ? (
                    <div className="text-center py-20 glass-strong rounded-2xl">
                        <div className="text-6xl mb-4">📝</div>
                        <h3 className="text-2xl font-bold text-white mb-2">No tests available</h3>
                        <p className="text-slate-400">Check back later for new tests</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTests.map(test => (
                            <div
                                key={test.id}
                                onClick={() => router.push(`/exam-prep/tests/${test.id}`)}
                                className="glass-strong rounded-2xl p-6 hover:border-pink-500/30 transition-all cursor-pointer border border-white/10"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <span className="px-3 py-1 bg-indigo-600/20 text-indigo-300 text-sm rounded-lg">
                                        {test.subject}
                                    </span>
                                    <span className={`px-3 py-1 text-sm rounded-lg ${getDifficultyColor(test.difficulty || '')}`}>
                                        {test.difficulty}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-3">{test.title}</h3>

                                <div className="flex items-center gap-4 text-sm text-slate-400">
                                    <div className="flex items-center gap-1">
                                        <Clock size={16} />
                                        <span>{test.time_limit_minutes} min</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Award size={16} />
                                        <span>{test.questions_count || 0} questions</span>
                                    </div>
                                </div>

                                <button className="mt-4 w-full px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl transition-all text-sm font-medium">
                                    Start Test →
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
