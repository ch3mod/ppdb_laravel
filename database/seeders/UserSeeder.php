<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Jangan dobel kalau seeder dijalankan ulang.
        if (User::where('niy', '2222222')->doesntExist()) {
            User::factory()->create();
        }
    }
}
