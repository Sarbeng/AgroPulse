<?php

namespace App\Http\Controllers;

use App\Models\EquipmentListing;
use App\Models\User;
use Illuminate\Http\Request;

class EquipmentController extends Controller
{
    public function index()
    {
        $items = EquipmentListing::query()
            ->with(['user:id,name,phone_number,role,is_verified'])
            ->where('is_available', true)
            ->orderBy('created_at', 'desc')
            ->get(['id', 'user_id', 'tool_name', 'daily_rate_cedis', 'is_available', 'created_at']);

        return response()->json($items);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'tool_name' => ['required', 'string', 'max:255'],
            'daily_rate_cedis' => ['required', 'numeric', 'min:0'],
            'is_available' => ['nullable', 'boolean'],
        ]);

        $listing = EquipmentListing::create([
            'user_id' => $validated['user_id'],
            'tool_name' => $validated['tool_name'],
            'daily_rate_cedis' => $validated['daily_rate_cedis'],
            'is_available' => $validated['is_available'] ?? true,
        ]);

        return response()->json($listing);
    }
}

