<?php

namespace App\Services;

use Illuminate\Support\Arr;

class DynamicPricingEngine
{
    /**
     * Baseline market prices per bag in cedis.
     *
     * NOTE: These are hardcoded for hackathon demo simplicity.
     */
    private const BASELINE_PRICES = [
        'Cassava' => ['low' => 350, 'high' => 380],
        'Maize' => ['low' => 280, 'high' => 310],
        'Yam' => ['low' => 350, 'high' => 380],
        'Tomato' => ['low' => 450, 'high' => 490],
    ];

    public function getBaselineForCrop(string $crop): array
    {
        return self::BASELINE_PRICES[$crop] ?? ['low' => 300, 'high' => 330];
    }

    /**
     * @return array{totalSupply:int, level:string, prices:array{low:int,high:int}, badge:string}
     */
    public function priceForDistrictCrop(int $totalSupply, string $crop): array
    {
        $base = $this->getBaselineForCrop($crop);

        if ($totalSupply > 300) {
            $dropFactor = 0.80; // 20% drop within 15-20 range
            $low = (int) round($base['low'] * $dropFactor);
            $high = (int) round($base['high'] * $dropFactor);
            return [
                'totalSupply' => $totalSupply,
                'level' => 'HIGH',
                'prices' => ['low' => $low, 'high' => $high],
                'badge' => '➘ Gluts forming - Buy Now',
            ];
        }

        if ($totalSupply < 100) {
            $increaseFactor = 1.25; // 25% within 20-25 range
            $low = (int) round($base['low'] * $increaseFactor);
            $high = (int) round($base['high'] * $increaseFactor);
            return [
                'totalSupply' => $totalSupply,
                'level' => 'LOW',
                'prices' => ['low' => $low, 'high' => $high],
                'badge' => '➚ High Demand',
            ];
        }

        return [
            'totalSupply' => $totalSupply,
            'level' => 'MEDIUM',
            'prices' => ['low' => (int) $base['low'], 'high' => (int) $base['high']],
            'badge' => 'Steady Market',
        ];
    }
}

