<?php

use App\Models\ProductModel;
use App\Models\User;

test('product model can be created', function () {

    $user = User::factory()->create();
    $productModel = ProductModel::factory()->make();

    $response = $this->actingAs($user)->postJson('/api/product-models', $productModel->toArray());

    $response->assertStatus(201);
});

test('Duplicate product model can not be created', function () {

    $user = User::factory()->create();
    $productModel1 = ProductModel::factory()->create();

    $productModel2 = ProductModel::factory()->make(['name' => $productModel1->name]);

    $response = $this->actingAs($user)->postJson('/api/product-models', $productModel2->toArray());

    $response->assertStatus(422);
});

test('product model can be updated', function () {

    $user = User::factory()->create();
    $productModel = ProductModel::factory()->create();

    $productModel->name = fake()->unique()->words(2, true);

    $response = $this->actingAs($user)->putJson('/api/product-models/'.$productModel->id, $productModel->toArray());

    $response->assertStatus(200);
});

test('product model and slug can be updated', function () {

    $user = User::factory()->create();
    $productModel = ProductModel::factory()->create();

    $productModel->name = fake()->unique()->words(2, true);
    $productModel->update_slug = true;

    $response = $this->actingAs($user)->putJson('/api/product-models/'.$productModel->id, $productModel->toArray());

    $response->assertStatus(200);
});
