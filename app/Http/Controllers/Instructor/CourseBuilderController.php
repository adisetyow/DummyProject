<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\CourseCategory;
use App\Models\CourseModule;
use App\Models\Lesson;
use App\Models\Quiz;
use App\Models\QuizQuestion;
use App\Models\Assignment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CourseBuilderController extends Controller
{
    // ─── COURSES ─────────────────────────────────────────────────────────────

    /**
     * List all courses owned by the current instructor.
     */
    public function index(Request $request): Response
    {
        $courses = Course::where('instructor_id', $request->user()->id)
            ->with(['category:id,name'])
            ->withCount(['modules', 'enrollments'])
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Instructor/CourseBuilder/Index', [
            'courses' => $courses,
        ]);
    }

    /**
     * Show the create-course form.
     */
    public function create(): Response
    {
        return Inertia::render('Instructor/CourseBuilder/Create', [
            'categories' => CourseCategory::orderBy('name')->get(['id', 'name']),
        ]);
    }

    /**
     * Store a newly created course.
     */
    public function store(Request $request): RedirectResponse
    {
        $this->authorize('create', Course::class);

        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'category_id' => 'required|exists:course_categories,id',
            'description' => 'nullable|string',
            'level'       => 'required|in:beginner,intermediate,advanced',
            'status'      => 'required|in:draft,published',
        ]);

        $course = Course::create([
            ...$validated,
            'instructor_id' => $request->user()->id,
            'slug'          => Str::slug($validated['title']) . '-' . Str::random(6),
        ]);

        return redirect()
            ->route('instructor.courses.edit', $course)
            ->with('success', 'Kelas berhasil dibuat! Sekarang tambahkan modul dan materi.');
    }

    /**
     * Show the full course editor (builder view).
     */
    public function edit(Course $course): Response
    {
        $this->authorize('update', $course);

        $course->load([
            'category:id,name',
            'modules' => fn ($q) => $q->orderBy('sort_order')->with([
                'lessons' => fn ($q) => $q->orderBy('sort_order'),
            ]),
            'quizzes.questions',
            'assignments',
        ]);

        return Inertia::render('Instructor/CourseBuilder/Edit', [
            'course'     => $course,
            'categories' => CourseCategory::orderBy('name')->get(['id', 'name']),
        ]);
    }

    /**
     * Update course meta (title, description, status, etc.).
     */
    public function update(Request $request, Course $course): RedirectResponse
    {
        $this->authorize('update', $course);

        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'category_id' => 'required|exists:course_categories,id',
            'description' => 'nullable|string',
            'level'       => 'required|in:beginner,intermediate,advanced',
            'status'      => 'required|in:draft,published',
        ]);

        $course->update($validated);

        return back()->with('success', 'Informasi kelas berhasil diperbarui.');
    }

    /**
     * Delete a course (instructor owns it or admin).
     */
    public function destroy(Course $course): RedirectResponse
    {
        $this->authorize('delete', $course);
        $course->delete();

        return redirect()
            ->route('instructor.courses.index')
            ->with('success', 'Kelas berhasil dihapus.');
    }

    // ─── MODULES ─────────────────────────────────────────────────────────────

    /**
     * Add a module to a course.
     */
    public function storeModule(Request $request, Course $course): RedirectResponse
    {
        $this->authorize('update', $course);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
        ]);

        $maxOrder = $course->modules()->max('sort_order') ?? 0;

        $course->modules()->create([
            'title'      => $validated['title'],
            'sort_order' => $maxOrder + 1,
        ]);

        return back()->with('success', 'Modul berhasil ditambahkan.');
    }

    /**
     * Update a module's title or sort order.
     */
    public function updateModule(Request $request, CourseModule $module): RedirectResponse
    {
        $this->authorize('update', $module->course);

        $validated = $request->validate([
            'title'      => 'sometimes|required|string|max:255',
            'sort_order' => 'sometimes|required|integer|min:1',
        ]);

        $module->update($validated);

        return back()->with('success', 'Modul berhasil diperbarui.');
    }

    /**
     * Delete a module.
     */
    public function destroyModule(CourseModule $module): RedirectResponse
    {
        $this->authorize('update', $module->course);
        $module->delete();

        return back()->with('success', 'Modul berhasil dihapus.');
    }

    // ─── LESSONS ─────────────────────────────────────────────────────────────

    /**
     * Add a lesson to a module.
     */
    public function storeLesson(Request $request, CourseModule $module): RedirectResponse
    {
        $this->authorize('update', $module->course);

        $validated = $request->validate([
            'title'            => 'required|string|max:255',
            'content_type'     => 'required|in:video,pdf,text,embed',
            'content_body'     => 'nullable|string',
            'duration_minutes' => 'nullable|integer|min:1',
        ]);

        $maxOrder = $module->lessons()->max('sort_order') ?? 0;

        $module->lessons()->create([
            ...$validated,
            'slug'       => Str::slug($validated['title']) . '-' . Str::random(6),
            'sort_order' => $maxOrder + 1,
        ]);

        return back()->with('success', 'Materi berhasil ditambahkan.');
    }

    /**
     * Update a lesson.
     */
    public function updateLesson(Request $request, Lesson $lesson): RedirectResponse
    {
        $this->authorize('update', $lesson->module->course);

        $validated = $request->validate([
            'title'            => 'sometimes|required|string|max:255',
            'content_type'     => 'sometimes|required|in:video,pdf,text,embed',
            'content_body'     => 'nullable|string',
            'duration_minutes' => 'nullable|integer|min:1',
            'sort_order'       => 'sometimes|required|integer|min:1',
        ]);

        $lesson->update($validated);

        return back()->with('success', 'Materi berhasil diperbarui.');
    }

    /**
     * Delete a lesson.
     */
    public function destroyLesson(Lesson $lesson): RedirectResponse
    {
        $this->authorize('update', $lesson->module->course);
        $lesson->delete();

        return back()->with('success', 'Materi berhasil dihapus.');
    }

    // ─── QUIZZES ─────────────────────────────────────────────────────────────

    /**
     * Add a quiz to a course.
     */
    public function storeQuiz(Request $request, Course $course): RedirectResponse
    {
        $this->authorize('update', $course);

        $validated = $request->validate([
            'title'              => 'required|string|max:255',
            'passing_score'      => 'required|integer|min:0|max:100',
            'time_limit_minutes' => 'nullable|integer|min:1',
        ]);

        $maxOrder = $course->quizzes()->max('sort_order') ?? 0;

        $course->quizzes()->create([
            ...$validated,
            'sort_order' => $maxOrder + 1,
        ]);

        return back()->with('success', 'Kuis berhasil ditambahkan.');
    }

    /**
     * Update a quiz.
     */
    public function updateQuiz(Request $request, Quiz $quiz): RedirectResponse
    {
        $this->authorize('update', $quiz->course);

        $validated = $request->validate([
            'title'              => 'sometimes|required|string|max:255',
            'passing_score'      => 'sometimes|required|integer|min:0|max:100',
            'time_limit_minutes' => 'nullable|integer|min:1',
        ]);

        $quiz->update($validated);

        return back()->with('success', 'Kuis berhasil diperbarui.');
    }

    /**
     * Delete a quiz.
     */
    public function destroyQuiz(Quiz $quiz): RedirectResponse
    {
        $this->authorize('update', $quiz->course);
        $quiz->delete();

        return back()->with('success', 'Kuis berhasil dihapus.');
    }

    /**
     * Add a question to a quiz.
     */
    public function storeQuestion(Request $request, Quiz $quiz): RedirectResponse
    {
        $this->authorize('update', $quiz->course);

        $validated = $request->validate([
            'question_text'  => 'required|string',
            'question_type'  => 'required|in:multiple_choice,essay',
            'points'         => 'required|integer|min:1',
            'options'        => 'nullable|array',
            'options.*.key'  => 'required_with:options|string|max:1',
            'options.*.text' => 'required_with:options|string',
            'answer_key'     => 'nullable|string|max:1',
        ]);

        $quiz->questions()->create($validated);

        return back()->with('success', 'Pertanyaan berhasil ditambahkan.');
    }

    /**
     * Delete a quiz question.
     */
    public function destroyQuestion(QuizQuestion $question): RedirectResponse
    {
        $this->authorize('update', $question->quiz->course);
        $question->delete();

        return back()->with('success', 'Pertanyaan berhasil dihapus.');
    }

    // ─── ASSIGNMENTS ─────────────────────────────────────────────────────────

    /**
     * Add an assignment to a course.
     */
    public function storeAssignment(Request $request, Course $course): RedirectResponse
    {
        $this->authorize('update', $course);

        $validated = $request->validate([
            'title'        => 'required|string|max:255',
            'instructions' => 'nullable|string',
            'due_date'     => 'nullable|date|after:today',
            'max_score'    => 'required|integer|min:1|max:100',
        ]);

        $maxOrder = $course->assignments()->max('sort_order') ?? 0;

        $course->assignments()->create([
            ...$validated,
            'sort_order' => $maxOrder + 1,
        ]);

        return back()->with('success', 'Tugas berhasil ditambahkan.');
    }

    /**
     * Update an assignment.
     */
    public function updateAssignment(Request $request, Assignment $assignment): RedirectResponse
    {
        $this->authorize('update', $assignment->course);

        $validated = $request->validate([
            'title'        => 'sometimes|required|string|max:255',
            'instructions' => 'nullable|string',
            'due_date'     => 'nullable|date',
            'max_score'    => 'sometimes|required|integer|min:1|max:100',
        ]);

        $assignment->update($validated);

        return back()->with('success', 'Tugas berhasil diperbarui.');
    }

    /**
     * Delete an assignment.
     */
    public function destroyAssignment(Assignment $assignment): RedirectResponse
    {
        $this->authorize('update', $assignment->course);
        $assignment->delete();

        return back()->with('success', 'Tugas berhasil dihapus.');
    }
}
