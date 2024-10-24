<?php

namespace App\Http\Controllers\Api;

use App\Actions\StoreCurrency;
use App\Actions\UpdateCurrency;
use App\Http\Controllers\Controller;
use App\Models\Currency;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CurrencyApiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        // Temp: Implement authorization here.

        $creator = new StoreCurrency;

        $validated = $request->validate($creator->getValidationRules());

        $currency = $creator->execute($validated);

        return new JsonResponse($currency, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        // Temp: Implement authorization here.

        $currency = Currency::findByIdOrIsoCode($id);

        return new JsonResponse($currency, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $currency_id): JsonResponse
    {
        // Temp: Implement authorization here.

        $updater = new UpdateCurrency;

        $currency = Currency::findByIdOrIsoCode($currency_id);

        $validated = $request->validate($updater->getValidationRules($currency));

        $updated_currency = $updater->execute($currency, $validated);

        return response()->json($updated_currency, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
