<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Facades\Storage;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone_number',
        'type',
        'is_active',
        'profile_image',
        'cover_image'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'is_active' => 'boolean',
    ];

    protected $with = ['trainerDetails'];

    protected $appends = ['profile_image_url', 'cover_image_url'];

    public function getProfileImageUrlAttribute()
    {
        if (!$this->profile_image) {
            // Koristimo placeholder servis za default sliku
            return 'https://ui-avatars.com/api/?name=' . urlencode($this->name) . '&background=4F46E5&color=fff';
        }
        return url("storage/{$this->profile_image}");
    }

    public function getCoverImageUrlAttribute()
    {
        if (!$this->cover_image) {
            // Koristimo placeholder za cover sliku
            return 'https://placehold.co/1920x400/4F46E5/ffffff';
        }
        return url("storage/{$this->cover_image}");
    }

    public function trainerDetails()
    {
        return $this->hasOne(TrainerDetails::class);
    }

    public function isTrainer()
    {
        return $this->type === 'trainer';
    }
}
