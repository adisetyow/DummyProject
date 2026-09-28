<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\CourseCategory;
use App\Models\CourseModule;
use App\Models\Lesson;
use App\Models\Quiz;
use App\Models\QuizQuestion;
use App\Models\Assignment;
use App\Models\User;
use App\Services\ProgressTrackingService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create Roles
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $instructorRole = Role::firstOrCreate(['name' => 'instructor']);
        $studentRole = Role::firstOrCreate(['name' => 'student']);

        // 2. Create Users
        $admin = User::firstOrCreate(
            ['email' => 'admin@lms.test'],
            [
                'name' => 'Administrator LMS',
                'password' => Hash::make('password'),
                'status' => 'active',
                'bio' => 'Super Administrator of LMS E-Learning System.',
            ]
        );
        $admin->assignRole($adminRole);

        $instructor = User::firstOrCreate(
            ['email' => 'instructor@lms.test'],
            [
                'name' => 'Budi Santoso, M.Pd.',
                'password' => Hash::make('password'),
                'status' => 'active',
                'bio' => 'Senior Instructor & Ahli Kebijakan Ketenagakerjaan.',
            ]
        );
        $instructor->assignRole($instructorRole);

        $student = User::firstOrCreate(
            ['email' => 'student@lms.test'],
            [
                'name' => 'Adi Setyo',
                'password' => Hash::make('password'),
                'status' => 'active',
                'bio' => 'Peserta Pelatihan Antarkerja.',
            ]
        );
        $student->assignRole($studentRole);

        $student2 = User::firstOrCreate(
            ['email' => 'student2@lms.test'],
            [
                'name' => 'Rina Wijaya',
                'password' => Hash::make('password'),
                'status' => 'active',
                'bio' => 'Peserta Pelatihan Digital.',
            ]
        );
        $student2->assignRole($studentRole);

        // 3. Create Categories
        $catPengantarKerja = CourseCategory::firstOrCreate(
            ['slug' => 'pengantar-kerja'],
            [
                'name' => 'Pengantar Kerja & Regulasi',
                'icon' => 'Briefcase',
                'description' => 'Pelatihan kompetensi pelayanan antarkerja dan kebijakan ketenagakerjaan.',
            ]
        );

        $catWebDev = CourseCategory::firstOrCreate(
            ['slug' => 'web-development'],
            [
                'name' => 'Web Development',
                'icon' => 'Code',
                'description' => 'Kursus pengembangan aplikasi web modern dengan Laravel dan React.',
            ]
        );

        // 4. Create Main Course: Dasar-Dasar Pengantar Kerja
        $course = Course::firstOrCreate(
            ['slug' => 'dasar-dasar-pengantar-kerja'],
            [
                'instructor_id' => $instructor->id,
                'category_id' => $catPengantarKerja->id,
                'title' => 'Dasar-Dasar Pengantar Kerja',
                'thumbnail' => 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop',
                'description' => 'Program pelatihan komprehensif bagi petugas dan praktisi layanan penempatan tenaga kerja dalam memahami regulasi, standar pelayanan, dan studi kasus penanganan pencari kerja.',
                'level' => 'beginner',
                'status' => 'published',
            ]
        );

        // Course 2 for variety
        $course2 = Course::firstOrCreate(
            ['slug' => 'fullstack-laravel-react'],
            [
                'instructor_id' => $instructor->id,
                'category_id' => $catWebDev->id,
                'title' => 'Membangun Aplikasi Fullstack Modern Laravel 12 & React',
                'thumbnail' => 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=800&auto=format&fit=crop',
                'description' => 'Pelajari cara membangun aplikasi web skalabel dan interaktif menggunakan ekosistem Laravel, React Inertia, dan Tailwind CSS.',
                'level' => 'intermediate',
                'status' => 'published',
            ]
        );

        // 5. Create Modules & Lessons for Course 1
        // Modul 1 — Pengantar
        $m1 = CourseModule::firstOrCreate(
            ['course_id' => $course->id, 'sort_order' => 1],
            ['title' => 'Modul 1 — Pengantar & Konsep Dasar Antarkerja', 'description' => 'Pengenalan peran serta tanggung jawab pengantar kerja.']
        );
        $l1 = Lesson::firstOrCreate(
            ['module_id' => $m1->id, 'sort_order' => 1],
            [
                'title' => 'Mengenal Profesi Pengantar Kerja',
                'slug' => 'mengenal-profesi-pengantar-kerja',
                'content_type' => 'video',
                'content_url' => 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                'content_body' => 'Video pengantar tentang fungsi, etika, dan peran strategis pejabat fungsional pengantar kerja dalam mempertemukan pencari kerja dengan pemberi kerja.',
                'duration_minutes' => 15,
                'is_preview' => true,
            ]
        );

        // Modul 2 — Regulasi
        $m2 = CourseModule::firstOrCreate(
            ['course_id' => $course->id, 'sort_order' => 2],
            ['title' => 'Modul 2 — Regulasi Ketenagakerjaan', 'description' => 'Dasar hukum dan aturan undang-undang terkait penempatan naker.']
        );
        $l2 = Lesson::firstOrCreate(
            ['module_id' => $m2->id, 'sort_order' => 1],
            [
                'title' => 'Kerangka Regulasi dan Kebijakan Pelayanan Antarkerja',
                'slug' => 'kerangka-regulasi-dan-kebijakan',
                'content_type' => 'text',
                'content_body' => 'Penjelasan mendalam mengenai UU Ketenagakerjaan, PP terkait penempatan tenaga kerja dalam dan luar negeri, serta perlindungan hak tenaga kerja.',
                'duration_minutes' => 20,
            ]
        );

        // Modul 3 — Proses Pelayanan
        $m3 = CourseModule::firstOrCreate(
            ['course_id' => $course->id, 'sort_order' => 3],
            ['title' => 'Modul 3 — Proses Pelayanan & Konseling', 'description' => 'Teknik wawancara, asesmen pencari kerja, dan job matching.']
        );
        $l3 = Lesson::firstOrCreate(
            ['module_id' => $m3->id, 'sort_order' => 1],
            [
                'title' => 'Standar Prosedur Operasional Konseling Kerja',
                'slug' => 'standar-prosedur-konseling-kerja',
                'content_type' => 'text',
                'content_body' => 'Langkah-langkah praktis dalam melakukan wawancara mendalam, identifikasi minat bakat, serta pemetaan lowongan kerja yang relevan.',
                'duration_minutes' => 25,
            ]
        );

        // Modul 4 — Studi Kasus
        $m4 = CourseModule::firstOrCreate(
            ['course_id' => $course->id, 'sort_order' => 4],
            ['title' => 'Modul 4 — Studi Kasus Penanganan Lapangan', 'description' => 'Analisis skenario riil penempatan tenaga kerja lokal & antardaerah.']
        );
        $l4 = Lesson::firstOrCreate(
            ['module_id' => $m4->id, 'sort_order' => 1],
            [
                'title' => 'Simulasi Penyelesaian Hambatan Penempatan Kerja',
                'slug' => 'simulasi-penyelesaian-hambatan',
                'content_type' => 'text',
                'content_body' => 'Studi kasus tentang mismatch keterampilan (skill mismatch), negosiasi upah, dan adaptasi kultural tenaga kerja baru.',
                'duration_minutes' => 30,
            ]
        );

        // Quiz for Course 1
        $quiz = Quiz::firstOrCreate(
            ['course_id' => $course->id],
            [
                'module_id' => $m4->id,
                'title' => 'Kuis Evaluasi Pemahaman Modul 1-4',
                'description' => 'Uji pemahaman materi konsep, regulasi, dan prosedur antarkerja.',
                'passing_score' => 75,
                'time_limit_minutes' => 20,
            ]
        );

        QuizQuestion::firstOrCreate(
            ['quiz_id' => $quiz->id, 'question_text' => 'Apa tujuan utama dari pelayanan antarkerja?'],
            [
                'question_type' => 'multiple_choice',
                'points' => 50,
                'options' => [
                    ['id' => 'A', 'text' => 'Mempertemukan pencari kerja dan pemberi kerja sesuai kompetensi'],
                    ['id' => 'B', 'text' => 'Menarik retribusi jasa perantara'],
                    ['id' => 'C', 'text' => 'Memaksa perusahaan menerima seluruh pelamar'],
                    ['id' => 'D', 'text' => 'Menghapus sistem kontrak kerja'],
                ],
                'answer_key' => 'A',
                'sort_order' => 1,
            ]
        );

        QuizQuestion::firstOrCreate(
            ['quiz_id' => $quiz->id, 'question_text' => 'Faktor apa yang paling krusial saat melakukan konseling pencari kerja?'],
            [
                'question_type' => 'multiple_choice',
                'points' => 50,
                'options' => [
                    ['id' => 'A', 'text' => 'Memahami minat, bakat, riwayat pendidikan, dan kompetensi kandidat'],
                    ['id' => 'B', 'text' => 'Menentukan gaji secara sepihak'],
                    ['id' => 'C', 'text' => 'Menyuruh kandidat memilih sembarang pekerjaan'],
                    ['id' => 'D', 'text' => 'Menghindari sesi tanya jawab'],
                ],
                'answer_key' => 'A',
                'sort_order' => 2,
            ]
        );

        // Modul 5 — Evaluasi Akhir & Assignment
        $m5 = CourseModule::firstOrCreate(
            ['course_id' => $course->id, 'sort_order' => 5],
            ['title' => 'Modul 5 — Evaluasi Akhir & Sertifikasi', 'description' => 'Pengumpulan tugas akhir dan penerbitan sertifikat kelulusan.']
        );
        $l5 = Lesson::firstOrCreate(
            ['module_id' => $m5->id, 'sort_order' => 1],
            [
                'title' => 'Rangkuman & Pedoman Tugas Akhir',
                'slug' => 'rangkuman-dan-pedoman-tugas',
                'content_type' => 'text',
                'content_body' => 'Rangkuman seluruh kompetensi dan instruksi pengerjaan studi kasus mandiri sebagai syarat kelulusan.',
                'duration_minutes' => 15,
            ]
        );

        $assignment = Assignment::firstOrCreate(
            ['course_id' => $course->id],
            [
                'module_id' => $m5->id,
                'title' => 'Tugas Studi Kasus: Rencana Intervensi Konseling Kerja',
                'instructions' => 'Buatlah dokumen analisis 2-3 halaman mengenai strategi penempatan tenaga kerja muda pada sektor industri manufaktur di daerah Anda.',
                'due_date' => now()->addDays(7),
                'max_score' => 100,
            ]
        );

        // 6. Simulate Student (Adi Setyo) Learning Progress matching the user prompt:
        // Modul 1, 2, 3 Selesai -> 65% progress!
        $progressService = app(ProgressTrackingService::class);
        $progressService->completeLesson($student, $l1);
        $progressService->completeLesson($student, $l2);
        $progressService->completeLesson($student, $l3);

        // Enroll student2 as well
        $progressService->recalculateCourseProgress($student2, $course);
    }
}
