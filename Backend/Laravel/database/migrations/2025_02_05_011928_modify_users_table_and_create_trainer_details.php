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
            $table->enum('type', ['user', 'trainer'])->default('user');
            $table->boolean('is_active')->default(true);
        });

        // Create trainer_details table
        Schema::create('trainer_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->text('specializations');
            $table->text('certifications');
            $table->text('bio')->nullable();
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
            $table->dropColumn(['phone_number', 'type', 'is_active']);
        });
    }
};
