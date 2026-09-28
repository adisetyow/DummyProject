import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { BookOpen, Award, Clock, ArrowRight, CheckCircle2, PlayCircle, Calendar, Sparkles, FileText, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export default function StudentDashboard({
    continueLearning,
    activeCourses = [],
    completedCourses = [],
    upcomingAssignments = [],
    recentGrades = [],
    certificates = [],
}) {
    const { auth } = usePage().props;
    const [activeTab, setActiveTab] = useState('in_progress');

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard Belajar" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                {/* 1. Welcome & Continue Learning Hero */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-900 text-white p-8 md:p-10 shadow-xl shadow-blue-500/10">
                    <div className="relative z-10 max-w-3xl">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 text-blue-100 border border-white/15">
                            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                            Selamat Datang Kembali
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                            Halo, {auth.user.name} 👋
                        </h1>
                        <p className="mt-2 text-blue-100 text-base sm:text-lg">
                            Lanjutkan progres belajarmu hari ini untuk mencapai target sertifikasi.
                        </p>

                        {/* Continue Learning Spotlight Card */}
                        {continueLearning ? (
                            <div className="mt-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 sm:p-6 text-white max-w-2xl transition hover:bg-white/15">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <span className="text-xs font-semibold text-blue-200 uppercase tracking-wider">
                                            Lanjutkan Kelas Terakhir
                                        </span>
                                        <h3 className="text-xl font-bold mt-1 text-white">
                                            {continueLearning.course?.title}
                                        </h3>
                                        <p className="text-xs text-blue-200 mt-0.5">
                                            Instruktur: {continueLearning.course?.instructor?.name}
                                        </p>
                                    </div>
                                    <Link
                                        href={route('courses.learn', continueLearning.course?.slug)}
                                        className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 font-bold px-5 py-2.5 rounded-xl hover:bg-blue-50 transition shadow-md shadow-black/10 shrink-0 text-sm"
                                    >
                                        <PlayCircle className="h-4 w-4" />
                                        Lanjutkan Belajar →
                                    </Link>
                                </div>

                                {/* Progress bar */}
                                <div className="mt-4 pt-4 border-t border-white/15">
                                    <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
                                        <span>Progres Pembelajaran</span>
                                        <span className="text-amber-300 font-bold">{continueLearning.progress_percentage}%</span>
                                    </div>
                                    <div className="w-full bg-white/20 rounded-full h-2.5 overflow-hidden">
                                        <div
                                            className="bg-gradient-to-r from-amber-400 to-emerald-400 h-2.5 rounded-full transition-all duration-500"
                                            style={{ width: `${continueLearning.progress_percentage}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-6">
                                <Link
                                    href={route('courses.index')}
                                    className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition shadow-md"
                                >
                                    <BookOpen className="h-5 w-5" />
                                    Jelajahi Katalog Kelas
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Decorative Gradient Circles */}
                    <div className="absolute -right-16 -top-16 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute right-32 -bottom-20 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: My Courses (2 cols) */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                            <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
                                <BookOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                Kelas Saya
                            </h2>

                            {/* Tabs */}
                            <div className="flex gap-2 p-1 bg-slate-200/60 dark:bg-slate-800 rounded-xl text-xs font-semibold">
                                <button
                                    onClick={() => setActiveTab('in_progress')}
                                    className={`px-3.5 py-1.5 rounded-lg transition ${
                                        activeTab === 'in_progress'
                                            ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm'
                                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                                    }`}
                                >
                                    Sedang Diikuti ({activeCourses.length})
                                </button>
                                <button
                                    onClick={() => setActiveTab('completed')}
                                    className={`px-3.5 py-1.5 rounded-lg transition ${
                                        activeTab === 'completed'
                                            ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm'
                                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                                    }`}
                                >
                                    Selesai ({completedCourses.length})
                                </button>
                            </div>
                        </div>

                        {/* Courses Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {(activeTab === 'in_progress' ? activeCourses : completedCourses).length > 0 ? (
                                (activeTab === 'in_progress' ? activeCourses : completedCourses).map((enrollment) => (
                                    <div
                                        key={enrollment.id}
                                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-indigo-400 dark:hover:border-indigo-500/50 transition-all hover:shadow-lg hover:shadow-indigo-500/5 flex flex-col justify-between"
                                    >
                                        <div>
                                            <div className="flex items-center justify-between text-xs mb-2">
                                                <span className="font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded">
                                                    {enrollment.course?.category?.name || 'Umum'}
                                                </span>
                                                <span className="text-slate-500 font-medium">
                                                    {enrollment.progress_percentage}%
                                                </span>
                                            </div>

                                            <h4 className="font-bold text-base text-slate-800 dark:text-slate-100 line-clamp-2">
                                                {enrollment.course?.title}
                                            </h4>
                                            <p className="text-xs text-slate-500 mt-1">
                                                Instruktur: {enrollment.course?.instructor?.name}
                                            </p>
                                        </div>

                                        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                            {/* Progress Bar */}
                                            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 mb-3 overflow-hidden">
                                                <div
                                                    className="bg-indigo-600 dark:bg-indigo-500 h-2 rounded-full transition-all"
                                                    style={{ width: `${enrollment.progress_percentage}%` }}
                                                />
                                            </div>

                                            <Link
                                                href={route('courses.learn', enrollment.course?.slug)}
                                                className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 text-xs font-bold hover:bg-indigo-50 dark:hover:bg-indigo-950/80 transition"
                                            >
                                                Masuk Ruang Belajar
                                                <ChevronRight className="h-3.5 w-3.5" />
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-2 text-center py-12 bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-6">
                                    <BookOpen className="h-10 w-10 text-slate-400 mx-auto mb-3" />
                                    <p className="text-slate-500 text-sm font-medium">
                                        {activeTab === 'in_progress' ? 'Belum ada kelas yang sedang aktif.' : 'Belum ada kelas yang diselesaikan.'}
                                    </p>
                                    <Link
                                        href={route('courses.index')}
                                        className="mt-4 inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold hover:underline"
                                    >
                                        Cari kelas baru sekarang →
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Deadlines, Grades, & Certificates (1 col) */}
                    <div className="space-y-6">
                        {/* Upcoming Deadlines */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-4">
                                <Clock className="h-4 w-4 text-amber-500" />
                                Deadline Tugas & Ujian
                            </h3>

                            {upcomingAssignments.length > 0 ? (
                                <div className="space-y-3">
                                    {upcomingAssignments.map((assign) => (
                                        <div
                                            key={assign.id}
                                            className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-start gap-3"
                                        >
                                            <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                                                <Calendar className="h-4 w-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                                                    {assign.title}
                                                </h5>
                                                <p className="text-[11px] text-slate-500 truncate">
                                                    {assign.course?.title}
                                                </p>
                                                <span className="inline-block text-[10px] font-semibold text-rose-500 mt-1">
                                                    Batas: {new Date(assign.due_date).toLocaleDateString('id-ID')}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-slate-500 py-3">Tidak ada deadline yang mendekat. Santai!</p>
                            )}
                        </div>

                        {/* Recent Grades & Feedback */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-4">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                Nilai & Hasil Evaluasi
                            </h3>

                            {recentGrades.length > 0 ? (
                                <div className="space-y-3">
                                    {recentGrades.map((sub) => (
                                        <div
                                            key={sub.id}
                                            className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3"
                                        >
                                            <div className="min-w-0">
                                                <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                                                    {sub.assignment?.title}
                                                </h5>
                                                <p className="text-[11px] text-slate-500 truncate">
                                                    {sub.feedback ? `Catatan: ${sub.feedback}` : 'Sudah diperiksa'}
                                                </p>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                                                    {sub.grade}
                                                </span>
                                                <span className="text-[10px] text-slate-400">/{sub.assignment?.max_score}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-slate-500 py-3">Belum ada evaluasi nilai yang selesai.</p>
                            )}
                        </div>

                        {/* My Certificates Widget */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                    <Award className="h-4 w-4 text-indigo-500" />
                                    Sertifikat Kelulusan
                                </h3>
                                <Link
                                    href={route('certificates.index')}
                                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                                >
                                    Lihat Semua
                                </Link>
                            </div>

                            {certificates.length > 0 ? (
                                <div className="space-y-2.5">
                                    {certificates.map((cert) => (
                                        <Link
                                            key={cert.id}
                                            href={route('certificates.show', cert.certificate_number)}
                                            className="block p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 hover:border-indigo-300 transition"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200 truncate">
                                                    {cert.course?.title}
                                                </span>
                                                <Award className="h-4 w-4 text-amber-500 shrink-0 ms-2" />
                                            </div>
                                            <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 block mt-0.5">
                                                {cert.certificate_number}
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-slate-500 py-3">Selesaikan kelas 100% untuk mengklaim sertifikat!</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
