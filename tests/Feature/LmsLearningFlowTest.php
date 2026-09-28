<?php

namespace Tests\Feature;

use App\Models\Assignment;
use App\Models\AssignmentSubmission;
use App\Models\Course;
use App\Models\CourseCategory;
use App\Models\CourseModule;
use App\Models\Enrollment;
use App\Models\Lesson;
use App\Models\Quiz;
use App\Models\QuizQuestion;
use App\Models\User;
use App\Services\ProgressTrackingService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class LmsLearningFlowTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Role::firstOrCreate(['name' => 'admin']);
        Role::firstOrCreate(['name' => 'instructor']);
        Role::firstOrCreate(['name' => 'student']);
    }

    public function test_student_can_enroll_and_complete_learning_flow(): void
    {
        $instructor = User::factory()->create();
        $instructor->assignRole('instructor');

        $student = User::factory()->create();
        $student->assignRole('student');

        $category = CourseCategory::create([
            'name' => 'Pelatihan Uji',
            'slug' => 'pelatihan-uji',
        ]);

        $course = Course::create([
            'instructor_id' => $instructor->id,
            'category_id' => $category->id,
            'title' => 'Dasar Uji Kompetensi',
            'slug' => 'dasar-uji-kompetensi',
            'status' => 'published',
        ]);

        $module = CourseModule::create([
            'course_id' => $course->id,
            'title' => 'Modul 1: Pengantar',
            'sort_order' => 1,
        ]);

        $lesson = Lesson::create([
            'module_id' => $module->id,
            'title' => 'Materi 1: Pengenalan',
            'slug' => 'materi-1-pengenalan',
            'content_type' => 'text',
            'content_body' => 'Isi materi pengenalan...',
            'sort_order' => 1,
        ]);

        $quiz = Quiz::create([
            'course_id' => $course->id,
            'module_id' => $module->id,
            'title' => 'Kuis 1',
            'passing_score' => 70,
        ]);

        $question = QuizQuestion::create([
            'quiz_id' => $quiz->id,
            'question_text' => 'Apakah testing penting?',
            'question_type' => 'multiple_choice',
            'points' => 100,
            'options' => [
                ['id' => 'A', 'text' => 'Sangat penting'],
                ['id' => 'B', 'text' => 'Tidak penting'],
            ],
            'answer_key' => 'A',
            'sort_order' => 1,
        ]);

        // 1. Student views courses
        $response = $this->actingAs($student)->get('/courses');
        $response->assertStatus(200);

        // 2. Student enrolls in course
        $enrollResponse = $this->actingAs($student)->post("/courses/{$course->id}/enroll");
        $enrollResponse->assertRedirect("/courses/{$course->slug}/learn");
        $this->assertDatabaseHas('enrollments', [
            'user_id' => $student->id,
            'course_id' => $course->id,
        ]);

        // 3. Student completes lesson
        $completeResponse = $this->actingAs($student)->post("/lessons/{$lesson->id}/complete");
        $completeResponse->assertStatus(302);
        $this->assertDatabaseHas('lesson_progress', [
            'user_id' => $student->id,
            'lesson_id' => $lesson->id,
            'status' => 'completed',
        ]);

        // 4. Student takes quiz and passes
        $quizResponse = $this->actingAs($student)->post("/quizzes/{$quiz->id}/submit", [
            'answers' => [
                $question->id => 'A',
            ],
        ]);
        $quizResponse->assertRedirect("/courses/{$course->slug}/learn");
        $this->assertDatabaseHas('quiz_attempts', [
            'user_id' => $student->id,
            'quiz_id' => $quiz->id,
            'is_passed' => true,
        ]);

        // 5. Total items = 1 lesson + 1 quiz = 2 items. Both completed => 100% => Certificate issued!
        $this->assertDatabaseHas('certificates', [
            'user_id' => $student->id,
            'course_id' => $course->id,
        ]);

        $enrollment = Enrollment::where('user_id', $student->id)->where('course_id', $course->id)->first();
        $this->assertEquals(100.0, (float) $enrollment->progress_percentage);
        $this->assertEquals('completed', $enrollment->status);
    }
}
