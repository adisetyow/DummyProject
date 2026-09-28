import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { HelpCircle, Clock, CheckCircle2, AlertCircle, ChevronLeft, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export default function QuizShow({ quiz, latestAttempt }) {
    const [answers, setAnswers] = useState({});
    const { post, processing } = useForm();

    const handleSelectOption = (questionId, optionId) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: optionId,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('quizzes.submit', { quiz: quiz.id, answers }));
    };

    const isAllAnswered = quiz.questions?.length > 0 && Object.keys(answers).length === quiz.questions.length;

    return (
        <AuthenticatedLayout>
            <Head title={`Kuis: ${quiz.title}`} />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                {/* Back button & Header */}
                <div className="flex items-center gap-3">
                    <Link
                        href={route('courses.learn', quiz.course?.slug)}
                        className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                            Evaluasi Pembelajaran
                        </span>
                        <h1 className="text-2xl font-black text-slate-800 dark:text-white">
                            {quiz.title}
                        </h1>
                    </div>
                </div>

                {/* Status or Previous Attempt Box */}
                {latestAttempt && (
                    <div className={`p-5 rounded-2xl border flex items-center justify-between ${
                        latestAttempt.is_passed
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                            : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200'
                    }`}>
                        <div className="flex items-center gap-3">
                            {latestAttempt.is_passed ? (
                                <CheckCircle2 className="h-6 w-6 text-emerald-500 shrink-0" />
                            ) : (
                                <AlertCircle className="h-6 w-6 text-rose-500 shrink-0" />
                            )}
                            <div>
                                <h4 className="font-bold text-sm">
                                    {latestAttempt.is_passed ? 'Anda Telah Lulus Kuis Ini!' : 'Hasil Terakhir: Belum Memenuhi Nilai Kelulusan'}
                                </h4>
                                <p className="text-xs opacity-80">
                                    Skor: {latestAttempt.score} • Nilai Kelulusan Minimal: {quiz.passing_score}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Quiz Questions Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {quiz.questions?.map((q, idx) => (
                        <div
                            key={q.id}
                            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <span className="inline-flex items-center justify-center h-7 w-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold text-xs shrink-0">
                                    {idx + 1}
                                </span>
                                <h3 className="font-bold text-base text-slate-800 dark:text-white flex-1 leading-relaxed">
                                    {q.question_text}
                                </h3>
                                <span className="text-[11px] font-semibold text-slate-400">
                                    {q.points} Poin
                                </span>
                            </div>

                            {/* Multiple Choice Options */}
                            <div className="space-y-2.5 pt-2">
                                {q.options?.map((opt) => {
                                    const isSelected = answers[q.id] === opt.id;
                                    return (
                                        <button
                                            key={opt.id}
                                            type="button"
                                            onClick={() => handleSelectOption(q.id, opt.id)}
                                            className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition flex items-center gap-3 ${
                                                isSelected
                                                    ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-600 dark:border-indigo-500 text-indigo-900 dark:text-indigo-200 font-bold ring-2 ring-indigo-500/20'
                                                    : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100/50'
                                            }`}
                                        >
                                            <span className={`h-6 w-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                                                isSelected
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                                            }`}>
                                                {opt.id}
                                            </span>
                                            <span className="flex-1">{opt.text}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                    {/* Submit Button */}
                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={processing || !isAllAnswered}
                            className={`inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-sm shadow-md transition ${
                                isAllAnswered && !processing
                                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/25'
                                    : 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
                            }`}
                        >
                            <CheckCircle2 className="h-5 w-5" />
                            {processing ? 'Menilai Jawaban...' : 'Kumpulkan & Selesaikan Kuis'}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
