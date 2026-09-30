<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Extracurricular extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'description', 'icon', 'color', 'sort_order', 'is_active'];

    protected $casts = ['is_active' => 'boolean'];

    public function photos(): HasMany
    {
        return $this->hasMany(ExtracurricularPhoto::class)->orderBy('sort_order');
    }
}
