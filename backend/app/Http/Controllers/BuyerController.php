<?php

namespace App\Http\Controllers;

use App\Models\HarvestLog;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;

class BuyerController extends Controller
{
    public function secureOrder(Request $request)
    {
        $validated = $request->validate([
            'harvest_log_id' => ['required', 'integer', 'exists:harvest_logs,id'],
            'buyer_id' => ['nullable', 'integer', 'exists:users,id'],
        ]);

        $harvest = HarvestLog::with('user')->findOrFail($validated['harvest_log_id']);

        // Hackathon simplification: if no buyer_id, create/find a demo buyer.
        $buyer = null;
        if (!empty($validated['buyer_id'])) {
            $buyer = User::where('id', $validated['buyer_id'])->firstOrFail();
        } else {
            $buyer = User::firstOrCreate(
                ['role' => 'buyer'],
                ['name' => 'Demo Buyer', 'phone_number' => '0700000000', 'district' => $harvest->district, 'is_verified' => true]
            );
        }

        $totalPrice = (float) (295 * $harvest->volume_bags);

        $order = Order::create([
            'buyer_id' => $buyer->id,
            'harvest_log_id' => $harvest->id,
            'total_price' => $totalPrice,
            'status' => 'secured',
        ]);

        return response()->json([
            'order_id' => $order->id,
            'status' => $order->status,
            'escrow' => [
                'locked_amount' => $order->total_price,
                'currency' => 'GHS',
                'reference' => 'ESCROW-' . $order->id,
            ],
        ]);
    }
}

