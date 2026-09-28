<?php

namespace App\Services;

use App\Models\Certificate;
use App\Models\Course;
use App\Models\User;
use Illuminate\Support\Str;

class CertificateService
{
    /**
     * Issue an automated certificate for a user when completing a course.
     */
    public function issueCertificate(User $user, Course $course): Certificate
    {
        $existing = Certificate::where('user_id', $user->id)
            ->where('course_id', $course->id)
            ->first();

        if ($existing) {
            return $existing;
        }

        $certNumber = 'CERT-' . date('Ym') . '-' . strtoupper(Str::random(6));

        return Certificate::create([
            'user_id' => $user->id,
            'course_id' => $course->id,
            'certificate_number' => $certNumber,
            'file_url' => '/certificates/' . $certNumber . '.pdf',
            'issued_at' => now(),
        ]);
    }
}
