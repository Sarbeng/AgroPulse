<?php

namespace App\Http\Controllers;

use App\Services\SnwolleyClient;
use Illuminate\Http\Request;

class SnwolleyController extends Controller
{
    public function __construct(private SnwolleyClient $snwolley) {}

    public function stt(Request $request)
    {
        $request->validate(['audio' => 'required|file']);

        $result = $this->snwolley->stt($request->file('audio'));

        return response()->json([
            'success' => true,
            'text'    => $result['text'] ?? $result['transcript'] ?? '',
        ]);
    }

    public function tts(Request $request)
    {
        $request->validate(['text' => 'required|string|max:2000']);

        $wav = $this->snwolley->tts($request->input('text'));

        return response($wav, 200)
            ->header('Content-Type', 'audio/wav')
            ->header('Cache-Control', 'no-store');
    }

    public function chat(Request $request)
    {
        $request->validate(['message' => 'required|string|max:4000']);

        $result = $this->snwolley->chat(
            $request->input('message'),
            $request->input('chat_id'),
        );

        return response()->json([
            'content' => $result['choices'][0]['message']['content']
                      ?? $result['content']
                      ?? '',
            'chat_id' => $result['chat_id'] ?? $request->input('chat_id'),
        ]);
    }
}
