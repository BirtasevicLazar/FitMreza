<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TrainerController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/featured-trainers', [TrainerController::class, 'featured']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/update-profile-image', [AuthController::class, 'updateProfileImage']);
    Route::delete('/remove-profile-image', [AuthController::class, 'removeProfileImage']);
    Route::post('/update-cover-image', [AuthController::class, 'updateCoverImage']);
    Route::delete('/remove-cover-image', [AuthController::class, 'removeCoverImage']);
}); 