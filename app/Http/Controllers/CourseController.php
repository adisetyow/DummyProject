<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\CourseCategory;
use App\Models\Enrollment;
use App\Models\Lesson;
use App\Services\ProgressTrackingService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CourseController extends Controller
{
    protected ProgressTrackingService $progressService;

    public function __construct(ProgressTrackingService $progressService)
    {
        $this->progressService = $progressService;
    }

    /**
     * Browse all available published courses with search and filters.
     */
    public function index(Request $request): Response
    {
        $query = Course::where('status', 'published')
            ->with(['instructor:id,name,avatar', 'category:id,name,slug'])
            ->withCount('modules');

        if ($search = $request->input('search')) {
            $query->where('title', 'ilike', "%{$search}%")
                  ->orWhere('description', 'ilike', "%{$search}%");
        }

        if ($categorySlug = $request->input('category')) {
            $query->whereHas('category', function ($q) use ($categorySlug) {
                $q->where('slug', $categorySlug);
            });
        }

        if ($level = $request->input('level')) {
            $query->where('level', $level);
        }

        $courses = $query->latest()->paginate(9)->withQueryString();
        $categories = CourseCategory::withCount('courses')->get();

        $enrolledCourseIds = [];
        if ($user = $request->user()) {
            $enrolledCourseIds = Enrollment::where('user_id', $user->id)->pluck('course_id')->toArray();
        }

        return Inertia::render('Courses/Index', [
            'courses' => $courses,
            'categories' => $categories,
            'filters' => $request->only(['search', 'category', 'level']),
            'enrolledCourseIds' => $enrolledCourseIds,
        ]);
    }

    /**
     * Course details and syllabus preview.
     */
    public function show(string $slug, Request $request): Response
    {
        $course = Course::where('slug', $slug)
            ->with([
                'instructor:id,name,avatar,bio',
                'category:id,name',
                'modules.lessons',
                'quizzes',
                'assignments',
            ])
            ->firstOrFail();

        $user = $request->user();
        $enrollment = null;
        $isEnrolled = false;

        if ($user) {
            $enrollment = Enrollment::where('user_id', $user->id)
                ->where('course_id', $course->id)
                ->first();
            $isEnrolled = (bool) $enrollment;
        }

        return Inertia::render('Courses/Show', [
            'course' => $course,
            'isEnrolled' => $isEnrolled,
            'enrollment' => $enrollment,
        ]);
    }

    /**
     * Enroll authenticated user in course.
     */
    public function enroll(Course $course, Request $request): RedirectResponse
    {
        $user = $request->user();

        Enrollment::firstOrCreate(
            [
                'user_id' => $user->id,
                'course_id' => $course->id,
            ],
            [
                'enrolled_at' => now(),
                'status' => 'active',
                'progress_percentage' => 0.00,
            ]
        );

        return redirect()->route('courses.learn', ['slug' => $course->slug])
            ->with('success', 'Selamat, Anda berhasil terdaftar di kelas!');
    }

    /**
     * Interactive classroom environment for student.
     */
    public function learn(string $slug, ?string $lessonSlug = null, Request $request): Response|RedirectResponse
    {
        $user = $request->user();
        $course = Course::where('slug', $slug)->firstOrFail();

        // Ensure user is enrolled
        $enrollment = Enrollment::where('user_id', $user->id)
            ->where('course_id', $course->id)
            ->first();

        if (!$enrollment) {
            return redirect()->route('courses.show', $slug)->with('error', 'Anda belum terdaftar di kelas ini.');
        }

        $learningPath = $this->progressService->getCourseLearningPath($user, $course);

        // Find current active lesson
        $currentLesson = null;
        if ($lessonSlug) {
            $currentLesson = Lesson::where('slug', $lessonSlug)
                ->whereHas('module', fn ($q) => $q->where('course_id', $course->id))
                ->first();
        }

        if (!$currentLesson) {
            // Find first uncompleted lesson, or default to first lesson
            $firstUncompletedId = null;
            foreach ($learningPath['modules'] as $module) {
                foreach ($module['lessons'] as $l) {
                    if (!$l['is_completed']) {
                        $firstUncompletedId = $l['id'];
                        break 2;
                    }
                }
            }

            if ($firstUncompletedId) {
                $currentLesson = Lesson::find($firstUncompletedId);
            } else {
                $currentLesson = Lesson::whereHas('module', fn ($q) => $q->where('course_id', $course->id))->first();
            }
        }

        $course->load(['quizzes.questions', 'assignments']);

        return Inertia::render('Courses/Learn', [
            'course' => $course,
            'enrollment' => $enrollment,
            'learningPath' => $learningPath,
            'currentLesson' => $currentLesson,
        ]);
    }

    /**
     * Complete a lesson and update progress.
     */
    public function completeLesson(Lesson $lesson, Request $request): RedirectResponse
    {
        $user = $request->user();
        $this->progressService->completeLesson($user, $lesson);

        $course = $lesson->module->course;

        return back()->with('success', 'Materi berhasil diselesaikan!');
    }
}
