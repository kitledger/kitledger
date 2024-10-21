<?php

use App\Models\User;
use Laravel\Passport\Client;
use Laravel\Passport\PersonalAccessClient;
use Laravel\Passport\Passport;

test('the command creates an access token', function () {

    $user1 = User::factory()->create();
	$client = Client::factory()->create(['personal_access_client' => true]);

	// Create a personal access client
	$personal_client = new PersonalAccessClient();
	$personal_client->client_id = $client->id;
	$personal_client->save();

    $this
        ->artisan('app:create-access-token')
        ->expectsSearch(
            'Search for a user by ID, first name, last name, or email',
            search: $user1->first_name,
            answers: [
                $user1->id => "{$user1->first_name} {$user1->last_name} ({$user1->email})",
            ],
            answer: $user1->id
        )
        ->expectsOutput("Access token for user {$user1->first_name} {$user1->last_name} ({$user1->email}):");
});
