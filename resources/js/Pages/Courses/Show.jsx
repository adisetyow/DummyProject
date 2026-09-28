import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { BookOpen, Award, CheckCircle, Clock, FileText, User, ChevronRight, PlayCircle, Lock } from 'lucide-react';

export default function CourseShow({
    course,
    isEnrolled = false,
    enrollment = null,
}) {
    const { post, processing } = useForm();

    const handleEnroll = (e) => {
        e.preventDefault();
        post(route('courses.enroll', course.id));
    };

    const totalLessons = course.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0;

    return (
        <AuthenticatedLayout>
            <Head title={course.title} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                {/* Header Banner */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full uppercase">
                                {course.category?.name || 'Pelatihan'}
                            </span>
                            <span className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full uppercase">
                                Tingkat {course.level}
                            </span>
                        </div>

                        <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-800 dark:text-white leading-tight">
                            {course.title}
                        </h1>

                        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                            {course.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-semibold text-slate-500">
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-indigo-500" />
                                <span>Instruktur: <strong>{course.instructor?.name}</strong></span>
                            </div>
                            <div className="flex items-center gap-2">
                                <BookOpen className="h-4 w-4 text-indigo-500" />
                                <span>{course.modules?.length || 0} Modul ({totalLessons} Materi)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Award className="h-4 w-4 text-indigo-500" />
                                <span>Sertifikat Digital Otomatis</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Card */}
                    <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-center space-y-4">
                        {isEnrolled ? (
                            <>
                                <div className="inline-flex p-3 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                                    <CheckCircle className="h-8 w-8" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-base text-slate-800 dark:text-white">
                                        Anda Sudah Terdaftar!
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Progres saat ini: <strong>{enrollment?.progress_percentage || 0}%</strong>
                                    </p>
                                </div>
                                <Link
                                    href={route('courses.learn', course.slug)}
                                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition"
                                >
                                    <PlayCircle className="h-4 w-4" />
                                    Lanjutkan Belajar →
                                </Link>
                            </>
                        ) : (
                            <>
                                <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                                    Akses Gratis
                                </div>
                                <p className="text-xs text-slate-500">
                                    Daftar sekarang untuk membuka seluruh modul, tugas evaluasi, dan sertifikasi.
                                </p>
                                <form onSubmit={handleEnroll}>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition"
                                    >
                                        Ikuti Kelas Ini Sekarang
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>

                {/* Syllabus / Curriculum */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                    <div>
                        <h2 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-indigo-600" />
                            Silabus & Alur Pembelajaran (Learning Path)
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">
                            Materi disusun secara sekuensial untuk menjamin pemahaman konsep yang terstruktur.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {course.modules?.map((modul, idx) => (
                            <div
                                key={modul.id}
                                className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden"
                            >
                                <div className="bg-slate-50 dark:bg-slate-800/60 p-4 flex items-center justify-between">
                                    <div>
                                        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                                            MODUL {idx + 1}
                                        </span>
                                        <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                                            {modul.title}
                                        </h4>
                                    </div>
                                    <span className="text-xs text-slate-500">
                                        {modul.lessons?.length || 0} Materi
                                    </span>
                                </div>

                                <div className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                                    {modul.lessons?.map((les, lIdx) => (
                                        <div
                                            key={les.id}
                                            className="p-3.5 px-5 flex items-center justify-between text-xs hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition"
                                        >
                                            <div className="flex items-center gap-3">
                                                {les.is_preview || isEnrolled ? (
                                                    <PlayCircle className="h-4 w-4 text-indigo-500 shrink-0" />
                                                ) : (
                                                    <Lock className="h-4 w-4 text-slate-400 shrink-0" />
                                                )}
                                                <span className="font-medium text-slate-700 dark:text-slate-300">
                                                    {idx + 1}.{lIdx + 1} {les.title}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <span className="text-slate-400 font-mono text-[11px]">
                                                    {les.duration_minutes} Menit
                                                </span>
                                                {les.is_preview && (
                                                    <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded">
                                                        Preview
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
