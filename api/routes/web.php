<?php

use App\Http\Controllers\V1;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

//Route::get('/', function () {
//    dd('');
//});

Route::prefix('/export')->group(function () {
    Route::get('/test/{type}', [V1\Test\ExportController::class, 'handle']);
    Route::get('/claim', [V1\Store\Claim\ExportController::class, 'handle']);
    Route::get('/time-card/{store}', [V1\TimeCard\ExportController::class, 'handle']);
});

Route::prefix('/download')->group(function () {
    Route::get('/media', [V1\Media\DownloadController::class, 'handle'])->name('download.media');
    Route::get('/statement/{statement}', [V1\OperationDepartment\Statement\DownloadController::class, 'handle'])->name('download.statement');
});
