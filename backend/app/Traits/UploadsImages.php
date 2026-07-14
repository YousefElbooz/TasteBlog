<?php

namespace App\Traits;

use Illuminate\Http\UploadedFile;

trait UploadsImages
{
    /**
     * Upload an image and return its path.
     */
    public function uploadImage(?UploadedFile $file, string $directory = 'uploads'): ?string
    {
        if (!$file) {
            return null;
        }
        
        return $file->store($directory, 'public');
    }

    /**
     * Delete an existing image.
     */
    public function deleteImage(?string $path)
    {
        if ($path && \Storage::disk('public')->exists($path)) {
            \Storage::disk('public')->delete($path);
        }
    }
}
