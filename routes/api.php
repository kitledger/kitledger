<?php

use App\Http\Controllers\Api;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:api'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware(['auth:api'])->group(function () {
    Route::post('/accounts', [Api\AccountApiController::class, 'store']);
    Route::put('/accounts/{account_id}', [Api\AccountApiController::class, 'update']);

    Route::post('/currencies', [Api\CurrencyApiController::class, 'store']);
    Route::put('/currencies/{currency_id}', [Api\CurrencyApiController::class, 'update']);

    Route::post('/entities/{model_route}', [Api\EntityApiController::class, 'store']);

    Route::post('/entity-models', [Api\EntityModelApiController::class, 'store']);
    Route::put('/entity-models/{entity_model_id}', [Api\EntityModelApiController::class, 'update']);

    Route::post('/ledgers', [Api\LedgerApiController::class, 'store']);
    Route::put('/ledgers/{ledger_id}', [Api\LedgerApiController::class, 'update']);

    Route::post('/products/{model_route}', [Api\ProductApiController::class, 'store']);

    Route::post('/product-models', [Api\ProductModelApiController::class, 'store']);
    Route::put('/product-models/{product_model_id}', [Api\ProductModelApiController::class, 'update']);

    Route::post('/transaction-models', [Api\TransactionModelApiController::class, 'store']);
    Route::put('/transaction-models/{transaction_model_id}', [Api\TransactionModelApiController::class, 'update']);
});
