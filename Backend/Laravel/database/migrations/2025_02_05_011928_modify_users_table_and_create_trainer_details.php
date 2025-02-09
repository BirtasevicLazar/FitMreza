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
        // Modify users table
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone_number')->nullable();
            $table->text('bio')->nullable();
            $table->string('profile_image')->nullable();
            $table->enum('type', ['user', 'trainer'])->default('user');
            $table->boolean('is_active')->default(true);
            $table->timestamp('last_login_at')->nullable();
        });

        // Create trainer_details table
        Schema::create('trainer_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->text('specializations')->nullable();
            $table->text('certifications')->nullable();
            $table->decimal('hourly_rate', 8, 2)->nullable();
            $table->json('working_hours')->nullable();
            $table->integer('years_of_experience')->nullable();
            $table->decimal('rating', 3, 2)->default(0.00);
            $table->integer('rating_count')->default(0);
            $table->boolean('is_verified')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trainer_details');
        
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'phone_number',
                'bio',
                'profile_image',
                'type',
                'is_active',
                'last_login_at'
            ]);
        });
    }
};
