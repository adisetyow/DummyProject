import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Award, Calendar, CheckCircle2, ChevronRight, FileText, Download } from 'lucide-react';

export default function CertificateIndex({ certificates = [] }) {
    return (
        <AuthenticatedLayout>
            <Head title="Sertifikat Saya" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-900/50">
                        Prestasi & Kredensial
                    </span>
                    <h1 className="text-3xl font-black tracking-tight text-slate-800 dark:text-white mt-2">
                        Sertifikat Kelulusan Resmi
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Daftar sertifikat kompetensi yang berhasil Anda peroleh setelah menyelesaikan seluruh modul kelas.
                    </p>
                </div>

                {certificates.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {certificates.map((cert) => (
                            <div
                                key={cert.id}
                                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-amber-400 dark:hover:border-amber-500/50 transition flex flex-col justify-between"
                            >
                                <div className="space-y-4">
                                    <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                                        <Award className="h-6 w-6" />
                                    </div>

                                    <div>
                                        <span className="text-[11px] font-mono text-slate-400">
                                            {cert.certificate_number}
                                        </span>
                                        <h3 className="font-bold text-base text-slate-800 dark:text-white mt-1">
                                            {cert.course?.title}
                                        </h3>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            Instruktur: {cert.course?.instructor?.name}
                                        </p>
                                    </div>

                                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 flex items-center gap-1.5">
                                        <Calendar className="h-3.5 w-3.5" />
                                        <span>Diterbitkan: {new Date(cert.issued_at).toLocaleDateString('id-ID')}</span>
                                    </div>
                                </div>

                                <div className="pt-6">
                                    <Link
                                        href={route('certificates.show', cert.certificate_number)}
                                        className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow transition"
                                    >
                                        <FileText className="h-4 w-4" />
                                        Lihat Sertifikat Digital
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-8">
                        <Award className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                        <h3 className="font-bold text-slate-700 dark:text-slate-300 text-base">Belum Ada Sertifikat</h3>
                        <p className="text-slate-400 text-xs mt-1">Selesaikan kelas hingga 100% dan lulus evaluasi untuk mendapatkan sertifikat.</p>
                        <Link
                            href={route('courses.index')}
                            className="mt-4 inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold hover:underline"
                        >
                            Jelajah Kursus Sekarang →
                        </Link>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
