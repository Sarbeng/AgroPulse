<?php

namespace App\Http\Controllers;

use App\Models\HarvestLog;
use App\Models\User;
use Illuminate\Http\Request;

class FarmerController extends Controller
{
    public function index()
    {
        $harvests = HarvestLog::query()
            ->with(['user:id,name,phone_number,is_verified,district'])
            ->orderBy('created_at', 'desc')
            ->limit(100)
            ->get();

        return response()->json($harvests);
    }

    public function registerFarmer(Request $request)
    {
        $validated = $request->validate([
            'phone_number' => ['nullable', 'string', 'max:20'],
            'name'         => ['required', 'string', 'max:255'],
            'mofa_id'      => ['nullable', 'string', 'max:100'],
            'district'     => ['required', 'string', 'max:255'],
        ]);

        $mofaId     = $validated['mofa_id'] ?? null;
        $isVerified = in_array($mofaId, ['MOFA-2026-TEST', 'COOP-77'], true);

        // Auto-generate a unique phone when the farmer hasn't provided one
        $phone = $validated['phone_number'] ?? ('+233' . rand(200000000, 599999999));

        $user = User::updateOrCreate(
            ['phone_number' => $phone],
            [
                'name'        => $validated['name'],
                'role'        => 'farmer',
                'mofa_id'     => $mofaId,
                'district'    => $validated['district'],
                'is_verified' => $isVerified,
            ]
        );

        return response()->json([
            'id'           => $user->id,
            'name'         => $user->name,
            'phone_number' => $user->phone_number,
            'role'         => $user->role,
            'district'     => $user->district,
            'is_verified'  => $user->is_verified,
        ]);
    }

    public function createHarvest(Request $request)
    {
        $validated = $request->validate([
            'user_id'     => ['required', 'integer', 'exists:users,id'],
            'crop_type'   => ['required', 'string', 'in:Cassava,Maize,Yam,Tomato'],
            'volume_bags' => ['required', 'integer', 'min:1'],
            'timeline'    => ['required', 'string', 'in:this_week,2_weeks,1_month'],
            'district'    => ['required', 'string', 'max:255'],
        ]);

        $harvest = HarvestLog::create($validated);

        return response()->json($harvest);
    }
}
