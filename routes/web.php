<?php

use App\Http\Controllers\AssignmentController;
use App\Http\Controllers\CertificateController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DiscussionController;
use App\Http\Controllers\Instructor\CourseBuilderController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\QuizController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->route('courses.index');
});

// Course public catalog & details
Route::get('/courses', [CourseController::class, 'index'])->name('courses.index');
Route::get('/courses/{slug}', [CourseController::class, 'show'])->name('courses.show');

// Public certificate verification
Route::get('/certificates/{certificateNumber}', [CertificateController::class, 'show'])->name('certificates.show');

// Authenticated Routes
Route::middleware(['auth'])->group(function () {
    // Dynamic Role Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Course Classroom & Learning Path
    Route::post('/courses/{course}/enroll', [CourseController::class, 'enroll'])->name('courses.enroll');
    Route::get('/courses/{slug}/learn/{lessonSlug?}', [CourseController::class, 'learn'])->name('courses.learn');
    Route::post('/lessons/{lesson}/complete', [CourseController::class, 'completeLesson'])->name('lessons.complete');

    // Quizzes
    Route::get('/quizzes/{quiz}', [QuizController::class, 'show'])->name('quizzes.show');
    Route::post('/quizzes/{quiz}/submit', [QuizController::class, 'submit'])->name('quizzes.submit');

    // Assignments
    Route::get('/assignments/{assignment}', [AssignmentController::class, 'show'])->name('assignments.show');
    Route::post('/assignments/{assignment}/submit', [AssignmentController::class, 'submit'])->name('assignments.submit');
    Route::post('/submissions/{submission}/grade', [AssignmentController::class, 'grade'])->name('submissions.grade');

    // Certificates
    Route::get('/my-certificates', [CertificateController::class, 'index'])->name('certificates.index');

    // Discussions
    Route::post('/discussions', [DiscussionController::class, 'store'])->name('discussions.store');

    // User Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// ─── Instructor Course Builder ────────────────────────────────────────────────
Route::middleware(['auth', 'role:admin|instructor'])
    ->prefix('instructor')
    ->name('instructor.')
    ->group(function () {
        // Courses CRUD
        Route::get('/courses', [CourseBuilderController::class, 'index'])->name('courses.index');
        Route::get('/courses/create', [CourseBuilderController::class, 'create'])->name('courses.create');
        Route::post('/courses', [CourseBuilderController::class, 'store'])->name('courses.store');
        Route::get('/courses/{course}/edit', [CourseBuilderController::class, 'edit'])->name('courses.edit');
        Route::patch('/courses/{course}', [CourseBuilderController::class, 'update'])->name('courses.update');
        Route::delete('/courses/{course}', [CourseBuilderController::class, 'destroy'])->name('courses.destroy');

        // Modules
        Route::post('/courses/{course}/modules', [CourseBuilderController::class, 'storeModule'])->name('modules.store');
        Route::patch('/modules/{module}', [CourseBuilderController::class, 'updateModule'])->name('modules.update');
        Route::delete('/modules/{module}', [CourseBuilderController::class, 'destroyModule'])->name('modules.destroy');

        // Lessons
        Route::post('/modules/{module}/lessons', [CourseBuilderController::class, 'storeLesson'])->name('lessons.store');
        Route::patch('/lessons/{lesson}', [CourseBuilderController::class, 'updateLesson'])->name('lessons.update');
        Route::delete('/lessons/{lesson}', [CourseBuilderController::class, 'destroyLesson'])->name('lessons.destroy');

        // Quizzes
        Route::post('/courses/{course}/quizzes', [CourseBuilderController::class, 'storeQuiz'])->name('quizzes.store');
        Route::patch('/quizzes/{quiz}', [CourseBuilderController::class, 'updateQuiz'])->name('quizzes.update');
        Route::delete('/quizzes/{quiz}', [CourseBuilderController::class, 'destroyQuiz'])->name('quizzes.destroy');
        Route::post('/quizzes/{quiz}/questions', [CourseBuilderController::class, 'storeQuestion'])->name('questions.store');
        Route::delete('/questions/{question}', [CourseBuilderController::class, 'destroyQuestion'])->name('questions.destroy');

        // Assignments
        Route::post('/courses/{course}/assignments', [CourseBuilderController::class, 'storeAssignment'])->name('assignments.store');
        Route::patch('/assignments/{assignment}', [CourseBuilderController::class, 'updateAssignment'])->name('assignments.update');
        Route::delete('/assignments/{assignment}', [CourseBuilderController::class, 'destroyAssignment'])->name('assignments.destroy');
    });

require __DIR__.'/auth.php';
