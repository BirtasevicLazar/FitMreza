<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\TrainerDetails;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;
use App\Services\ImageService;

class AuthController extends Controller
{
    protected $imageService;

    public function __construct(ImageService $imageService)
    {
        $this->imageService = $imageService;
    }

    public function register(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => ['required', 'confirmed', Password::min(8)
                    ->mixedCase()
                    ->numbers()
                    ->symbols()],
                'phone_number' => 'nullable|string|max:20',
                'type' => 'required|in:user,trainer',
                'specializations' => 'required_if:type,trainer|nullable|string|max:500',
                'certifications' => 'required_if:type,trainer|nullable|string|max:500',
                'bio' => 'required_if:type,trainer|nullable|string|max:1000',
                'profile_image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
                'cover_image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], Response::HTTP_UNPROCESSABLE_ENTITY);
            }

            DB::beginTransaction();

            try {
                $profileImagePath = null;
                if ($request->hasFile('profile_image')) {
                    $profileImagePath = $this->imageService->optimizeAndStore(
                        $request->file('profile_image'),
                        'profile-images'
                    );
                }

                $coverImagePath = null;
                if ($request->hasFile('cover_image')) {
                    $coverImagePath = $this->imageService->optimizeAndStore(
                        $request->file('cover_image'),
                        'cover-images'
                    );
                }

                $user = User::create([
                    'name' => $request->name,
                    'email' => $request->email,
                    'password' => Hash::make($request->password),
                    'phone_number' => $request->phone_number,
                    'type' => $request->type,
                    'profile_image' => $profileImagePath,
                    'cover_image' => $coverImagePath,
                    'is_active' => true
                ]);

                if ($request->type === 'trainer') {
                    TrainerDetails::create([
                        'user_id' => $user->id,
                        'specializations' => $request->specializations,
                        'certifications' => $request->certifications,
                        'bio' => $request->bio
                    ]);
                }

                DB::commit();

                $user->load('trainerDetails');
                $token = $user->createToken('auth_token')->plainTextToken;

                return response()->json([
                    'status' => 'success',
                    'message' => 'User registered successfully',
                    'user' => $user,
                    'token' => $token
                ], Response::HTTP_CREATED);

            } catch (\Exception $e) {
                DB::rollback();
                throw $e;
            }
        } catch (ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Registration failed',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function login(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'email' => 'required|email',
                'password' => 'required'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], Response::HTTP_UNPROCESSABLE_ENTITY);
            }

            $user = User::where('email', $request->email)->first();

            if (!$user || !Hash::check($request->password, $user->password)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Invalid credentials'
                ], Response::HTTP_UNAUTHORIZED);
            }

            if (!$user->is_active) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Account is deactivated'
                ], Response::HTTP_FORBIDDEN);
            }

            $user->load('trainerDetails');
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'status' => 'success',
                'message' => 'Login successful',
                'user' => $user,
                'token' => $token
            ], Response::HTTP_OK);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Login failed',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function logout(Request $request)
    {
        try {
            $request->user()->currentAccessToken()->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Successfully logged out'
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Logout failed',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function me(Request $request)
    {
        try {
            $user = $request->user()->load('trainerDetails');
            
            if (!$user->is_active) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Account is deactivated'
                ], Response::HTTP_FORBIDDEN);
            }

            return response()->json([
                'status' => 'success',
                'user' => $user
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to get user data',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function updateProfileImage(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'profile_image' => 'required|image|mimes:jpeg,png,jpg|max:2048'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], Response::HTTP_UNPROCESSABLE_ENTITY);
            }

            $user = $request->user();

            // Delete old image if exists
            if ($user->profile_image) {
                Storage::disk('public')->delete($user->profile_image);
            }

            // Store optimized image
            $path = $this->imageService->optimizeAndStore(
                $request->file('profile_image'),
                'profile-images'
            );
            
            $user->profile_image = $path;
            $user->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Profile image updated successfully',
                'user' => $user,
                'image_url' => $user->profile_image_url
            ], Response::HTTP_OK);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update profile image',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function removeProfileImage(Request $request)
    {
        try {
            $user = $request->user();

            if ($user->profile_image) {
                Storage::disk('public')->delete($user->profile_image);
                $user->profile_image = null;
                $user->save();
            }

            $user->load('trainerDetails');

            return response()->json([
                'status' => 'success',
                'message' => 'Profile image removed successfully',
                'user' => $user
            ], Response::HTTP_OK);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to remove profile image',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function updateCoverImage(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'cover_image' => 'required|image|mimes:jpeg,png,jpg|max:2048'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], Response::HTTP_UNPROCESSABLE_ENTITY);
            }

            $user = $request->user();

            // Delete old image if exists
            if ($user->cover_image) {
                Storage::disk('public')->delete($user->cover_image);
            }

            // Store optimized image
            $path = $this->imageService->optimizeAndStore(
                $request->file('cover_image'),
                'cover-images'
            );
            
            $user->cover_image = $path;
            $user->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Cover image updated successfully',
                'user' => $user
            ], Response::HTTP_OK);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update cover image',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function removeCoverImage(Request $request)
    {
        try {
            $user = $request->user();

            if ($user->cover_image) {
                Storage::disk('public')->delete($user->cover_image);
                $user->cover_image = null;
                $user->save();
            }

            $user->load('trainerDetails');

            return response()->json([
                'status' => 'success',
                'message' => 'Cover image removed successfully',
                'user' => $user
            ], Response::HTTP_OK);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to remove cover image',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
