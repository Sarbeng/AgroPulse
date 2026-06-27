<?php

use App\Http\Controllers\BuyerController;
use App\Http\Controllers\SnwolleyController;
use App\Http\Controllers\DynamicDistrictController;
use App\Http\Controllers\EquipmentController;
use App\Http\Controllers\FarmerController;
use Illuminate\Support\Facades\Route;

// Farmer
Route::post('/register-farmer', [FarmerController::class, 'registerFarmer']);
Route::get('/harvests', [FarmerController::class, 'index']);
Route::post('/harvests', [FarmerController::class, 'createHarvest']);

// Districts & market
Route::get('/districts', [DynamicDistrictController::class, 'listDistricts']);
Route::get('/market-trends', [DynamicDistrictController::class, 'marketTrends']);
Route::get('/districts/{district}/farmers', [DynamicDistrictController::class, 'districtFarmers']);

// Orders
Route::post('/orders/secure', [BuyerController::class, 'secureOrder']);

// Equipment
Route::get('/equipment', [EquipmentController::class, 'index']);
Route::post('/equipment', [EquipmentController::class, 'store']);

// Snwolley Voice + Chat
Route::post('/speech/stt', [SnwolleyController::class, 'stt']);
Route::post('/speech/tts', [SnwolleyController::class, 'tts']);
Route::post('/chat', [SnwolleyController::class, 'chat']);
