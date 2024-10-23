<?php

use App\Http\Controllers\BookController;
use App\Http\Controllers\RoleController;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Spatie\Permission\Models\Role;

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

/* 
laravel artisan clear cache 
    php artisan view:clear 
    php artisan cache:clear
    php artisan route:clear
    php artisan config:clear
*/

Route::middleware(['auth:sanctum'])->group(function (){
    Route::get('/user',function(Request $request){
        return $request->user();
    });
    //Route::resource('/books',BookController::class);

    Route::resource('roles',RoleController::class);

    Route::get('getUserWithRoles/{id}',[RoleController::class,'getUserWithRoles']);
    Route::post('assignUsersToRole', [RoleController::class,'createRoleUsers']);


});

Route::group(['prefix' => 'v1'], function() {
    Route::apiResource('books', BookController::class);
   //Route::apiResource('roles', RoleController::class);

});
