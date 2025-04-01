<?php

use App\Http\Controllers\ProductController;


use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;
use Illuminate\Validation\ValidationException;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('products' , ProductController::class);
});


Route::post('sanctum/token', function (Request $request) {
    $request->validate([
        'email' => 'required|string|email',
        'password' => 'required',
    ]) ;

    $user = User::where('email' , $request->email)->first();
    if (!$user || !Hash::check($request->password , $user->password)) {
        throw ValidationException::withMessages([
            'email' => ['The provided credentials are incorrect']
        ]);
    }

    return  $user->createToken($request->device_name)->plainTextToken;
});
