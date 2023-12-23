<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Recipe extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'ingredients',
        'instructions',
        'ready_in_minutes',
        'servings',
        'image',
        'user_id',
        'source',
        'id_from_api',
        'nutrition',
        'diets',

    ];



    /**
     * Get the user that owns the recipe.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
