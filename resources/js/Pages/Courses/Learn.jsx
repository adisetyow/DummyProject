import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    CheckCircle,
    CheckCircle2,
    Lock,
    PlayCircle,
    FileText,
    Award,
    HelpCircle,
    ChevronLeft,
    ChevronRight,
    Send,
    MessageSquare,
    BookOpen,
    Clock,
} from 'lucide-react';
import { useState } from 'react';

export default function CourseLearn({
    course,
    enrollment,
    learningPath,
    currentLesson,
}) {
    const { post: completePost, processing: completing } = useForm();
    const { data: commentData, setData: setCommentData, post: commentPost, reset: resetComment, processing: commenting } = useForm({
        course_id: course.id,
        lesson_id: currentLesson?.id || null,
        comment: '',
    });

    const isCurrentCompleted = currentLesson ? learningPath.completed_lesson_ids?.includes(currentLesson.id) : false;

    const handleComplete = () => {
        if (!currentLesson) return;
        completePost(route('lessons.complete', currentLesson.id));
    };

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        commentPost(route('discussions.store'), {
            onSuccess: () => resetComment(),
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Belajar: ${course.title}`} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                {/* Top Bar: Back, Course Title, & Live Progress Indicator */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('dashboard')}
                            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 transition"
                            title="Kembali ke Dashboard"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </Link>
                        <div>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                                Ruang Belajar Mandiri
                            </span>
                            <h1 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white truncate max-w-xl">
                                {course.title}
                            </h1>
                        </div>
                    </div>

                    {/* Progress Bar in Top Bar */}
                    <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/80 px-4 py-2.5 rounded-xl border border-slate-100 dark:border-slate-800 shrink-0">
                        <div className="text-right">
                            <span className="text-[11px] text-slate-500 block">Total Progres</span>
                            <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">
                                {enrollment.progress_percentage}% Selesai
                            </span>
                        </div>
                        <div className="w-28 sm:w-36 bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-2.5 rounded-full transition-all duration-500"
                                style={{ width: `${enrollment.progress_percentage}%` }}
                            />
                        </div>
                        {enrollment.progress_percentage >= 100 && (
                            <Link
                                href={route('certificates.index')}
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500 text-white text-xs font-bold shadow hover:bg-emerald-600 transition animate-bounce"
                            >
                                <Award className="h-3.5 w-3.5" />
                                Klaim Sertifikat
                            </Link>
                        )}
                    </div>
                </div>

                {/* Main Classroom Layout (Sidebar + Content) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left/Sidebar: Learning Path & Modules (4 cols) */}
                    <div className="lg:col-span-4 order-2 lg:order-1 space-y-4">
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm">
                            <h3 className="font-bold text-sm text-slate-800 dark:text-white mb-3 flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                    <BookOpen className="h-4 w-4 text-indigo-500" />
                                    Silabus & Learning Path
                                </span>
                                <span className="text-[11px] text-slate-400 font-normal">
                                    {learningPath.modules?.length} Modul
                                </span>
                            </h3>

                            {/* Sequential Modules */}
                            <div className="space-y-3">
                                {learningPath.modules?.map((modul, mIdx) => (
                                    <div
                                        key={modul.id}
                                        className="border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-slate-800/30"
                                    >
                                        <div className="p-3 bg-slate-100/70 dark:bg-slate-800/60 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                                            <span>Modul {mIdx + 1}: {modul.title}</span>
                                        </div>

                                        <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                                            {modul.lessons?.map((les) => {
                                                const isActive = currentLesson?.id === les.id;
                                                return (
                                                    <div
                                                        key={les.id}
                                                        className={`p-3 text-xs flex items-center justify-between transition ${
                                                            isActive
                                                                ? 'bg-indigo-50 dark:bg-indigo-950/60 border-l-4 border-indigo-600 font-bold text-indigo-700 dark:text-indigo-300'
                                                                : les.is_locked
                                                                ? 'opacity-60 cursor-not-allowed text-slate-400'
                                                                : 'hover:bg-slate-100/50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-300'
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-2.5 min-w-0 pr-2">
                                                            {les.is_completed ? (
                                                                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                                                            ) : les.is_locked ? (
                                                                <Lock className="h-4 w-4 text-slate-400 shrink-0" />
                                                            ) : (
                                                                <PlayCircle className="h-4 w-4 text-indigo-500 shrink-0" />
                                                            )}

                                                            {les.is_locked ? (
                                                                <span className="truncate">{les.title}</span>
                                                            ) : (
                                                                <Link
                                                                    href={route('courses.learn', { slug: course.slug, lessonSlug: les.slug })}
                                                                    className="truncate hover:underline"
                                                                >
                                                                    {les.title}
                                                                </Link>
                                                            )}
                                                        </div>

                                                        <span className="text-[10px] text-slate-400 font-mono shrink-0">
                                                            {les.duration_minutes}m
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}

                                {/* Course Quizzes & Assignments Section */}
                                {(course.quizzes?.length > 0 || course.assignments?.length > 0) && (
                                    <div className="border border-indigo-100 dark:border-indigo-900/40 rounded-xl overflow-hidden bg-indigo-50/30 dark:bg-indigo-950/20 p-3 space-y-2">
                                        <span className="text-[11px] font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider block">
                                            Evaluasi & Ujian
                                        </span>

                                        {course.quizzes?.map((quiz) => (
                                            <Link
                                                key={quiz.id}
                                                href={route('quizzes.show', quiz.id)}
                                                className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-indigo-100 dark:border-indigo-900/60 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-indigo-500 transition flex items-center justify-between"
                                            >
                                                <span className="flex items-center gap-2 truncate">
                                                    <HelpCircle className="h-4 w-4 text-amber-500" />
                                                    {quiz.title}
                                                </span>
                                                <span className="text-[10px] bg-amber-100 text-amber-700 font-bold px-1.5 py-0.5 rounded">
                                                    Kuis
                                                </span>
                                            </Link>
                                        ))}

                                        {course.assignments?.map((assign) => (
                                            <Link
                                                key={assign.id}
                                                href={route('assignments.show', assign.id)}
                                                className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-indigo-100 dark:border-indigo-900/60 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-indigo-500 transition flex items-center justify-between"
                                            >
                                                <span className="flex items-center gap-2 truncate">
                                                    <FileText className="h-4 w-4 text-blue-500" />
                                                    {assign.title}
                                                </span>
                                                <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-1.5 py-0.5 rounded">
                                                    Tugas
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right/Center: Main Lesson Viewer & Action (8 cols) */}
                    <div className="lg:col-span-8 order-1 lg:order-2 space-y-6">
                        {currentLesson ? (
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                                {/* Title & Duration */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
                                    <div>
                                        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-md uppercase">
                                            Materi Pembelajaran
                                        </span>
                                        <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white mt-2">
                                            {currentLesson.title}
                                        </h2>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                        <Clock className="h-4 w-4 text-slate-400" />
                                        <span>Estimasi {currentLesson.duration_minutes} Menit</span>
                                    </div>
                                </div>

                                {/* Media Player / Content Body */}
                                {currentLesson.content_type === 'video' && currentLesson.content_url && (
                                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-black shadow-lg">
                                        <iframe
                                            src={currentLesson.content_url}
                                            title={currentLesson.title}
                                            className="w-full h-full border-0"
                                            allowFullScreen
                                        />
                                    </div>
                                )}

                                <div className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line bg-slate-50/50 dark:bg-slate-800/30 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    {currentLesson.content_body || 'Materi sedang disiapkan oleh instruktur.'}
                                </div>

                                {/* Bottom Action: Mark as Completed Button */}
                                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="text-xs text-slate-500">
                                        {isCurrentCompleted ? (
                                            <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                                                <CheckCircle className="h-4 w-4" />
                                                Materi ini telah Anda selesaikan
                                            </span>
                                        ) : (
                                            <span>Klik tombol selesai untuk melanjutkan ke materi berikutnya.</span>
                                        )}
                                    </div>

                                    <button
                                        type="button"
                                        disabled={completing || isCurrentCompleted}
                                        onClick={handleComplete}
                                        className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold text-xs sm:text-sm transition shadow ${
                                            isCurrentCompleted
                                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 cursor-default'
                                                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20'
                                        }`}
                                    >
                                        <CheckCircle2 className="h-4 w-4" />
                                        {isCurrentCompleted ? 'Telah Diselesaikan' : completing ? 'Menyimpan...' : 'Tandai Selesai & Lanjutkan →'}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8">
                                <BookOpen className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                                <h3 className="font-bold text-slate-700 dark:text-slate-300">Pilih materi dari silabus di samping untuk mulai belajar</h3>
                            </div>
                        )}

                        {/* Discussion / Forum Section */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
                            <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                <MessageSquare className="h-5 w-5 text-indigo-600" />
                                Forum Tanya Jawab & Diskusi Materi
                            </h3>

                            <form onSubmit={handleCommentSubmit} className="space-y-3">
                                <textarea
                                    rows={3}
                                    value={commentData.comment}
                                    onChange={(e) => setCommentData('comment', e.target.value)}
                                    placeholder="Ada pertanyaan atau tanggapan terkait materi ini? Tulis di sini..."
                                    required
                                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-sm focus:ring-2 focus:ring-indigo-500"
                                />
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={commenting}
                                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow"
                                    >
                                        <Send className="h-3.5 w-3.5" />
                                        Kirim Komentar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
