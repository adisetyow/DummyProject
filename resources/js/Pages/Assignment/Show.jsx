import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FileText, Calendar, CheckCircle2, ChevronLeft, Upload, Clock, Award } from 'lucide-react';

export default function AssignmentShow({ assignment, submission }) {
    const { data, setData, post, processing } = useForm({
        notes: submission?.notes || '',
        submission_file_url: submission?.submission_file_url || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('assignments.submit', assignment.id));
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Tugas: ${assignment.title}`} />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                {/* Back button & Header */}
                <div className="flex items-center gap-3">
                    <Link
                        href={route('courses.learn', assignment.course?.slug)}
                        className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                            Tugas Mandiri / Proyek
                        </span>
                        <h1 className="text-2xl font-black text-slate-800 dark:text-white">
                            {assignment.title}
                        </h1>
                    </div>
                </div>

                {/* Instructions Box */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
                    <div className="flex items-center justify-between text-xs text-slate-500 pb-3 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-blue-500" />
                            <span>Batas Waktu: <strong>{assignment.due_date ? new Date(assignment.due_date).toLocaleDateString('id-ID') : 'Tidak terbatas'}</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Award className="h-4 w-4 text-amber-500" />
                            <span>Maksimal Nilai: <strong>{assignment.max_score} Poin</strong></span>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-2">
                            Instruksi Pengerjaan:
                        </h3>
                        <div className="prose prose-slate dark:prose-invert text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
                            {assignment.instructions}
                        </div>
                    </div>
                </div>

                {/* Submission Form / Status */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                            <Upload className="h-5 w-5 text-indigo-600" />
                            Pengumpulan Tugas
                        </h3>
                        {submission && (
                            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                                Sudah Dikumpulkan ({new Date(submission.submitted_at).toLocaleDateString('id-ID')})
                            </span>
                        )}
                    </div>

                    {submission?.grade !== null && submission?.grade !== undefined && (
                        <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-200 uppercase">
                                    Hasil Penilaian Instruktur
                                </span>
                                <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                                    {submission.grade} / {assignment.max_score}
                                </span>
                            </div>
                            {submission.feedback && (
                                <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-2">
                                    Feedback: "{submission.feedback}"
                                </p>
                            )}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                Tautan Dokumen / File Tugas (Google Drive / GitHub / URL)
                            </label>
                            <input
                                type="url"
                                required
                                value={data.submission_file_url}
                                onChange={(e) => setData('submission_file_url', e.target.value)}
                                placeholder="https://drive.google.com/... atau tautan file Anda"
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                Catatan Tambahan (Opsional)
                            </label>
                            <textarea
                                rows={3}
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                placeholder="Jelaskan ringkasan atau poin penting dari hasil pengerjaan Anda..."
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md transition"
                            >
                                <CheckCircle2 className="h-4 w-4" />
                                {submission ? 'Perbarui Pengumpulan Tugas' : 'Kirim Tugas Sekarang'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
