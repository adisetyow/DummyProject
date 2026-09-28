<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Assessment extends Model
{
    use HasFactory;

    protected $fillable = [
        'enrollment_id',
        'final_grade',
        'letter_grade',
        'notes',
        'evaluated_at',
    ];

    protected function casts(): array
    {
        return [
            'final_grade' => 'float',
            'evaluated_at' => 'datetime',
        ];
    }

    public function enrollment(): BelongsTo
    {
        return $this->belongsTo(Enrollment::class);
    }
}
