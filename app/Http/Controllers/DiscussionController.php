<?php

namespace App\Http\Controllers;

use App\Models\Discussion;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class DiscussionController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'course_id' => 'required|exists:courses,id',
            'lesson_id' => 'nullable|exists:lessons,id',
            'parent_id' => 'nullable|exists:discussions,id',
            'comment' => 'required|string|max:1000',
        ]);

        Discussion::create([
            'course_id' => $request->course_id,
            'lesson_id' => $request->lesson_id,
            'parent_id' => $request->parent_id,
            'user_id' => $request->user()->id,
            'comment' => $request->comment,
        ]);

        return back()->with('success', 'Komentar diskusi berhasil dikirim.');
    }
}
