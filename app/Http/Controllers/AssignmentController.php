<?php

namespace App\Http\Controllers;

use App\Models\Assignment;
use App\Models\AssignmentSubmission;
use App\Services\ProgressTrackingService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AssignmentController extends Controller
{
    public function show(Assignment $assignment, Request $request): Response
    {
        $assignment->load(['course:id,title,slug']);
        $user = $request->user();

        $submission = AssignmentSubmission::where('user_id', $user->id)
            ->where('assignment_id', $assignment->id)
            ->first();

        return Inertia::render('Assignment/Show', [
            'assignment' => $assignment,
            'submission' => $submission,
        ]);
    }

    public function submit(Assignment $assignment, Request $request, ProgressTrackingService $progressService): RedirectResponse
    {
        $request->validate([
            'notes' => 'nullable|string',
            'submission_file_url' => 'nullable|string',
        ]);

        $user = $request->user();

        AssignmentSubmission::updateOrCreate(
            [
                'assignment_id' => $assignment->id,
                'user_id' => $user->id,
            ],
            [
                'notes' => $request->notes,
                'submission_file_url' => $request->submission_file_url ?? 'https://example.com/submission-doc.pdf',
                'submitted_at' => now(),
            ]
        );

        return redirect()->route('courses.learn', ['slug' => $assignment->course->slug])
            ->with('success', 'Tugas berhasil dikumpulkan dan menunggu review pengajar!');
    }

    public function grade(AssignmentSubmission $submission, Request $request, ProgressTrackingService $progressService): RedirectResponse
    {
        $request->validate([
            'grade' => 'required|numeric|min:0|max:100',
            'feedback' => 'nullable|string',
        ]);

        $submission->update([
            'grade' => $request->grade,
            'feedback' => $request->feedback,
            'graded_by' => $request->user()->id,
            'graded_at' => now(),
        ]);

        // Recalculate progress for the student
        $assignment = $submission->assignment;
        $progressService->recalculateCourseProgress($submission->user, $assignment->course);

        return back()->with('success', 'Nilai tugas berhasil disimpan.');
    }
}
