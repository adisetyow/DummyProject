<?php

namespace App\Http\Controllers;

use App\Models\Quiz;
use App\Models\QuizAttempt;
use App\Services\ProgressTrackingService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class QuizController extends Controller
{
    public function show(Quiz $quiz, Request $request): Response
    {
        $quiz->load(['questions', 'course:id,title,slug']);
        $user = $request->user();

        $latestAttempt = QuizAttempt::where('user_id', $user->id)
            ->where('quiz_id', $quiz->id)
            ->latest()
            ->first();

        return Inertia::render('Quiz/Show', [
            'quiz' => $quiz,
            'latestAttempt' => $latestAttempt,
        ]);
    }

    public function submit(Quiz $quiz, Request $request, ProgressTrackingService $progressService): RedirectResponse
    {
        $user = $request->user();
        $answers = $request->input('answers', []); // [question_id => selected_option_id]

        $quiz->load('questions', 'course');
        $totalQuestions = $quiz->questions->count();
        $correctCount = 0;

        foreach ($quiz->questions as $question) {
            $userAns = $answers[$question->id] ?? null;
            if ($userAns && strtoupper($userAns) === strtoupper($question->answer_key)) {
                $correctCount++;
            }
        }

        $score = $totalQuestions > 0 ? round(($correctCount / $totalQuestions) * 100, 2) : 0;
        $isPassed = $score >= $quiz->passing_score;

        $attempt = QuizAttempt::create([
            'user_id' => $user->id,
            'quiz_id' => $quiz->id,
            'score' => $score,
            'is_passed' => $isPassed,
            'answers' => $answers,
            'started_at' => now()->subMinutes(5),
            'finished_at' => now(),
        ]);

        // Recalculate progress
        $progressService->recalculateCourseProgress($user, $quiz->course);

        $msg = $isPassed
            ? "Selamat! Anda lulus kuis dengan nilai {$score}."
            : "Nilai Anda {$score}. Nilai kelulusan minimal adalah {$quiz->passing_score}. Silakan coba lagi.";

        return redirect()->route('courses.learn', ['slug' => $quiz->course->slug])
            ->with($isPassed ? 'success' : 'error', $msg);
    }
}
