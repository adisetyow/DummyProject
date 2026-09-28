import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Users, BookOpen, CheckCircle, Shield, FileText, Settings, Database, Activity } from 'lucide-react';

export default function AdminDashboard({
    stats = {},
    recentUsers = [],
    recentCourses = [],
}) {
    return (
        <AuthenticatedLayout>
            <Head title="Dashboard Administrator" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-800 dark:text-white flex items-center gap-2.5">
                            <Shield className="h-7 w-7 text-indigo-600" />
                            Pusat Kontrol Administrator
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Monitoring sistem, pengelolaan master data, pengguna, dan integritas platform.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            Sistem Online
                        </span>
                    </div>
                </div>

                {/* 1. Global Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
                        <span className="text-xs font-semibold text-slate-400 uppercase">Total Users</span>
                        <div className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white mt-1">
                            {stats.totalUsers || 0}
                        </div>
                        <span className="text-[11px] text-slate-500 mt-1 block">Akun terdaftar</span>
                    </div>

                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
                        <span className="text-xs font-semibold text-slate-400 uppercase">Active Courses</span>
                        <div className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
                            {stats.activeCourses || 0}
                        </div>
                        <span className="text-[11px] text-slate-500 mt-1 block">Kelas terpublikasi</span>
                    </div>

                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
                        <span className="text-xs font-semibold text-slate-400 uppercase">Completed Courses</span>
                        <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                            {stats.completedCourses || 0}
                        </div>
                        <span className="text-[11px] text-slate-500 mt-1 block">Kelulusan peserta</span>
                    </div>

                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
                        <span className="text-xs font-semibold text-slate-400 uppercase">Active Learners</span>
                        <div className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400 mt-1">
                            {stats.activeLearners || 0}
                        </div>
                        <span className="text-[11px] text-slate-500 mt-1 block">Siswa aktif</span>
                    </div>

                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
                        <span className="text-xs font-semibold text-slate-400 uppercase">Pending Review</span>
                        <div className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400 mt-1">
                            {stats.pendingAssignments || 0}
                        </div>
                        <span className="text-[11px] text-slate-500 mt-1 block">Tugas belum dinilai</span>
                    </div>
                </div>

                {/* 2. Management Quick Links */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <button
                        onClick={() => alert('Panel Pengelolaan Pengguna')}
                        className="p-4 rounded-2xl bg-indigo-50 dark:bg-slate-800/80 border border-indigo-100 dark:border-slate-700 flex items-center gap-3 hover:bg-indigo-100/70 transition text-left"
                    >
                        <Users className="h-6 w-6 text-indigo-600 dark:text-indigo-400 shrink-0" />
                        <div>
                            <span className="text-xs font-bold text-slate-800 dark:text-white block">User & Roles</span>
                            <span className="text-[10px] text-slate-500">Kelola otorisasi</span>
                        </div>
                    </button>

                    <button
                        onClick={() => alert('Panel Master Kategori & Kurikulum')}
                        className="p-4 rounded-2xl bg-blue-50 dark:bg-slate-800/80 border border-blue-100 dark:border-slate-700 flex items-center gap-3 hover:bg-blue-100/70 transition text-left"
                    >
                        <Database className="h-6 w-6 text-blue-600 dark:text-blue-400 shrink-0" />
                        <div>
                            <span className="text-xs font-bold text-slate-800 dark:text-white block">Master Data</span>
                            <span className="text-[10px] text-slate-500">Kategori & materi</span>
                        </div>
                    </button>

                    <button
                        onClick={() => alert('Fitur Ekspor Laporan Excel / PDF')}
                        className="p-4 rounded-2xl bg-emerald-50 dark:bg-slate-800/80 border border-emerald-100 dark:border-slate-700 flex items-center gap-3 hover:bg-emerald-100/70 transition text-left"
                    >
                        <FileText className="h-6 w-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <div>
                            <span className="text-xs font-bold text-slate-800 dark:text-white block">Export Laporan</span>
                            <span className="text-[10px] text-slate-500">Format Excel / PDF</span>
                        </div>
                    </button>

                    <button
                        onClick={() => alert('Konfigurasi Global & Mail')}
                        className="p-4 rounded-2xl bg-amber-50 dark:bg-slate-800/80 border border-amber-100 dark:border-slate-700 flex items-center gap-3 hover:bg-amber-100/70 transition text-left"
                    >
                        <Settings className="h-6 w-6 text-amber-600 dark:text-amber-400 shrink-0" />
                        <div>
                            <span className="text-xs font-bold text-slate-800 dark:text-white block">Konfigurasi</span>
                            <span className="text-[10px] text-slate-500">Setting sistem</span>
                        </div>
                    </button>
                </div>

                {/* 3. Recent Tables */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Users */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                        <h3 className="text-base font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                            <Users className="h-4 w-4 text-indigo-500" />
                            Pengguna Baru Terdaftar
                        </h3>
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {recentUsers.map((u) => (
                                <div key={u.id} className="py-3 flex items-center justify-between text-xs">
                                    <div>
                                        <span className="font-bold text-slate-800 dark:text-slate-200 block">{u.name}</span>
                                        <span className="text-slate-500">{u.email}</span>
                                    </div>
                                    <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded font-mono">
                                        {new Date(u.created_at).toLocaleDateString('id-ID')}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Courses */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                        <h3 className="text-base font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-blue-500" />
                            Kelas & Pelatihan Terbaru
                        </h3>
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {recentCourses.map((c) => (
                                <div key={c.id} className="py-3 flex items-center justify-between text-xs">
                                    <div className="min-w-0 pr-2">
                                        <span className="font-bold text-slate-800 dark:text-slate-200 block truncate">{c.title}</span>
                                        <span className="text-slate-500">Instruktur: {c.instructor?.name}</span>
                                    </div>
                                    <span className="bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded font-semibold shrink-0">
                                        {c.enrollments_count} Peserta
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
