<?php

namespace App\Services;

class ImageService
{
public function isLocalImage($imagePath): bool
{
        // Sprawdź, czy ścieżka obrazka wskazuje na zasób lokalny
        return !filter_var($imagePath, FILTER_VALIDATE_URL) && file_exists(public_path($imagePath));
    }

   public function copyImage($imagePath): string
   {
        // Pobranie tylko nazwy pliku z oryginalnej ścieżki
        $originalFileName = basename($imagePath);

        // Utworzenie nowej nazwy pliku z unikalnym prefiksem
        $newImageName = time() . '-' . $originalFileName;
        $newImagePath = public_path('images/recipes') . '/' . $newImageName;

        // Skopiowanie pliku, jeśli istnieje
        if (file_exists(public_path($imagePath))) {
            copy(public_path($imagePath), $newImagePath);
        }

        return '/images/recipes/' . $newImageName;
    }

    public function updateImage($request, &$validatedData, $oldImagePath)
    {
        if ($request->hasFile('image')) {
            // Usunięcie starego obrazka, jeśli istnieje
            if (file_exists($oldImagePath)) {
                unlink($oldImagePath);
            }

            // Przetwarzanie nowego obrazka
            $imageName = time() . '.' . $request->image->extension();
            $request->image->move(public_path('images/recipes'), $imageName);
            $validatedData['image'] = '/images/recipes/' . $imageName;
        }
    }
    public function deleteImage($imagePath)
    {
        if ($imagePath && file_exists(public_path($imagePath))) {
            unlink(public_path($imagePath));
        }
    }
}
