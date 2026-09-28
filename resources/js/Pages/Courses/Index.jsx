import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Search, BookOpen, Clock, User, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

export default function CourseIndex({
    courses,
    categories = [],
    filters = {},
    enrolledCourseIds = [],
}) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || '');
    const [selectedLevel, setSelectedLevel] = useState(filters.level || '');

    const handleFilter = (cat = selectedCategory, lvl = selectedLevel, q = search) => {
        router.get(
            route('courses.index'),
            { search: q, category: cat, level: lvl },
            { preserveState: true, replace: true }
        );
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        handleFilter(selectedCategory, selectedLevel, search);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Katalog Kursus" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                {/* Hero Header */}
                <div className="text-center max-w-3xl mx-auto space-y-3 pt-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-900/50">
                        E-Learning Hub
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-800 dark:text-white">
                        Jelajahi Pelatihan & Kelas Keahlian
                    </h1>
                    <p className="text-slate-500 text-sm sm:text-base">
                        Tingkatkan kompetensi Anda melalui silabus terstruktur, materi interaktif, dan sertifikasi resmi.
                    </p>

                    {/* Search Form */}
                    <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto mt-6 relative flex items-center">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari judul kelas, topik, atau kata kunci..."
                            className="w-full pl-11 pr-24 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm text-sm focus:ring-2 focus:ring-indigo-500"
                        />
                        <Search className="absolute left-4 h-4 w-4 text-slate-400" />
                        <button
                            type="submit"
                            className="absolute right-2 px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow transition"
                        >
                            Cari
                        </button>
                    </form>
                </div>

                {/* Category Chips */}
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                    <button
                        onClick={() => {
                            setSelectedCategory('');
                            handleFilter('', selectedLevel, search);
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                            !selectedCategory
                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                        }`}
                    >
                        Semua Kategori
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => {
                                const newCat = selectedCategory === cat.slug ? '' : cat.slug;
                                setSelectedCategory(newCat);
                                handleFilter(newCat, selectedLevel, search);
                            }}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                                selectedCategory === cat.slug
                                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                            }`}
                        >
                            {cat.name} ({cat.courses_count})
                        </button>
                    ))}
                </div>

                {/* Course Grid */}
                {courses.data?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                        {courses.data.map((course) => {
                            const isEnrolled = enrolledCourseIds.includes(course.id);
                            return (
                                <div
                                    key={course.id}
                                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 hover:border-indigo-400 dark:hover:border-indigo-500/50 transition-all flex flex-col justify-between group"
                                >
                                    <div>
                                        {/* Thumbnail with Level Badge */}
                                        <div className="relative aspect-video overflow-hidden bg-slate-100 dark:bg-slate-800">
                                            <img
                                                src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop'}
                                                alt={course.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute top-3 left-3">
                                                <span className="bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full uppercase">
                                                    {course.level}
                                                </span>
                                            </div>
                                            {isEnrolled && (
                                                <div className="absolute top-3 right-3">
                                                    <span className="bg-emerald-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow">
                                                        <CheckCircle2 className="h-3 w-3" />
                                                        Terdaftar
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Details */}
                                        <div className="p-6">
                                            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 block mb-1">
                                                {course.category?.name || 'Pelatihan'}
                                            </span>
                                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 transition line-clamp-2">
                                                {course.title}
                                            </h3>
                                            <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                                                {course.description}
                                            </p>

                                            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                                                <div className="flex items-center gap-1.5">
                                                    <User className="h-3.5 w-3.5 text-slate-400" />
                                                    <span className="truncate max-w-[120px]">{course.instructor?.name}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <BookOpen className="h-3.5 w-3.5 text-slate-400" />
                                                    <span>{course.modules_count || 0} Modul</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 pt-0">
                                        <Link
                                            href={isEnrolled ? route('courses.learn', course.slug) : route('courses.show', course.slug)}
                                            className={`w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-xs font-bold transition shadow ${
                                                isEnrolled
                                                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                            }`}
                                        >
                                            {isEnrolled ? 'Masuk Kelas Belajar' : 'Lihat Silabus & Detail'}
                                            <ChevronRight className="h-4 w-4" />
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-8">
                        <BookOpen className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                        <h3 className="font-bold text-slate-700 dark:text-slate-300 text-base">Tidak ada kelas yang ditemukan</h3>
                        <p className="text-slate-400 text-xs mt-1">Coba sesuaikan kata kunci pencarian atau reset filter kategori.</p>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
