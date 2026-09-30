<?php

namespace Database\Seeders;

use App\Models\PpdbSetting;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call([
            UserSeeder::class,
            PesertaPPDBSeeder::class,
        ]);

        PpdbSetting::query()->updateOrCreate([], [
            'body' => json_encode([
                'batas_akhir_ppdb' => now(),
                'no_surat' => '421.2/247/SDN-PG02/2026',
                'hasil_akhir' => now(),
            ]),
        ]);
        // \App\Models\User::factory(10)->create();
    }
}
