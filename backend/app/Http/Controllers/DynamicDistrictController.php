<?php

namespace App\Http\Controllers;

use App\Models\District;
use App\Models\HarvestLog;
use App\Services\DynamicPricingEngine;
use Illuminate\Http\Request;

class DynamicDistrictController extends Controller
{
    public function listDistricts()
    {
        return response()->json(District::orderBy('name')->get(['id', 'name', 'region']));
    }

    public function marketTrends(Request $request, DynamicPricingEngine $pricing)
    {
        $region = $request->query('region');
        $crop   = $request->query('crop');

        // Default to Cassava instead of returning 422, so the dashboard always renders
        if (!in_array($crop, ['Cassava', 'Maize', 'Yam', 'Tomato'], true)) {
            $crop = 'Cassava';
        }

        $districtQuery = District::query();
        if ($region && is_string($region)) {
            $districtQuery->where('region', $region);
        }

        $districts     = $districtQuery->orderBy('name')->get(['id', 'name', 'region']);
        $districtNames = $districts->pluck('name')->values();

        // Aggregate supply per district for this crop in one query
        $supplies = HarvestLog::query()
            ->selectRaw('district, SUM(volume_bags) as total_volume')
            ->where('crop_type', $crop)
            ->whereIn('district', $districtNames)
            ->groupBy('district')
            ->get()
            ->keyBy('district');

        // Count distinct farmers per district in one query
        $farmerCounts = HarvestLog::query()
            ->selectRaw('district, COUNT(DISTINCT user_id) as cnt')
            ->where('crop_type', $crop)
            ->whereIn('district', $districtNames)
            ->groupBy('district')
            ->get()
            ->keyBy('district');

        $out = [];
        foreach ($districts as $district) {
            $total         = (int) ($supplies[$district->name]->total_volume ?? 0);
            $farmerCount   = (int) ($farmerCounts[$district->name]->cnt ?? 0);
            $pricingResult = $pricing->priceForDistrictCrop($total, $crop);

            $out[] = [
                'id'          => $district->id,
                'district'    => $district->name,
                'region'      => $district->region,
                'crop'        => $crop,
                'totalSupply' => $total,
                'level'       => $pricingResult['level'],
                'prices'      => $pricingResult['prices'],
                'badge'       => $pricingResult['badge'],
                'farmerCount' => $farmerCount,
            ];
        }

        return response()->json($out);
    }

    public function districtFarmers(Request $request, string $districtName)
    {
        $crop = $request->query('crop');
        if (!in_array($crop, ['Cassava', 'Maize', 'Yam', 'Tomato'], true)) {
            return response()->json(['message' => 'Invalid crop.'], 422);
        }

        $harvests = HarvestLog::query()
            ->with(['user:id,name,phone_number,role,district,is_verified'])
            ->where('district', $districtName)
            ->where('crop_type', $crop)
            ->orderBy('created_at', 'desc')
            ->limit(50)
            ->get();

        $data = $harvests->map(function (HarvestLog $h) {
            return [
                'id'             => 'hl-' . $h->id,
                'harvest_log_id' => $h->id,
                'name'           => $h->user?->name ?? 'New Farmer',
                'districtId'     => $h->district,
                'crop'           => $h->crop_type,
                'quantity'       => $h->volume_bags,
                'harvestDays'    => match ($h->timeline) {
                    'this_week' => 7,
                    '2_weeks'   => 14,
                    '1_month'   => 30,
                    default     => 14,
                },
                'verified' => (bool) ($h->user?->is_verified ?? false),
                'phone'    => $h->user?->phone_number ?? '',
                'isNew'    => true,
            ];
        });

        return response()->json($data);
    }
}
