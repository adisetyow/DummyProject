<?php

use App\Http\Controllers\AssignmentController;
use App\Http\Controllers\CertificateController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DiscussionController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\QuizController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

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

require __DIR__.'/auth.php';
