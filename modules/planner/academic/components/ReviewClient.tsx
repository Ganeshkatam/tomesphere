'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { showError, showSuccess } from '@/lib/toast';
import { processReviewItem } from '@/modules/learning/foundation/actions/study-plan';
import { ArrowLeft, Brain, CheckCircle2, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ReviewItem {
    id: string;
    content: string;
    answer: string | null;
    book_id: string | null;
}

interface ReviewClientProps {
    initialItems: ReviewItem[];
}

export default function ReviewClient({ initialItems }: ReviewClientProps) {
    const router = useRouter();
    const [items, setItems] = useState<ReviewItem[]>(initialItems);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const isComplete = currentIndex >= items.length;
    const currentItem = items[currentIndex];

    const handleAnswer = async (quality: number) => {
        if (!currentItem || isProcessing) return;
        setIsProcessing(true);

        try {
            const res = await processReviewItem(currentItem.id, quality);
            if (!res.success) throw new Error(res.error);

            // Move to next card
            setFlipped(false);
            setCurrentIndex(prev => prev + 1);
            
            if (currentIndex + 1 >= items.length) {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            }
        } catch (error: any) {
            showError('Failed to save review result');
        } finally {
            setIsProcessing(false);
        }
    };

    if (initialItems.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-page py-12 px-4 flex flex-col items-center justify-center">
                <div className="text-center py-20 glass-strong rounded-2xl max-w-lg w-full">
                    <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 size={40} className="text-emerald-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">You&apos;re all caught up!</h3>
                    <p className="text-slate-400 mb-8">No items due for review right now. Great job keeping your memory fresh.</p>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    if (isComplete) {
        return (
            <div className="min-h-screen bg-gradient-page py-12 px-4 flex flex-col items-center justify-center">
                <div className="text-center py-20 glass-strong rounded-2xl max-w-lg w-full animate-slideUp">
                    <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Trophy size={40} className="text-yellow-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Session Complete!</h3>
                    <p className="text-slate-400 mb-8">You reviewed {items.length} items today. Your brain is getting stronger.</p>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all font-medium"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-page py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <button
                    onClick={() => router.push('/dashboard')}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8"
                >
                    <ArrowLeft size={20} />
                    Exit Session
                </button>

                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                        <Brain className="text-pink-400" />
                        Spaced Repetition
                    </h2>
                    <p className="text-slate-400">
                        Card {currentIndex + 1} of {items.length}
                    </p>
                    
                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-slate-800 rounded-full mt-4 overflow-hidden">
                        <div 
                            className="h-full bg-indigo-500 transition-all duration-300"
                            style={{ width: `${(currentIndex / items.length) * 100}%` }}
                        />
                    </div>
                </div>

                <div
                    onClick={() => !flipped && setFlipped(true)}
                    className={`glass-strong rounded-2xl p-12 min-h-[400px] flex items-center justify-center transition-all border border-white/10 ${
                        !flipped ? 'cursor-pointer hover:border-pink-500/30' : ''
                    }`}
                >
                    <div className="text-center w-full">
                        <p className={`text-2xl font-medium transition-all duration-300 ${flipped ? 'text-slate-400 text-lg mb-8' : 'text-white'}`}>
                            {currentItem.content}
                        </p>
                        
                        {flipped && currentItem.answer && (
                            <div className="animate-fadeIn">
                                <div className="h-px w-full bg-white/10 mb-8" />
                                <p className="text-2xl text-white font-medium">
                                    {currentItem.answer}
                                </p>
                            </div>
                        )}

                        {!flipped && (
                            <p className="text-slate-500 text-sm mt-8 animate-pulse">
                                Click anywhere to reveal
                            </p>
                        )}
                    </div>
                </div>

                {flipped && (
                    <div className="mt-8 animate-slideUp">
                        <p className="text-center text-slate-400 mb-4 text-sm">How well did you know this?</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <button
                                onClick={() => handleAnswer(1)}
                                disabled={isProcessing}
                                className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl transition-all"
                            >
                                <span className="block font-bold mb-1">Again</span>
                                <span className="text-xs opacity-70">Complete blackout</span>
                            </button>
                            <button
                                onClick={() => handleAnswer(3)}
                                disabled={isProcessing}
                                className="p-3 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/20 rounded-xl transition-all"
                            >
                                <span className="block font-bold mb-1">Hard</span>
                                <span className="text-xs opacity-70">Recalled with effort</span>
                            </button>
                            <button
                                onClick={() => handleAnswer(4)}
                                disabled={isProcessing}
                                className="p-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-xl transition-all"
                            >
                                <span className="block font-bold mb-1">Good</span>
                                <span className="text-xs opacity-70">Perfect recall</span>
                            </button>
                            <button
                                onClick={() => handleAnswer(5)}
                                disabled={isProcessing}
                                className="p-3 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded-xl transition-all"
                            >
                                <span className="block font-bold mb-1">Easy</span>
                                <span className="text-xs opacity-70">Too easy</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
