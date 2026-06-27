<?php

namespace Database\Seeders;

use App\Models\District;
use App\Models\EquipmentListing;
use App\Models\HarvestLog;
use App\Models\User;
use Illuminate\Database\Seeder;

class AgroPulseDemoSeeder extends Seeder
{
    public function run(): void
    {
        // ── Districts ────────────────────────────────────────────────────────────
        $districts = [
            ['name' => 'Techiman', 'region' => 'Ashanti'],
            ['name' => 'Ejura',    'region' => 'Ashanti'],
            ['name' => 'Gomoa',    'region' => 'Central'],
        ];

        foreach ($districts as $d) {
            District::updateOrCreate(['name' => $d['name']], ['region' => $d['region']]);
        }

        // ── Farmers & harvest logs ───────────────────────────────────────────────
        // Initial volumes are deliberately small (10–40 bags) so total supply
        // stays under 100 → "High Demand" pricing.  Adding a 500-bag harvest
        // via the Farmer UI will push the total above 300 → "Glut forming".
        $farmers = [
            // Techiman
            ['name' => 'Ama Owusu',      'phone' => '+233201002000', 'mofa_id' => 'MOFA-2026-TEST', 'district' => 'Techiman', 'crop' => 'Cassava', 'volumes' => [18, 22]],
            ['name' => 'Yaw Mensah',     'phone' => '+233501102200', 'mofa_id' => null,              'district' => 'Techiman', 'crop' => 'Cassava', 'volumes' => [25]],
            ['name' => 'Akosua Boateng', 'phone' => '+233553332211', 'mofa_id' => null,              'district' => 'Techiman', 'crop' => 'Maize',   'volumes' => [28, 18]],
            ['name' => 'Kojo Agyeman',   'phone' => '+233274442211', 'mofa_id' => 'COOP-77',         'district' => 'Techiman', 'crop' => 'Yam',     'volumes' => [32]],
            ['name' => 'Esi Kyei',       'phone' => '+233207772211', 'mofa_id' => null,              'district' => 'Techiman', 'crop' => 'Tomato',  'volumes' => [20, 15]],

            // Ejura
            ['name' => 'Kwame Baffour',  'phone' => '+233242003000', 'mofa_id' => 'MOFA-2026-TEST', 'district' => 'Ejura', 'crop' => 'Cassava', 'volumes' => [12, 16]],
            ['name' => 'Serwaa Mensah',  'phone' => '+233212103300', 'mofa_id' => null,              'district' => 'Ejura', 'crop' => 'Maize',   'volumes' => [22]],
            ['name' => 'Kwaku Gyasi',    'phone' => '+233558901200', 'mofa_id' => null,              'district' => 'Ejura', 'crop' => 'Yam',     'volumes' => [18, 24]],
            ['name' => 'Abena Owusu',    'phone' => '+233269001300', 'mofa_id' => 'COOP-77',         'district' => 'Ejura', 'crop' => 'Tomato',  'volumes' => [25]],
            ['name' => 'Philip Boateng', 'phone' => '+233505019010', 'mofa_id' => null,              'district' => 'Ejura', 'crop' => 'Cassava', 'volumes' => [24]],

            // Gomoa
            ['name' => 'Nana Owusu',     'phone' => '+233205551212', 'mofa_id' => 'MOFA-2026-TEST', 'district' => 'Gomoa', 'crop' => 'Cassava', 'volumes' => [15, 18]],
            ['name' => 'Grace Ofori',    'phone' => '+233556001212', 'mofa_id' => null,              'district' => 'Gomoa', 'crop' => 'Maize',   'volumes' => [30]],
            ['name' => 'Samuel Darko',   'phone' => '+233276101212', 'mofa_id' => null,              'district' => 'Gomoa', 'crop' => 'Yam',     'volumes' => [22]],
            ['name' => 'Akua Mensima',   'phone' => '+233246201212', 'mofa_id' => 'COOP-77',         'district' => 'Gomoa', 'crop' => 'Tomato',  'volumes' => [18, 16]],

            // Extra farmers to reach ~20
            ['name' => 'Isaac Kofi',     'phone' => '+233507011111', 'mofa_id' => null, 'district' => 'Techiman', 'crop' => 'Cassava', 'volumes' => [20]],
            ['name' => 'Akua Asare',     'phone' => '+233207021111', 'mofa_id' => null, 'district' => 'Techiman', 'crop' => 'Maize',   'volumes' => [15]],
            ['name' => 'Abdul Rahman',   'phone' => '+233557031111', 'mofa_id' => null, 'district' => 'Techiman', 'crop' => 'Tomato',  'volumes' => [12]],
            ['name' => 'Selina Owusu',   'phone' => '+233247041111', 'mofa_id' => null, 'district' => 'Ejura',    'crop' => 'Cassava', 'volumes' => [14]],
            ['name' => 'Martin Agyei',   'phone' => '+233507051111', 'mofa_id' => null, 'district' => 'Ejura',    'crop' => 'Maize',   'volumes' => [16]],
            ['name' => 'Comfort Donkor', 'phone' => '+233207061111', 'mofa_id' => null, 'district' => 'Gomoa',    'crop' => 'Cassava', 'volumes' => [19]],
            ['name' => 'Daniel Boateng', 'phone' => '+233557071111', 'mofa_id' => null, 'district' => 'Gomoa',    'crop' => 'Yam',     'volumes' => [17]],
            ['name' => 'Naa Adwoa',      'phone' => '+233267081111', 'mofa_id' => null, 'district' => 'Gomoa',    'crop' => 'Tomato',  'volumes' => [14]],
        ];

        $timelines = ['this_week', '2_weeks', '1_month'];

        foreach ($farmers as $f) {
            $isVerified = in_array($f['mofa_id'], ['MOFA-2026-TEST', 'COOP-77'], true);

            $user = User::updateOrCreate(
                ['phone_number' => $f['phone']],
                [
                    'name'        => $f['name'],
                    'role'        => 'farmer',
                    'mofa_id'     => $f['mofa_id'],
                    'district'    => $f['district'],
                    'is_verified' => $isVerified,
                ]
            );

            foreach ($f['volumes'] as $v) {
                HarvestLog::create([
                    'user_id'     => $user->id,
                    'crop_type'   => $f['crop'],
                    'volume_bags' => (int) $v,
                    'timeline'    => $timelines[array_rand($timelines)],
                    'district'    => $f['district'],
                ]);
            }
        }

        // ── Demo buyer (used by secureOrder when no buyer_id supplied) ───────────
        User::firstOrCreate(
            ['phone_number' => '0700000000'],
            ['name' => 'Demo Buyer', 'role' => 'buyer', 'district' => 'Techiman', 'is_verified' => true]
        );

        // ── Equipment listings ───────────────────────────────────────────────────
        $equipmentItems = [
            ['tool_name' => 'Tractor Attachment',       'daily_rate_cedis' => 150, 'farmer' => 'Ama Owusu'],
            ['tool_name' => 'Power Tiller',              'daily_rate_cedis' => 80,  'farmer' => 'Kwame Baffour'],
            ['tool_name' => 'Mechanical Cassava Peeler', 'daily_rate_cedis' => 45,  'farmer' => 'Nana Owusu'],
            ['tool_name' => 'Irrigation Pump',           'daily_rate_cedis' => 120, 'farmer' => 'Grace Ofori'],
            ['tool_name' => 'Crop Sprayer',              'daily_rate_cedis' => 60,  'farmer' => 'Kojo Agyeman'],
            ['tool_name' => 'Harvesting Machine',        'daily_rate_cedis' => 200, 'farmer' => 'Samuel Darko'],
        ];

        foreach ($equipmentItems as $e) {
            $user = User::where('name', $e['farmer'])->first();
            if ($user) {
                EquipmentListing::firstOrCreate(
                    ['user_id' => $user->id, 'tool_name' => $e['tool_name']],
                    ['daily_rate_cedis' => $e['daily_rate_cedis'], 'is_available' => true]
                );
            }
        }
    }
}
