<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExtracurricularPhoto extends Model
{
    use HasFactory;

    protected $fillable = ['extracurricular_id', 'path', 'sort_order'];

    public function extracurricular(): BelongsTo
    {
        return $this->belongsTo(Extracurricular::class);
    }
}
