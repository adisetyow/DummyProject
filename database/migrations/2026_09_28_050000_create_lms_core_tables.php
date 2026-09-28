<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add extra fields to users
        Schema::table('users', function (Blueprint $table) {
            $table->string('avatar')->nullable()->after('password');
            $table->string('phone')->nullable()->after('avatar');
            $table->text('bio')->nullable()->after('phone');
            $table->string('status')->default('active')->after('bio');
        });

        // 1. Categories
        Schema::create('course_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('icon')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // 2. Courses
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('instructor_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('category_id')->nullable()->constrained('course_categories')->nullOnDelete();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('thumbnail')->nullable();
            $table->text('description')->nullable();
            $table->string('level')->default('beginner'); // beginner, intermediate, advanced
            $table->string('status')->default('draft'); // draft, published, archived
            $table->timestamps();
        });

        // 3. Course Modules (Sections)
        Schema::create('course_modules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained('courses')->onDelete('cascade');
            $table->string('title');
            $table->text('description')->nullable();
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        // 4. Lessons (Materi)
        Schema::create('lessons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('module_id')->constrained('course_modules')->onDelete('cascade');
            $table->string('title');
            $table->string('slug');
            $table->string('content_type')->default('text'); // video, pdf, text, embed
            $table->longText('content_body')->nullable();
            $table->string('content_url')->nullable();
            $table->integer('duration_minutes')->default(0);
            $table->boolean('is_preview')->default(false);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        // 5. Enrollments
        Schema::create('enrollments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('course_id')->constrained('courses')->onDelete('cascade');
            $table->timestamp('enrolled_at')->useCurrent();
            $table->string('status')->default('active'); // active, completed, dropped
            $table->decimal('progress_percentage', 5, 2)->default(0.00);
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'course_id']);
        });

        // 6. Lesson Progress
        Schema::create('lesson_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('lesson_id')->constrained('lessons')->onDelete('cascade');
            $table->string('status')->default('completed'); // completed
            $table->timestamp('completed_at')->useCurrent();
            $table->timestamps();

            $table->unique(['user_id', 'lesson_id']);
        });

        // 7. Quizzes
        Schema::create('quizzes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained('courses')->onDelete('cascade');
            $table->foreignId('module_id')->nullable()->constrained('course_modules')->nullOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->integer('passing_score')->default(70);
            $table->integer('time_limit_minutes')->default(30);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        // 8. Quiz Questions
        Schema::create('quiz_questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('quiz_id')->constrained('quizzes')->onDelete('cascade');
            $table->text('question_text');
            $table->string('question_type')->default('multiple_choice'); // multiple_choice, essay
            $table->integer('points')->default(10);
            $table->json('options')->nullable(); // array of choice options e.g. [{"id": "A", "text": "Option 1"}]
            $table->text('answer_key')->nullable(); // correct option ID or answer text
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        // 9. Quiz Attempts
        Schema::create('quiz_attempts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('quiz_id')->constrained('quizzes')->onDelete('cascade');
            $table->decimal('score', 5, 2)->default(0.00);
            $table->boolean('is_passed')->default(false);
            $table->json('answers')->nullable();
            $table->timestamp('started_at')->useCurrent();
            $table->timestamp('finished_at')->nullable();
            $table->timestamps();
        });

        // 10. Assignments
        Schema::create('assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained('courses')->onDelete('cascade');
            $table->foreignId('module_id')->nullable()->constrained('course_modules')->nullOnDelete();
            $table->string('title');
            $table->text('instructions');
            $table->timestamp('due_date')->nullable();
            $table->integer('max_score')->default(100);
            $table->string('file_attachment_url')->nullable();
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        // 11. Assignment Submissions
        Schema::create('assignment_submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('assignment_id')->constrained('assignments')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('submission_file_url')->nullable();
            $table->text('notes')->nullable();
            $table->decimal('grade', 5, 2)->nullable();
            $table->text('feedback')->nullable();
            $table->foreignId('graded_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('submitted_at')->useCurrent();
            $table->timestamp('graded_at')->nullable();
            $table->timestamps();
        });

        // 12. Assessments
        Schema::create('assessments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('enrollment_id')->constrained('enrollments')->onDelete('cascade');
            $table->decimal('final_grade', 5, 2);
            $table->string('letter_grade', 5)->default('A');
            $table->text('notes')->nullable();
            $table->timestamp('evaluated_at')->useCurrent();
            $table->timestamps();
        });

        // 13. Certificates
        Schema::create('certificates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('course_id')->constrained('courses')->onDelete('cascade');
            $table->string('certificate_number')->unique();
            $table->string('file_url')->nullable();
            $table->timestamp('issued_at')->useCurrent();
            $table->timestamps();

            $table->unique(['user_id', 'course_id']);
        });

        // 14. Discussions
        Schema::create('discussions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained('courses')->onDelete('cascade');
            $table->foreignId('lesson_id')->nullable()->constrained('lessons')->nullOnDelete();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('parent_id')->nullable()->constrained('discussions')->onDelete('cascade');
            $table->text('comment');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('discussions');
        Schema::dropIfExists('certificates');
        Schema::dropIfExists('assessments');
        Schema::dropIfExists('assignment_submissions');
        Schema::dropIfExists('assignments');
        Schema::dropIfExists('quiz_attempts');
        Schema::dropIfExists('quiz_questions');
        Schema::dropIfExists('quizzes');
        Schema::dropIfExists('lesson_progress');
        Schema::dropIfExists('enrollments');
        Schema::dropIfExists('lessons');
        Schema::dropIfExists('course_modules');
        Schema::dropIfExists('courses');
        Schema::dropIfExists('course_categories');

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['avatar', 'phone', 'bio', 'status']);
        });
    }
};
