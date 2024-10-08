<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductModelRequest;
use App\Actions\StoreProductModel;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductModelApiController extends Controller
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
    public function store(StoreProductModelRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $product_model = (new StoreProductModel)->execute($validated);

        return response()->json($product_model, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
