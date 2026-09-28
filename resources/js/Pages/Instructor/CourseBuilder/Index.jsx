import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Index({ courses }) {
    return (
        <AuthenticatedLayout>
            <Head title="Kelas Saya - Instructor" />

            <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Kelas yang Saya Ampu</h1>
                        <p className="text-sm text-gray-500 mt-1">Kelola dan buat kelas baru untuk peserta Anda</p>
                    </div>
                    <Link
                        href={route('instructor.courses.create')}
                        className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Buat Kelas Baru
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Total Kelas</p>
                        <p className="text-3xl font-bold text-indigo-600 mt-1">{courses.total}</p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Sudah Publish</p>
                        <p className="text-3xl font-bold text-emerald-600 mt-1">
                            {courses.data.filter(c => c.status === 'published').length}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Draft</p>
                        <p className="text-3xl font-bold text-amber-500 mt-1">
                            {courses.data.filter(c => c.status === 'draft').length}
                        </p>
                    </div>
                </div>

                {/* Course List */}
                {courses.data.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                        <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <p className="text-gray-500 mb-4">Anda belum membuat kelas apapun</p>
                        <Link href={route('instructor.courses.create')} className="text-indigo-600 font-medium hover:underline">
                            Buat kelas pertama Anda →
                        </Link>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                                <tr>
                                    <th className="px-6 py-3 text-left">Kelas</th>
                                    <th className="px-6 py-3 text-center">Modul</th>
                                    <th className="px-6 py-3 text-center">Peserta</th>
                                    <th className="px-6 py-3 text-center">Status</th>
                                    <th className="px-6 py-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {courses.data.map(course => (
                                    <CourseRow key={course.id} course={course} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

function CourseRow({ course }) {
    const { delete: destroy, processing } = useForm();

    function handleDelete() {
        if (confirm(`Hapus kelas "${course.title}"? Semua modul dan materi akan terhapus.`)) {
            destroy(route('instructor.courses.destroy', course.id));
        }
    }

    return (
        <tr className="hover:bg-gray-50 transition-colors">
            <td className="px-6 py-4">
                <div>
                    <p className="font-medium text-gray-900">{course.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{course.category?.name}</p>
                </div>
            </td>
            <td className="px-6 py-4 text-center text-gray-600">{course.modules_count}</td>
            <td className="px-6 py-4 text-center text-gray-600">{course.enrollments_count}</td>
            <td className="px-6 py-4 text-center">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    course.status === 'published'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                }`}>
                    {course.status === 'published' ? 'Published' : 'Draft'}
                </span>
            </td>
            <td className="px-6 py-4 text-right space-x-2">
                <Link
                    href={route('instructor.courses.edit', course.id)}
                    className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 text-xs font-medium"
                >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Edit Builder
                </Link>
                <button
                    onClick={handleDelete}
                    disabled={processing}
                    className="inline-flex items-center gap-1 text-red-500 hover:text-red-700 text-xs font-medium disabled:opacity-50"
                >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Hapus
                </button>
            </td>
        </tr>
    );
}
