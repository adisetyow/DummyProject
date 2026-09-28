import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Edit({ course, categories }) {
    const [activeTab, setActiveTab] = useState('info');

    return (
        <AuthenticatedLayout>
            <Head title={`Edit: ${course.title}`} />

            <div className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Link href={route('instructor.courses.index')} className="text-gray-400 hover:text-gray-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 leading-tight">{course.title}</h1>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                    course.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                }`}>
                                    {course.status === 'published' ? 'Published' : 'Draft'}
                                </span>
                                <span className="text-xs text-gray-400">Kelas Builder</span>
                            </div>
                        </div>
                    </div>
                    <Link
                        href={route('courses.show', course.slug)}
                        target="_blank"
                        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Lihat di Katalog
                    </Link>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit mb-6">
                    {[
                        { id: 'info', label: 'Info Kelas', icon: '📋' },
                        { id: 'modules', label: 'Modul & Materi', icon: '📚' },
                        { id: 'quizzes', label: 'Kuis', icon: '📝' },
                        { id: 'assignments', label: 'Tugas', icon: '📎' },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                                activeTab === tab.id
                                    ? 'bg-white text-indigo-700 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            <span>{tab.icon}</span> {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                {activeTab === 'info' && (
                    <CourseInfoTab course={course} categories={categories} />
                )}
                {activeTab === 'modules' && (
                    <ModulesTab course={course} />
                )}
                {activeTab === 'quizzes' && (
                    <QuizzesTab course={course} />
                )}
                {activeTab === 'assignments' && (
                    <AssignmentsTab course={course} />
                )}
            </div>
        </AuthenticatedLayout>
    );
}

// ─── Tab: Course Info ─────────────────────────────────────────────────────────
function CourseInfoTab({ course, categories }) {
    const { data, setData, patch, processing, errors } = useForm({
        title: course.title,
        category_id: course.category_id,
        description: course.description ?? '',
        level: course.level,
        status: course.status,
    });

    function submit(e) {
        e.preventDefault();
        patch(route('instructor.courses.update', course.id));
    }

    return (
        <form onSubmit={submit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-5 max-w-2xl">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Judul Kelas <span className="text-red-500">*</span></label>
                <input type="text" value={data.title} onChange={e => setData('title', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                    <select value={data.category_id} onChange={e => setData('category_id', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                    <select value={data.level} onChange={e => setData('level', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <option value="beginner">Pemula</option>
                        <option value="intermediate">Menengah</option>
                        <option value="advanced">Mahir</option>
                    </select>
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                <textarea value={data.description} onChange={e => setData('description', e.target.value)} rows={5}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status Publikasi</label>
                <div className="flex gap-4">
                    {[{ value: 'draft', label: 'Draft' }, { value: 'published', label: 'Published' }].map(opt => (
                        <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="status" value={opt.value} checked={data.status === opt.value}
                                onChange={e => setData('status', e.target.value)} className="text-indigo-600" />
                            <span className="text-sm">{opt.label}</span>
                        </label>
                    ))}
                </div>
            </div>
            <div className="pt-2 border-t border-gray-100">
                <button type="submit" disabled={processing}
                    className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors">
                    {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
            </div>
        </form>
    );
}

// ─── Tab: Modules & Lessons ───────────────────────────────────────────────────
function ModulesTab({ course }) {
    const [expandedModules, setExpandedModules] = useState({});
    const [addingLesson, setAddingLesson] = useState(null); // module id

    const addModuleForm = useForm({ title: '' });
    const addLessonForm = useForm({ title: '', content_type: 'text', content_body: '', duration_minutes: '' });

    function submitModule(e) {
        e.preventDefault();
        addModuleForm.post(route('instructor.modules.store', course.id), {
            onSuccess: () => addModuleForm.reset(),
        });
    }

    function submitLesson(e, moduleId) {
        e.preventDefault();
        addLessonForm.post(route('instructor.lessons.store', moduleId), {
            onSuccess: () => { addLessonForm.reset(); setAddingLesson(null); },
        });
    }

    function deleteModule(moduleId) {
        if (confirm('Hapus modul ini? Semua materi di dalamnya akan ikut terhapus.')) {
            router.delete(route('instructor.modules.destroy', moduleId));
        }
    }

    function deleteLesson(lessonId) {
        if (confirm('Hapus materi ini?')) {
            router.delete(route('instructor.lessons.destroy', lessonId));
        }
    }

    return (
        <div className="space-y-4">
            {/* Module List */}
            {course.modules.map((module, idx) => (
                <div key={module.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 bg-gray-50 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-gray-400 w-6 text-center">#{idx + 1}</span>
                            <h3 className="font-semibold text-gray-900">{module.title}</h3>
                            <span className="text-xs text-gray-400">{module.lessons.length} materi</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setExpandedModules(p => ({ ...p, [module.id]: !p[module.id] }))}
                                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                            >
                                {expandedModules[module.id] ? '▲ Sembunyikan' : '▼ Tampilkan'}
                            </button>
                            <button onClick={() => deleteModule(module.id)} className="text-red-400 hover:text-red-600 ml-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {expandedModules[module.id] && (
                        <div className="divide-y divide-gray-100">
                            {module.lessons.map((lesson, lIdx) => (
                                <div key={lesson.id} className="flex items-center justify-between px-5 py-3">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs text-gray-400 w-5">{lIdx + 1}.</span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                            lesson.content_type === 'video' ? 'bg-blue-100 text-blue-700'
                                            : lesson.content_type === 'pdf' ? 'bg-red-100 text-red-700'
                                            : lesson.content_type === 'embed' ? 'bg-purple-100 text-purple-700'
                                            : 'bg-gray-100 text-gray-600'
                                        }`}>
                                            {lesson.content_type.toUpperCase()}
                                        </span>
                                        <span className="text-sm text-gray-800">{lesson.title}</span>
                                        {lesson.duration_minutes && (
                                            <span className="text-xs text-gray-400">{lesson.duration_minutes} menit</span>
                                        )}
                                    </div>
                                    <button onClick={() => deleteLesson(lesson.id)} className="text-red-400 hover:text-red-600">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            ))}

                            {/* Add Lesson Form */}
                            {addingLesson === module.id ? (
                                <form onSubmit={e => submitLesson(e, module.id)} className="p-4 bg-indigo-50 space-y-3">
                                    <div className="grid grid-cols-2 gap-3">
                                        <input type="text" placeholder="Judul materi..." value={addLessonForm.data.title}
                                            onChange={e => addLessonForm.setData('title', e.target.value)}
                                            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                        <select value={addLessonForm.data.content_type}
                                            onChange={e => addLessonForm.setData('content_type', e.target.value)}
                                            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                            <option value="text">Teks / Artikel</option>
                                            <option value="video">Video URL</option>
                                            <option value="pdf">Dokumen PDF</option>
                                            <option value="embed">Embed</option>
                                        </select>
                                    </div>
                                    <textarea placeholder="Isi konten, URL, atau link materi..." value={addLessonForm.data.content_body}
                                        onChange={e => addLessonForm.setData('content_body', e.target.value)} rows={2}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                    <div className="flex items-center gap-2">
                                        <input type="number" placeholder="Durasi (menit)" value={addLessonForm.data.duration_minutes}
                                            onChange={e => addLessonForm.setData('duration_minutes', e.target.value)}
                                            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm w-36 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                        <button type="submit" disabled={addLessonForm.processing}
                                            className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50">
                                            Tambah
                                        </button>
                                        <button type="button" onClick={() => setAddingLesson(null)} className="text-sm text-gray-500 hover:text-gray-700">
                                            Batal
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="px-5 py-3">
                                    <button onClick={() => setAddingLesson(module.id)}
                                        className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        Tambah Materi
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ))}

            {/* Add Module Form */}
            <div className="bg-white rounded-xl border border-dashed border-gray-300 p-5">
                <form onSubmit={submitModule} className="flex gap-3 items-center">
                    <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <input type="text" placeholder="Nama modul baru (contoh: Modul 1 - Pengantar)"
                        value={addModuleForm.data.title}
                        onChange={e => addModuleForm.setData('title', e.target.value)}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    <button type="submit" disabled={addModuleForm.processing}
                        className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 disabled:opacity-50">
                        Tambah Modul
                    </button>
                </form>
            </div>
        </div>
    );
}

