<?php

use App\Models\Account;
use App\Models\User;
use Illuminate\Support\Facades\Log;

test('account can be created', function () {

    $user = User::factory()->create();
    $account = Account::factory()->make();

    $response = $this->actingAs($user)->postJson('/api/accounts', $account->toArray());

    $response->assertStatus(201);
});

test('Duplicate account can not be created', function () {

    $user = User::factory()->create();
    $account1 = Account::factory()->create();

    Log::debug($account1);

    $account2 = Account::factory()->make([
        'ref_id' => $account1->ref_id,
        'name' => $account1->name,
    ]);

    Log::debug($account2);

    $response = $this->actingAs($user)->postJson('/api/accounts', $account2->toArray());

    $response->assertStatus(422);
});

test('Account with parent account can be created', function () {

    $user = User::factory()->create();
    $parent_account = Account::factory()->create();

    $account = Account::factory()->make(['parent_id' => $parent_account->id]);

    $response = $this->actingAs($user)->postJson('/api/accounts', $account->toArray());

    $response->assertStatus(201);
});

test('Account can be updated', function () {

    $user = User::factory()->create();
    $account = Account::factory()->create();

    $response = $this->actingAs($user)->putJson("/api/accounts/{$account->id}", ['name' => 'Updated Account']);

    $response->assertStatus(200);
});
