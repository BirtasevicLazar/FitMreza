<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Log;

class TrainerController extends Controller
{
    public function featured()
    {
        try {
            $trainers = User::where('type', 'trainer')
                ->where('is_active', true)
                ->with('trainerDetails')
                ->inRandomOrder()
                ->take(6)
                ->get();

            // Log za debugging
            Log::info('Featured trainers:', [
                'count' => $trainers->count(),
                'sample_trainer' => $trainers->first() ? [
                    'id' => $trainers->first()->id,
                    'name' => $trainers->first()->name,
                    'profile_image' => $trainers->first()->profile_image,
                    'profile_image_url' => $trainers->first()->profile_image_url,
                ] : null
            ]);

            return response()->json([
                'status' => 'success',
                'trainers' => $trainers->map(function ($trainer) {
                    return [
                        'id' => $trainer->id,
                        'name' => $trainer->name,
                        'profile_image' => $trainer->profile_image,
                        'profile_image_url' => $trainer->profile_image_url,
                        'cover_image_url' => $trainer->cover_image_url,
                        'trainer_details' => $trainer->trainerDetails
                    ];
                })
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            Log::error('Error in featured trainers:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch featured trainers',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
} 