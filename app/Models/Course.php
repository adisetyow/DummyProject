<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Course extends Model
{
    use HasFactory;

    protected $fillable = [
        'instructor_id',
        'category_id',
        'title',
        'slug',
        'thumbnail',
        'description',
        'level',
        'status',
    ];

    public function instructor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'instructor_id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(CourseCategory::class, 'category_id');
    }

    public function modules(): HasMany
    {
        return $this->hasMany(CourseModule::class)->orderBy('sort_order', 'asc');
    }

    public function lessons(): HasManyThrough
    {
        return $this->hasManyThrough(Lesson::class, CourseModule::class, 'course_id', 'module_id');
    }

    public function quizzes(): HasMany
    {
        return $this->hasMany(Quiz::class)->orderBy('sort_order', 'asc');
    }

    public function assignments(): HasMany
    {
        return $this->hasMany(Assignment::class)->orderBy('sort_order', 'asc');
    }

    public function enrollments(): HasMany
    {
        return $this->hasMany(Enrollment::class);
    }

    public function certificates(): HasMany
    {
        return $this->hasMany(Certificate::class);
    }

    public function discussions(): HasMany
    {
        return $this->hasMany(Discussion::class);
    }
}
