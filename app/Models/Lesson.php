<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Lesson extends Model
{
    use HasFactory;

    protected $fillable = [
        'module_id',
        'title',
        'slug',
        'content_type',
        'content_body',
        'content_url',
        'duration_minutes',
        'is_preview',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'is_preview' => 'boolean',
            'duration_minutes' => 'integer',
            'sort_order' => 'integer',
        ];
    }

    public function module(): BelongsTo
    {
        return $this->belongsTo(CourseModule::class, 'module_id');
    }

    public function progress(): HasMany
    {
        return $this->hasMany(LessonProgress::class);
    }

    public function discussions(): HasMany
    {
        return $this->hasMany(Discussion::class);
    }
}
