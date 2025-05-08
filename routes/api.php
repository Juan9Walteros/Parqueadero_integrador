<?php

use App\Http\Controllers\AccesRecordsController;
use App\Http\Controllers\AccessRecordsController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ParkingsController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VehiclesController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource("/vehicles", VehiclesController::class); 
    Route::apiResource("/accessrecords", AccessRecordsController::class);
    Route::apiResource("/parkings", ParkingsController::class);
    Route::apiResource("/users", UserController::class);
    
});

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'store']);
Route::post('/accessrecords/scan/{qr_code}', [AccessRecordsController::class, 'scanQRCode']);





    