<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('extracurriculars', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('icon')->default('star');
            $table->string('color')->default('bg-primary');
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        DB::table('extracurriculars')->insert([
            ['name' => 'Pramuka', 'description' => 'Kegiatan kepanduan untuk membentuk karakter dan kemandirian', 'icon' => 'tent', 'color' => 'bg-amber-500', 'sort_order' => 1, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Tahfiz Quran', 'description' => 'Hafalan Al-Quran untuk menumbuhkan kecintaan pada kitab suci', 'icon' => 'book-open', 'color' => 'bg-emerald-600', 'sort_order' => 2, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Karate', 'description' => 'Latihan bela diri untuk disiplin, fokus, dan kepercayaan diri', 'icon' => 'swords', 'color' => 'bg-red-600', 'sort_order' => 3, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
        ]);

        Schema::create('extracurricular_photos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('extracurricular_id')->constrained()->cascadeOnDelete();
            $table->string('path');
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('extracurricular_photos');
        Schema::dropIfExists('extracurriculars');
    }
};
