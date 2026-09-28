import { Head, Link } from '@inertiajs/react';
import { Award, CheckCircle2, ChevronLeft, Printer, ShieldCheck } from 'lucide-react';

export default function CertificateShow({ certificate }) {
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-950 py-10 px-4 sm:px-6 font-sans text-slate-800 dark:text-slate-100 print:bg-white print:p-0">
            <Head title={`Sertifikat: ${certificate.certificate_number}`} />

            <div className="max-w-4xl mx-auto space-y-6">
                {/* Actions (Hidden in Print) */}
                <div className="flex items-center justify-between print:hidden">
                    <Link
                        href={route('certificates.index')}
                        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Kembali ke Galeri Sertifikat
                    </Link>

                    <button
                        type="button"
                        onClick={handlePrint}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition"
                    >
                        <Printer className="h-4 w-4" />
                        Cetak / Download PDF
                    </button>
                </div>

                {/* Formal Certificate Canvas */}
                <div className="relative bg-white text-slate-900 border-8 border-double border-amber-500/80 rounded-3xl p-10 sm:p-16 shadow-2xl space-y-8 text-center overflow-hidden">
                    {/* Watermark Logo */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                        <Award className="w-96 h-96 text-amber-500" />
                    </div>

                    {/* Header */}
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 text-amber-600 font-bold uppercase tracking-widest text-xs">
                            <Award className="h-5 w-5" />
                            SERTIFIKAT KELULUSAN & KOMPETENSI
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 font-serif">
                            CERTIFICATE OF COMPLETION
                        </h1>
                        <p className="text-xs text-slate-500 font-mono">
                            No. Registrasi: {certificate.certificate_number}
                        </p>
                    </div>

                    {/* Recipient */}
                    <div className="space-y-2 py-4">
                        <p className="text-xs uppercase tracking-widest text-slate-500">
                            Diberikan kepada:
                        </p>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-indigo-950 underline decoration-amber-400 decoration-4 underline-offset-8">
                            {certificate.user?.name}
                        </h2>
                    </div>

                    {/* Details */}
                    <div className="max-w-2xl mx-auto space-y-2">
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                            Telah berhasil menyelesaikan seluruh silabus pelatihan dan memenuhi standar kelulusan pada program:
                        </p>
                        <h3 className="text-xl font-bold text-slate-900 font-serif">
                            "{certificate.course?.title}"
                        </h3>
                    </div>

                    {/* Signatures & Verification */}
                    <div className="pt-10 border-t border-slate-200 grid grid-cols-2 gap-8 items-end text-xs">
                        <div className="text-center space-y-1">
                            <div className="h-12 flex items-center justify-center font-serif italic text-lg text-slate-700">
                                {certificate.course?.instructor?.name}
                            </div>
                            <div className="w-40 mx-auto border-t border-slate-400 pt-1 font-bold text-slate-800">
                                {certificate.course?.instructor?.name}
                            </div>
                            <span className="text-[10px] text-slate-500">Instruktur Utama</span>
                        </div>

                        <div className="text-center space-y-1">
                            <div className="inline-flex items-center justify-center p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 font-bold text-[10px]">
                                <ShieldCheck className="h-4 w-4 mr-1 text-emerald-600" />
                                Terverifikasi Resmi
                            </div>
                            <div className="w-40 mx-auto border-t border-slate-400 pt-1 font-bold text-slate-800">
                                EduLMS Certification Body
                            </div>
                            <span className="text-[10px] text-slate-500">
                                Diterbitkan: {new Date(certificate.issued_at).toLocaleDateString('id-ID')}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
