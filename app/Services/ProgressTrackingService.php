<?php

namespace App\Services;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Lesson;
use App\Models\LessonProgress;
use App\Models\QuizAttempt;
use App\Models\AssignmentSubmission;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class ProgressTrackingService
{
    /**
     * Mark a lesson as completed for a user and recalculate course progress.
     */
    public function completeLesson(User $user, Lesson $lesson): Enrollment
    {
        return DB::transaction(function () use ($user, $lesson) {
            // Record or update lesson progress
            LessonProgress::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'lesson_id' => $lesson->id,
                ],
                [
                    'status' => 'completed',
                    'completed_at' => now(),
                ]
            );

            // Get course via module
            $course = $lesson->module->course;

            return $this->recalculateCourseProgress($user, $course);
        });
    }

    /**
     * Recalculate total course progress percentage for an enrolled user.
     */
    public function recalculateCourseProgress(User $user, Course $course): Enrollment
    {
        $enrollment = Enrollment::firstOrCreate(
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

        // Calculate total lessons in course
        $totalLessons = Lesson::whereHas('module', function ($q) use ($course) {
            $q->where('course_id', $course->id);
        })->count();

        // Calculate completed lessons
        $completedLessons = LessonProgress::where('user_id', $user->id)
            ->where('status', 'completed')
            ->whereHas('lesson.module', function ($q) use ($course) {
                $q->where('course_id', $course->id);
            })->count();

        // Total quizzes
        $totalQuizzes = $course->quizzes()->count();
        $passedQuizzes = QuizAttempt::where('user_id', $user->id)
            ->where('is_passed', true)
            ->whereIn('quiz_id', $course->quizzes()->pluck('id'))
            ->distinct('quiz_id')
            ->count('quiz_id');

        // Total assignments
        $totalAssignments = $course->assignments()->count();
        $submittedAssignments = AssignmentSubmission::where('user_id', $user->id)
            ->whereNotNull('grade')
            ->whereIn('assignment_id', $course->assignments()->pluck('id'))
            ->distinct('assignment_id')
            ->count('assignment_id');

        $totalItems = $totalLessons + $totalQuizzes + $totalAssignments;
        $completedItems = $completedLessons + $passedQuizzes + $submittedAssignments;

        $percentage = $totalItems > 0 ? round(($completedItems / $totalItems) * 100, 2) : 100.00;
        if ($percentage > 100.00) {
            $percentage = 100.00;
        }

        $enrollment->progress_percentage = $percentage;

        if ($percentage >= 100.00 && $enrollment->status !== 'completed') {
            $enrollment->status = 'completed';
            $enrollment->completed_at = now();

            // Auto issue certificate
            app(CertificateService::class)->issueCertificate($user, $course);
        }

        $enrollment->save();

        return $enrollment;
    }

    /**
     * Get learning path with lock/unlock status for each module and lesson.
     */
    public function getCourseLearningPath(User $user, Course $course): array
    {
        $course->load(['modules.lessons', 'modules.quizzes', 'modules.assignments', 'quizzes', 'assignments']);
        
        $completedLessonIds = LessonProgress::where('user_id', $user->id)
            ->where('status', 'completed')
            ->pluck('lesson_id')
            ->toArray();

        $passedQuizIds = QuizAttempt::where('user_id', $user->id)
            ->where('is_passed', true)
            ->pluck('quiz_id')
            ->toArray();

        $gradedAssignmentIds = AssignmentSubmission::where('user_id', $user->id)
            ->whereNotNull('grade')
            ->pluck('assignment_id')
            ->toArray();

        $modulesData = [];
        $previousItemCompleted = true; // First item is always unlocked

        foreach ($course->modules as $module) {
            $lessonsData = [];

            foreach ($module->lessons as $lesson) {
                $isCompleted = in_array($lesson->id, $completedLessonIds);
                $isLocked = !$previousItemCompleted && !$lesson->is_preview;

                $lessonsData[] = [
                    'id' => $lesson->id,
                    'title' => $lesson->title,
                    'slug' => $lesson->slug,
                    'content_type' => $lesson->content_type,
                    'duration_minutes' => $lesson->duration_minutes,
                    'is_preview' => $lesson->is_preview,
                    'sort_order' => $lesson->sort_order,
                    'is_completed' => $isCompleted,
                    'is_locked' => $isLocked,
                ];

                $previousItemCompleted = $isCompleted;
            }

            $modulesData[] = [
                'id' => $module->id,
                'title' => $module->title,
                'description' => $module->description,
                'sort_order' => $module->sort_order,
                'lessons' => $lessonsData,
            ];
        }

        return [
            'modules' => $modulesData,
            'completed_lesson_ids' => $completedLessonIds,
            'passed_quiz_ids' => $passedQuizIds,
            'graded_assignment_ids' => $gradedAssignmentIds,
        ];
    }
}
