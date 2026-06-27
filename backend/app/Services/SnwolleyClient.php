<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class SnwolleyClient
{
    private string $teamKey;
    private string $platformKey;

    public function __construct()
    {
        $this->teamKey     = config('services.snwolley.team_key');
        $this->platformKey = config('services.snwolley.platform_key');
    }

    public function stt($audioFile): array
    {
        $response = Http::withHeaders(['X-API-Key' => $this->teamKey])
            ->attach('audio', file_get_contents($audioFile->getRealPath()), $audioFile->getClientOriginalName())
            ->post('https://v1.snwolley.ai/api/v1/hackathon/stt');

        return $response->json();
    }

    public function tts(string $text): string
    {
        $response = Http::withHeaders(['X-API-Key' => $this->teamKey])
            ->post('https://v1.snwolley.ai/api/v1/hackathon/tts', ['text' => $text]);

        return $response->body();
    }

    public function chat(string $message, ?string $chatId = null): array
    {
        $payload = ['message' => $message, 'agent' => '107', 'stream' => false];
        if ($chatId) {
            $payload['chat_id'] = $chatId;
        }

        $response = Http::withHeaders(['X-API-Key' => $this->platformKey])
            ->post('https://v1.snwolley.ai/v1/chat/completions', $payload);

        return $response->json();
    }
}
