<?php

use App\Http\Controllers\BookController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

/*Route::resource('/books',BookController::class);

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
}); */

Route::middleware(['auth:sanctum'])->group(function (){
    Route::get('/user',function(Request $request){
        return $request->user();
    });
    //Route::resource('/books',BookController::class);

    //Route::resource('roles',RoleController::class);

});

Route::group(['prefix' => 'v1'], function() {
    Route::apiResource('books', BookController::class);
});
