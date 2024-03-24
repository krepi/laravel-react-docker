<?php

namespace App\Services;

use App\Services\RecipeService;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Inertia\Response;

class TranslationService
{
    private $apiKey;
    private $endpoint;

    public function __construct()
    {
        $this->apiKey = config('services.translator.api_key');
        $this->endpoint = config('services.translator.endpoint');
    }


    public function translate($texts, $toLanguage = 'pl') :array
    {
        // Prepare the text for translation
        $body = array_map(function ($text) {
            return ['Text' => $text];
        }, $texts);
        $translator_response = $this->makeRequest($body,$toLanguage);
        if ($translator_response->successful()) {
            $translated_texts = array_map(function ($translationResult) {
                return $translationResult['translations'][0]['text'] ?? 'Translation unavailable';
            }, $translator_response->json());

            return $translated_texts;
        } else {
            // Log the error response for debugging
            Log::error('TranslationService failed', [
                'response' => $translator_response->body()
            ]);

            // Throw a more specific exception, or handle the error appropriately
            throw new \Exception('Failed to translate: ' . $translator_response->body());
        }
    }

    public function translateOne(string $text, string $toLanguage = 'pl'): string
    {
        // Prepare the text for translation by wrapping it in an array
        $body = [['Text' => $text]];
        $response = $this->makeRequest($body,$toLanguage);

        // Check for success and extract translated text
        if ($response->successful()) {
            $translationResults = $response->json();
            // Return the first translation result
            return $translationResults[0]['translations'][0]['text'] ?? 'Translation unavailable';
        } else {
            // Log the error response for debugging
            Log::error('TranslationService failed', [
                'response' => $response->body()
            ]);
            throw new \Exception('Failed to translate: ' . $response->body());
        }
    }



    public function makeRequest($body,$toLanguage): \GuzzleHttp\Promise\PromiseInterface|\Illuminate\Http\Client\Response
    {
     $response = Http::withHeaders([
            'Ocp-Apim-Subscription-Key' => $this->apiKey,
            'Content-Type' => 'application/json',
            'Ocp-Apim-Subscription-Region' => 'global',
        ])->post("{$this->endpoint}/translate?api-version=3.0&to={$toLanguage}", $body);
     return $response;
     }
}



