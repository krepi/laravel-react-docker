<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class TranslationService
{
    private $apiKey;
    private $endpoint;

    public function __construct(string $apiKey, string $endpoint)
    {
        $this->apiKey = $apiKey;
        $this->endpoint = $endpoint;
    }

    public function translate(array $texts, string $toLanguage): array
    {
        $body = array_map(function ($text) {
            return ['Text' => $text];
        }, $texts);

        $response = Http::withHeaders([
            'Ocp-Apim-Subscription-Key' => $this->apiKey,
            'Content-Type' => 'application/json',
            'Ocp-Apim-Subscription-Region' => 'global',
        ])->post("{$this->endpoint}/translate?api-version=3.0&to={$toLanguage}", $body);

        if ($response->successful()) {
            return array_column(array_column($response->json(), 'translations'), 'text');
        }

        throw new \Exception('Nie udało się przetłumaczyć tekstu.');
    }
}

