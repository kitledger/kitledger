<?php

use App\Models\Entity;
use App\Models\EntityModel;
use App\Models\User;
use Laravel\Passport\Passport;

test('entity can be created', function () {

    Passport::actingAs(User::factory()->create());
    $entity_model = EntityModel::factory()->create();
    $entity = Entity::factory()->make(['entity_model_id' => $entity_model->id]);

    $response = $this->postJson("/api/entities/$entity_model->route", $entity->toArray());

    $response->assertStatus(201);
});

test('Duplicate entity can not be created', function () {

    Passport::actingAs(User::factory()->create());
    $entity_model = EntityModel::factory()->create();

    $entity1 = Entity::factory()->create(['entity_model_id' => $entity_model->id]);

    $entity2 = Entity::factory()->make(['entity_model_id' => $entity_model->id, 'name' => $entity1->name]);

    $response = $this->postJson("/api/entities/$entity_model->route", $entity2->toArray());

    $response->assertStatus(422);
});

test('Entity with parent entity can be created', function () {

    Passport::actingAs(User::factory()->create());
    $entity_model = EntityModel::factory()->create();
    $parent_entity = Entity::factory()->create(['entity_model_id' => $entity_model->id]);

    $entity = Entity::factory()->make(['entity_model_id' => $entity_model->id, 'parent_id' => $parent_entity->id]);

    $response = $this->postJson("/api/entities/$entity_model->route", $entity->toArray());

    $response->assertStatus(201);
});
