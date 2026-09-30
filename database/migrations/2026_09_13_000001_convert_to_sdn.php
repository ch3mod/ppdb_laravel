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
        $this->dropColumnsIfExists('peserta_ppdb', [
            'jurusan_id',
            'rekomendasi_mwc',
            'bertindik',
            'bertato',
        ]);

        $this->dropColumnsIfExists('ukuran_seragam', [
            'jas',
            'peci',
            'seragam_praktik',
            'jas_almamater',
            'kaos_bintalsik',
            'kegiatan_bintalsik',
        ]);

        Schema::dropIfExists('jurusan');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::create('jurusan', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->string('abbreviation');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::table('peserta_ppdb', function (Blueprint $table) {
            $table->integer('jurusan_id')->nullable();
            $table->boolean('rekomendasi_mwc')->default(0);
            $table->boolean('bertindik')->default(false);
            $table->boolean('bertato')->default(false);
        });

        Schema::table('ukuran_seragam', function (Blueprint $table) {
            $table->string('jas', 3)->nullable();
            $table->string('peci', 3)->nullable();
            $table->boolean('seragam_praktik')->default(false);
            $table->boolean('jas_almamater')->default(false);
            $table->boolean('kaos_bintalsik')->default(false);
            $table->boolean('kegiatan_bintalsik')->default(false);
        });
    }

    /**
     * @param  array<int, string>  $columns
     */
    private function dropColumnsIfExists(string $table, array $columns): void
    {
        $existing = array_values(array_filter(
            $columns,
            fn (string $column): bool => Schema::hasColumn($table, $column)
        ));

        if ($existing === []) {
            return;
        }

        Schema::table($table, function (Blueprint $table) use ($existing) {
            $table->dropColumn($existing);
        });
    }
};