// ─── Tab: Quizzes ─────────────────────────────────────────────────────────────
function QuizzesTab({ course }) {
    const [expandedQuiz, setExpandedQuiz] = useState(null);
    const [addingQuestion, setAddingQuestion] = useState(null);

    const addQuizForm = useForm({ title: '', passing_score: 70, time_limit_minutes: '' });
    const addQuestionForm = useForm({
        question_text: '',
        question_type: 'multiple_choice',
        points: 10,
        options: [
            { key: 'A', text: '' }, { key: 'B', text: '' },
            { key: 'C', text: '' }, { key: 'D', text: '' },
        ],
        answer_key: 'A',
    });

    function submitQuiz(e) {
        e.preventDefault();
        addQuizForm.post(route('instructor.quizzes.store', course.id), {
            onSuccess: () => addQuizForm.reset(),
        });
    }

    function submitQuestion(e, quizId) {
        e.preventDefault();
        addQuestionForm.post(route('instructor.questions.store', quizId), {
            onSuccess: () => { addQuestionForm.reset(); setAddingQuestion(null); },
        });
    }

    function deleteQuiz(quizId) {
        if (confirm('Hapus kuis ini beserta semua pertanyaannya?')) {
            router.delete(route('instructor.quizzes.destroy', quizId));
        }
    }

    function deleteQuestion(questionId) {
        if (confirm('Hapus pertanyaan ini?')) {
            router.delete(route('instructor.questions.destroy', questionId));
        }
    }

    return (
        <div className="space-y-4">
            {course.quizzes.map(quiz => (
                <div key={quiz.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 bg-gray-50 border-b border-gray-200">
                        <div>
                            <h3 className="font-semibold text-gray-900">{quiz.title}</h3>
                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                <span>Nilai lulus: <strong>{quiz.passing_score}</strong></span>
                                {quiz.time_limit_minutes && <span>Durasi: <strong>{quiz.time_limit_minutes} menit</strong></span>}
                                <span>{quiz.questions.length} pertanyaan</span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => setExpandedQuiz(expandedQuiz === quiz.id ? null : quiz.id)}
                                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">
                                {expandedQuiz === quiz.id ? '▲ Tutup' : '▼ Buka Soal'}
                            </button>
                            <button onClick={() => deleteQuiz(quiz.id)} className="text-red-400 hover:text-red-600 ml-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {expandedQuiz === quiz.id && (
                        <div className="divide-y divide-gray-100">
                            {quiz.questions.map((q, idx) => (
                                <div key={q.id} className="px-5 py-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-800">{idx + 1}. {q.question_text}</p>
                                            {q.options && (
                                                <div className="mt-2 grid grid-cols-2 gap-1">
                                                    {q.options.map(opt => (
                                                        <span key={opt.key} className={`text-xs px-2 py-1 rounded ${
                                                            opt.key === q.answer_key ? 'bg-emerald-100 text-emerald-800 font-semibold' : 'bg-gray-100 text-gray-600'
                                                        }`}>
                                                            {opt.key}. {opt.text}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <button onClick={() => deleteQuestion(q.id)} className="text-red-400 hover:text-red-600 ml-3 flex-shrink-0">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {/* Add Question */}
                            {addingQuestion === quiz.id ? (
                                <form onSubmit={e => submitQuestion(e, quiz.id)} className="p-4 bg-blue-50 space-y-3">
                                    <textarea placeholder="Teks pertanyaan..." value={addQuestionForm.data.question_text}
                                        onChange={e => addQuestionForm.setData('question_text', e.target.value)} rows={2}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                    <div className="grid grid-cols-2 gap-2">
                                        {addQuestionForm.data.options.map((opt, i) => (
                                            <div key={opt.key} className="flex items-center gap-2">
                                                <span className="text-xs font-bold text-gray-500 w-4">{opt.key}.</span>
                                                <input type="text" placeholder={`Opsi ${opt.key}`}
                                                    value={opt.text}
                                                    onChange={e => {
                                                        const opts = [...addQuestionForm.data.options];
                                                        opts[i] = { ...opts[i], text: e.target.value };
                                                        addQuestionForm.setData('options', opts);
                                                    }}
                                                    className="flex-1 border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <label className="text-xs text-gray-600">Jawaban benar:</label>
                                            <select value={addQuestionForm.data.answer_key}
                                                onChange={e => addQuestionForm.setData('answer_key', e.target.value)}
                                                className="border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none">
                                                {['A', 'B', 'C', 'D'].map(k => <option key={k} value={k}>{k}</option>)}
                                            </select>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <label className="text-xs text-gray-600">Poin:</label>
                                            <input type="number" value={addQuestionForm.data.points}
                                                onChange={e => addQuestionForm.setData('points', e.target.value)}
                                                className="border border-gray-300 rounded px-2 py-1 text-xs w-16 focus:outline-none" />
                                        </div>
                                        <button type="submit" disabled={addQuestionForm.processing}
                                            className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-xs font-medium hover:bg-indigo-700 disabled:opacity-50">
                                            Tambah Soal
                                        </button>
                                        <button type="button" onClick={() => setAddingQuestion(null)} className="text-xs text-gray-500">Batal</button>
                                    </div>
                                </form>
                            ) : (
                                <div className="px-5 py-3">
                                    <button onClick={() => setAddingQuestion(quiz.id)}
                                        className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        Tambah Pertanyaan
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ))}

            {/* Add Quiz Form */}
            <div className="bg-white rounded-xl border border-dashed border-gray-300 p-5">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Tambah Kuis Baru</h4>
                <form onSubmit={submitQuiz} className="space-y-3">
                    <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-1">
                            <input type="text" placeholder="Judul kuis..." value={addQuizForm.data.title}
                                onChange={e => addQuizForm.setData('title', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <input type="number" placeholder="Nilai lulus (0-100)" value={addQuizForm.data.passing_score}
                            onChange={e => addQuizForm.setData('passing_score', e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        <input type="number" placeholder="Batas waktu (menit)" value={addQuizForm.data.time_limit_minutes}
                            onChange={e => addQuizForm.setData('time_limit_minutes', e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <button type="submit" disabled={addQuizForm.processing}
                        className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 disabled:opacity-50">
                        Buat Kuis
                    </button>
                </form>
            </div>
        </div>
    );
}

// ─── Tab: Assignments ─────────────────────────────────────────────────────────
function AssignmentsTab({ course }) {
    const addForm = useForm({ title: '', instructions: '', due_date: '', max_score: 100 });

    function submitAssignment(e) {
        e.preventDefault();
        addForm.post(route('instructor.assignments.store', course.id), {
            onSuccess: () => addForm.reset(),
        });
    }

    function deleteAssignment(id) {
        if (confirm('Hapus tugas ini?')) {
            router.delete(route('instructor.assignments.destroy', id));
        }
    }

    return (
        <div className="space-y-4">
            {course.assignments.length === 0 && (
                <div className="text-center py-12 text-gray-400 bg-white rounded-xl border border-dashed border-gray-300">
                    Belum ada tugas. Tambahkan tugas pertama di bawah.
                </div>
            )}
            {course.assignments.map(assignment => (
                <div key={assignment.id} className="bg-white rounded-xl border border-gray-200 p-5 flex items-start justify-between">
                    <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{assignment.title}</h3>
                        {assignment.instructions && <p className="text-sm text-gray-500 mt-1 line-clamp-2">{assignment.instructions}</p>}
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                            <span>Nilai max: <strong>{assignment.max_score}</strong></span>
                            {assignment.due_date && <span>Deadline: <strong>{new Date(assignment.due_date).toLocaleDateString('id-ID')}</strong></span>}
                        </div>
                    </div>
                    <button onClick={() => deleteAssignment(assignment.id)} className="text-red-400 hover:text-red-600 ml-4 flex-shrink-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            ))}

            {/* Add Assignment */}
            <div className="bg-white rounded-xl border border-dashed border-gray-300 p-5">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Tambah Tugas Baru</h4>
                <form onSubmit={submitAssignment} className="space-y-3">
                    <input type="text" placeholder="Judul tugas..." value={addForm.data.title}
                        onChange={e => addForm.setData('title', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    <textarea placeholder="Instruksi atau deskripsi tugas..." value={addForm.data.instructions}
                        onChange={e => addForm.setData('instructions', e.target.value)} rows={3}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs text-gray-600 mb-1 block">Deadline (opsional)</label>
                            <input type="datetime-local" value={addForm.data.due_date}
                                onChange={e => addForm.setData('due_date', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div>
                            <label className="text-xs text-gray-600 mb-1 block">Nilai Maksimum</label>
                            <input type="number" value={addForm.data.max_score}
                                onChange={e => addForm.setData('max_score', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                    </div>
                    <button type="submit" disabled={addForm.processing}
                        className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 disabled:opacity-50">
                        {addForm.processing ? 'Menyimpan...' : 'Tambah Tugas'}
                    </button>
                </form>
            </div>
        </div>
    );
}
