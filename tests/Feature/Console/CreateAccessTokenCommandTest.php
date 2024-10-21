<?php

use App\Models\User;
use Illuminate\Support\Facades\Artisan;

test('the command creates an access token', function () {

    $user1 = User::factory()->create();
	Artisan::call('passport:client', ['--personal' => true, '--name' => 'CLI Token']);

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
