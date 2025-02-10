<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TrainerDetails extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'specializations',
        'certifications',
        'bio'
    ];

    protected $casts = [
        'working_hours' => 'json',
        'hourly_rate' => 'decimal:2',
        'rating' => 'decimal:2',
        'is_verified' => 'boolean'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function updateRating($newRating)
    {
        $this->rating = (($this->rating * $this->rating_count) + $newRating) / ($this->rating_count + 1);
        $this->rating_count++;
        $this->save();
    }
}
