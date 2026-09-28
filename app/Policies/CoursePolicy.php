<?php

namespace App\Policies;

use App\Models\Course;
use App\Models\User;

class CoursePolicy
{
    /**
     * Only admins or the owning instructor can update a course.
     */
    public function update(User $user, Course $course): bool
    {
        return $user->hasRole('admin') || $user->id === $course->instructor_id;
    }

    /**
     * Only admins or the owning instructor can delete a course.
     */
    public function delete(User $user, Course $course): bool
    {
        return $user->hasRole('admin') || $user->id === $course->instructor_id;
    }

    /**
     * Instructors and admins can create courses.
     */
    public function create(User $user): bool
    {
        return $user->hasRole('admin') || $user->hasRole('instructor');
    }

    /**
     * Anyone can view a published course; owner/admin can view drafts.
     */
    public function view(User $user, Course $course): bool
    {
        if ($course->status === 'published') {
            return true;
        }
        return $user->hasRole('admin') || $user->id === $course->instructor_id;
    }
}
