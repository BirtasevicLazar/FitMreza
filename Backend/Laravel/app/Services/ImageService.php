<?php

namespace App\Services;

use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageService
{
    protected $manager;

    public function __construct()
    {
        $this->manager = new ImageManager(new Driver());
    }

    public function optimizeAndStore($image, $path, $filename = null)
    {
        // Generisi ime fajla ako nije prosleđeno
        $filename = $filename ?? time() . '_' . Str::random(10);
        
        // Kreiraj image instancu
        $img = $this->manager->read($image);
        
        // Optimalna veličina za web
        $maxWidth = 1200; // Povećano za retina displeje
        $maxHeight = 1200;
        
        // Zadrži originalni aspect ratio
        $img->scaleDown(width: $maxWidth, height: $maxHeight);
        
        // Malo poboljšaj oštrinu nakon skaliranja
        $img->sharpen(1);
        
        // Optimizuj za web
        $fullPath = $path . '/' . $filename . '.webp';
        
        // Konvertuj u WebP sa optimalnim kvalitetom
        // WebP može imati veći kvalitet jer bolje kompresuje
        Storage::disk('public')->put(
            $fullPath, 
            $img->toWebp(quality: 85)->toString() // WebP sa 85% kvaliteta je približno kao JPEG 70%
        );
        
        return $fullPath;
    }

    public function generateThumbnail($image, $path, $width = 400) // Povećano za retina displeje
    {
        $img = $this->manager->read($image);
        
        // Zadrži aspect ratio
        $img->scaleDown(width: $width);
        
        // Malo poboljšaj oštrinu
        $img->sharpen(1);
        
        $thumbnailPath = $path . '/thumb_' . basename($image);
        // Zameni ekstenziju u .webp
        $thumbnailPath = preg_replace('/\.[^.]+$/', '.webp', $thumbnailPath);
        
        Storage::disk('public')->put(
            $thumbnailPath, 
            $img->toWebp(quality: 75)->toString() // WebP sa 75% kvaliteta za thumbnail
        );
        
        return $thumbnailPath;
    }
} 