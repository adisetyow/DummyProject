import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { BookOpen, Users, CheckCircle, Clock, Award, BarChart2, PlusCircle, Check, MessageSquare } from 'lucide-react';
import { useState } from 'react';

export default function InstructorDashboard({
    stats = {},
    courses = [],
    pendingSubmissions = [],
}) {
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const { data, setData, post, processing, reset } = useForm({
        grade: '',
        feedback: '',
    });

    const handleGradeSubmit = (e) => {
        e.preventDefault();
        post(route('submissions.grade', selectedSubmission.id), {
            onSuccess: () => {
                setSelectedSubmission(null);
                reset();
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard Pengajar" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-800 dark:text-white">
                            Dashboard Pengajar 👨‍🏫
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Kelola kelas, pantau keaktifan peserta, dan periksa tugas mandiri.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => alert('Fitur tambah kelas baru siap dihubungkan ke form creator!')}
                        className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-indigo-500/20 transition self-start"
                    >
                        <PlusCircle className="h-4 w-4" />
                        Buat Kelas Baru
                    </button>
                </div>

                {/* 1. Statistics Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center justify-between text-slate-400 mb-2">
                            <span className="text-xs font-semibold uppercase">Total Peserta</span>
                            <Users className="h-4 w-4 text-blue-500" />
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white">
                            {stats.totalStudents || 0}
                        </div>
                        <span className="text-xs text-slate-500 mt-1 block">
                            {stats.activeStudents || 0} aktif • {stats.notStarted || 0} belum mulai
                        </span>
                    </div>

                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center justify-between text-slate-400 mb-2">
                            <span className="text-xs font-semibold uppercase">Rata-rata Progres</span>
                            <BarChart2 className="h-4 w-4 text-indigo-500" />
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400">
                            {stats.avgProgress || 0}%
                        </div>
                        <span className="text-xs text-slate-500 mt-1 block">Seluruh kelas aktif</span>
                    </div>

                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center justify-between text-slate-400 mb-2">
                            <span className="text-xs font-semibold uppercase">Rata-rata Nilai</span>
                            <Award className="h-4 w-4 text-amber-500" />
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">
                            {stats.avgQuizScore || 0}
                        </div>
                        <span className="text-xs text-slate-500 mt-1 block">Evaluasi kuis</span>
                    </div>

                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center justify-between text-slate-400 mb-2">
                            <span className="text-xs font-semibold uppercase">Tugas Pending</span>
                            <Clock className="h-4 w-4 text-rose-500" />
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400">
                            {stats.pendingCount || 0}
                        </div>
                        <span className="text-xs text-slate-500 mt-1 block">Perlu dikoreksi</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Courses Managed */}
                    <div className="lg:col-span-2 space-y-4">
                        <h2 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-indigo-600" />
                            Kelas yang Saya Kelola
                        </h2>

                        <div className="space-y-4">
                            {courses.map((c) => (
                                <div
                                    key={c.id}
                                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                                >
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded">
                                                {c.category?.name}
                                            </span>
                                            <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                                                {c.status.toUpperCase()}
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">
                                            {c.title}
                                        </h3>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            {c.modules_count} Modul • {c.enrollments_count} Peserta terdaftar
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">
                                        <Link
                                            href={route('courses.show', c.slug)}
                                            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold transition"
                                        >
                                            Lihat Kelas
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pending Grading Submissions */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
                            <Clock className="h-5 w-5 text-rose-500" />
                            Antrean Koreksi Tugas ({pendingSubmissions.length})
                        </h2>

                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
                            {pendingSubmissions.length > 0 ? (
                                pendingSubmissions.map((sub) => (
                                    <div
                                        key={sub.id}
                                        className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2"
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                                    {sub.assignment?.title}
                                                </h5>
                                                <span className="text-[11px] text-slate-500">
                                                    Siswa: <strong className="text-slate-700 dark:text-slate-300">{sub.user?.name}</strong>
                                                </span>
                                            </div>
                                            <span className="text-[10px] bg-rose-100 text-rose-700 font-semibold px-2 py-0.5 rounded shrink-0">
                                                Pending
                                            </span>
                                        </div>

                                        {sub.notes && (
                                            <p className="text-xs text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-100 dark:border-slate-800 italic">
                                                "{sub.notes}"
                                            </p>
                                        )}

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectedSubmission(sub);
                                                setData({ grade: '', feedback: '' });
                                            }}
                                            className="w-full text-center py-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-sm"
                                        >
                                            Beri Nilai & Feedback
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs text-slate-500 py-6 text-center">
                                    Semua tugas sudah diperiksa! Kerja bagus 👍
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Grading Modal */}
                {selectedSubmission && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                                Penilaian Tugas
                            </h3>
                            <p className="text-xs text-slate-500">
                                Siswa: <strong>{selectedSubmission.user?.name}</strong> • Tugas: <strong>{selectedSubmission.assignment?.title}</strong>
                            </p>

                            <form onSubmit={handleGradeSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                        Nilai (0 - {selectedSubmission.assignment?.max_score})
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        max={selectedSubmission.assignment?.max_score}
                                        required
                                        value={data.grade}
                                        onChange={(e) => setData('grade', e.target.value)}
                                        placeholder="Contoh: 85"
                                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                        Catatan / Feedback untuk Siswa
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={data.feedback}
                                        onChange={(e) => setData('feedback', e.target.value)}
                                        placeholder="Berikan saran konstruktif..."
                                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <div className="flex justify-end gap-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedSubmission(null)}
                                        className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold hover:bg-slate-200 transition"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow"
                                    >
                                        Simpan Nilai
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
