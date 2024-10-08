<?php

namespace App\Http\Controllers\Api;

use App\Actions\StoreEntityModel;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEntityModelRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EntityModelApiController extends Controller
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
    public function store(StoreEntityModelRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $entity_model = (new StoreEntityModel)->execute($validated);

        return response()->json($entity_model, 201);
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
