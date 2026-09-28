<?php

namespace App\Http\Controllers;

use App\Models\Certificate;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CertificateController extends Controller
{
    public function index(Request $request): Response
    {
        $certificates = Certificate::where('user_id', $request->user()->id)
            ->with(['course.instructor:id,name'])
            ->latest('issued_at')
            ->get();

        return Inertia::render('Certificates/Index', [
            'certificates' => $certificates,
        ]);
    }

    public function show(string $certificateNumber): Response
    {
        $certificate = Certificate::where('certificate_number', $certificateNumber)
            ->with(['user:id,name', 'course.instructor:id,name'])
            ->firstOrFail();

        return Inertia::render('Certificates/Show', [
            'certificate' => $certificate,
        ]);
    }
}
