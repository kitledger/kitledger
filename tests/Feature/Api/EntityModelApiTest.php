<?php

use App\Models\EntityModel;
use App\Models\User;
use Laravel\Passport\Passport;

test('entity model can be created', function () {

    Passport::actingAs(User::factory()->create());
    $entityModel = EntityModel::factory()->make();

    $response = $this->postJson('/api/entity-models', $entityModel->toArray());

    $response->assertStatus(201);
});

test('Duplicate entity model can not be created', function () {

    Passport::actingAs(User::factory()->create());
    $entityModel1 = EntityModel::factory()->create();

    $entityModel2 = EntityModel::factory()->make(['name' => $entityModel1->name]);

    $response = $this->postJson('/api/entity-models', $entityModel2->toArray());

    $response->assertStatus(422);
});

test('entity model can be updated', function () {

    Passport::actingAs(User::factory()->create());
    $entityModel = EntityModel::factory()->create();

    $entityModel->name = fake()->unique()->words(2, true);

    $response = $this->putJson('/api/entity-models/'.$entityModel->id, $entityModel->toArray());

    $response->assertStatus(200);
});

test('entity model and slug can be updated', function () {

    Passport::actingAs(User::factory()->create());
    $entityModel = EntityModel::factory()->create();

    $entityModel->name = fake()->unique()->words(2, true);
    $entityModel->update_route = true;

    $response = $this->putJson('/api/entity-models/'.$entityModel->id, $entityModel->toArray());

    $response->assertStatus(200);
});
