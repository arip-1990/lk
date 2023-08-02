<?php

use App\Http\Controllers\V1;
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

Route::prefix('v1')->group(function () {
    Route::post('/login', [V1\Auth\LoginController::class, 'handle']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/auth', [V1\Auth\IndexController::class, 'handle']);
        Route::post('/logout', [V1\Auth\LogoutController::class, 'handle']);

        Route::get('/category', [V1\CategoryController::class, 'handle']);

        Route::prefix('/test')->group(function () {
            Route::get('/{category}', [V1\Test\IndexController::class, 'handle']);
            Route::get('/result/{test}', [V1\Test\ResultController::class, 'handle']);
            Route::post('/result', [V1\Test\StoreController::class, 'handle']);
        });

        Route::prefix('/training')->group(function () {
            Route::get('/{category}/{type?}', [V1\Training\IndexController::class, 'handle']);
            Route::post('/{category}', [V1\Training\StoreController::class, 'handle']);
            Route::delete('/{training}', [V1\Training\DeleteController::class, 'handle']);
        });

        Route::prefix('/document')->group(function () {
            Route::get('/{category}', [V1\Document\IndexController::class, 'handle']);
            Route::post('/{category}', [V1\Document\StoreController::class, 'handle']);
            Route::delete('/{document}', [V1\Document\DeleteController::class, 'handle']);
        });

        Route::prefix('/media')->group(function () {
            Route::get('/{category}/{store?}', [V1\Media\IndexController::class, 'handle']);
            Route::post('/{category}/{store?}', [V1\Media\StoreController::class, 'handle']);
            Route::delete('/{media}', [V1\Media\DeleteController::class, 'handle']);
        });

        Route::prefix('/user')->group(function () {
            Route::get('/', [V1\User\IndexController::class, 'handle']);
            Route::get('/test/{user}', [V1\User\TestController::class, 'handle']);
            Route::get('/worker', [V1\User\WorkerController::class, 'handle']);
        });

        Route::prefix('/store')->group(function () {
            Route::get('/', [V1\Store\IndexController::class, 'handle']);
        });

        Route::prefix('/provider')->group(function () {
            Route::get('/', [V1\Provider\IndexController::class, 'handle']);
            Route::get('/store', [V1\Provider\StoreController::class, 'handle']);
        });

        Route::prefix('/claim')->group(function () {
            Route::get('/{store?}', [V1\Store\Claim\IndexController::class, 'handle']);
            Route::post('/', [V1\Store\Claim\StoreController::class, 'handle']);
            Route::put('/{claim}', [V1\Store\Claim\UpdateController::class, 'handle']);
        });

        Route::prefix('/time-card')->group(function () {
            Route::get('/{store}', [V1\TimeCard\IndexController::class, 'handle']);
            Route::post('/', [V1\TimeCard\StoreController::class, 'handle']);
        });

        Route::prefix('/operation-department')->group(function () {
            Route::prefix('/statement')->group(function () {
                Route::get('/{category}', [V1\OperationDepartment\Statement\IndexController::class, 'handle']);
                Route::post('/{category}', [V1\OperationDepartment\Statement\StoreController::class, 'handle']);
                Route::post('/{statement}/update', [V1\OperationDepartment\Statement\UpdateController::class, 'handle']);
                Route::post('/{statement}/add-performer', V1\OperationDepartment\Statement\AddPerformerController::class);
                Route::delete('/{statement}', [V1\OperationDepartment\Statement\DeleteController::class, 'handle']);
            });

            Route::prefix('/contact')->group(function () {
                Route::get('/', [V1\OperationDepartment\Contact\IndexController::class, 'handle']);
                Route::post('/', [V1\OperationDepartment\Contact\StoreController::class, 'handle']);
                Route::put('/{contact}', [V1\OperationDepartment\Contact\UpdateController::class, 'handle']);
                Route::delete('/{contact}', [V1\OperationDepartment\Contact\DeleteController::class, 'handle']);
            });
        });

        Route::prefix('broadcasting')->group(function () {
            Route::post('/connect-token', [V1\Broadcast\ConnectController::class, 'handle']);
            Route::post('/auth', [V1\Broadcast\AuthController::class, 'handle']);
        });
    });
});
