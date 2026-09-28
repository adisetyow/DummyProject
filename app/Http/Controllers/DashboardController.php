<?php

namespace App\Http\Controllers;

use App\Models\Assignment;
use App\Models\AssignmentSubmission;
use App\Models\Certificate;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\QuizAttempt;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $roles = $user->getRoleNames()->toArray();

        // 1. Admin Dashboard
        if (in_array('admin', $roles)) {
            $totalUsers = User::count();
            $activeCourses = Course::where('status', 'published')->count();
            $completedCoursesCount = Enrollment::where('status', 'completed')->count();
            $activeLearners = Enrollment::where('status', 'active')->distinct('user_id')->count('user_id');
            $pendingAssignments = AssignmentSubmission::whereNull('grade')->count();

            $recentUsers = User::latest()->take(5)->get(['id', 'name', 'email', 'status', 'created_at']);
            $recentCourses = Course::with(['instructor:id,name', 'category:id,name'])
                ->withCount('enrollments')
                ->latest()
                ->take(5)
                ->get();

            return Inertia::render('Dashboard/AdminDashboard', [
                'stats' => [
                    'totalUsers' => $totalUsers,
                    'activeCourses' => $activeCourses,
                    'completedCourses' => $completedCoursesCount,
                    'activeLearners' => $activeLearners,
                    'pendingAssignments' => $pendingAssignments,
                ],
                'recentUsers' => $recentUsers,
                'recentCourses' => $recentCourses,
            ]);
        }

        // 2. Instructor Dashboard
        if (in_array('instructor', $roles)) {
            $myCourses = Course::where('instructor_id', $user->id)
                ->with(['category:id,name'])
                ->withCount(['enrollments', 'modules'])
                ->get();

            $courseIds = $myCourses->pluck('id');

            $totalStudents = Enrollment::whereIn('course_id', $courseIds)->count();
            $activeStudents = Enrollment::whereIn('course_id', $courseIds)->where('status', 'active')->count();
            $notStarted = Enrollment::whereIn('course_id', $courseIds)->where('progress_percentage', '<=', 0)->count();
            
            $avgProgress = Enrollment::whereIn('course_id', $courseIds)->avg('progress_percentage') ?? 0;

            $quizIds = Course::whereIn('id', $courseIds)->with('quizzes')->get()->flatMap->quizzes->pluck('id');
            $avgQuizScore = QuizAttempt::whereIn('quiz_id', $quizIds)->avg('score') ?? 0;

            $assignmentIds = Course::whereIn('id', $courseIds)->with('assignments')->get()->flatMap->assignments->pluck('id');
            $pendingAssignments = AssignmentSubmission::whereIn('assignment_id', $assignmentIds)
                ->whereNull('grade')
                ->with(['user:id,name,email', 'assignment:id,title,max_score'])
                ->latest()
                ->get();

            return Inertia::render('Dashboard/InstructorDashboard', [
                'stats' => [
                    'totalCourses' => $myCourses->count(),
                    'totalStudents' => $totalStudents,
                    'activeStudents' => $activeStudents,
                    'notStarted' => $notStarted,
                    'avgProgress' => round($avgProgress, 1),
                    'avgQuizScore' => round($avgQuizScore, 1),
                    'pendingCount' => $pendingAssignments->count(),
                ],
                'courses' => $myCourses,
                'pendingSubmissions' => $pendingAssignments,
            ]);
        }

        // 3. Student Dashboard (Default)
        $enrollments = Enrollment::where('user_id', $user->id)
            ->with(['course.instructor:id,name', 'course.category:id,name'])
            ->get();

        $activeEnrollments = $enrollments->where('status', 'active')->values();
        $completedEnrollments = $enrollments->where('status', 'completed')->values();

        // Primary "Continue Learning" course
        $continueLearning = $activeEnrollments->first();

        // Upcoming assignments
        $enrolledCourseIds = $enrollments->pluck('course_id');
        $upcomingAssignments = Assignment::whereIn('course_id', $enrolledCourseIds)
            ->with('course:id,title')
            ->where('due_date', '>=', now())
            ->orderBy('due_date', 'asc')
            ->take(5)
            ->get();

        $recentGrades = AssignmentSubmission::where('user_id', $user->id)
            ->whereNotNull('grade')
            ->with('assignment:id,title,max_score')
            ->latest('graded_at')
            ->take(5)
            ->get();

        $certificates = Certificate::where('user_id', $user->id)
            ->with('course:id,title')
            ->latest('issued_at')
            ->get();

        return Inertia::render('Dashboard/StudentDashboard', [
            'continueLearning' => $continueLearning,
            'activeCourses' => $activeEnrollments,
            'completedCourses' => $completedEnrollments,
            'upcomingAssignments' => $upcomingAssignments,
            'recentGrades' => $recentGrades,
            'certificates' => $certificates,
        ]);
    }
}
