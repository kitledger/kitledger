<?php

use App\Models\Currency;
use App\Models\User;
use Laravel\Passport\Passport;

test('currency can be created', function () {

    Passport::actingAs(User::factory()->create());
    $currency = Currency::factory()->make();

    $response = $this->postJson('/api/currencies', $currency->toArray());

    $response->assertStatus(201);
});

test('Duplicate currency can not be created', function () {
    Passport::actingAs(User::factory()->create());
    $currency1 = Currency::factory()->create();

    $currency2 = Currency::factory()->make(['name' => $currency1->name, 'iso_code' => $currency1->iso_code]);

    $response = $this->postJson('/api/currencies', $currency2->toArray());

    $response->assertStatus(422);
});

test('Update and existing currency', function () {
    Passport::actingAs(User::factory()->create());
    $currency = Currency::factory()->create();

    $currency->name = fake()->unique()->name;

    $response = $this->putJson('/api/currencies/'.$currency->id, $currency->toArray());

    $response->assertStatus(200);
});
