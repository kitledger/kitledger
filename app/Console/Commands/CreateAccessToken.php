<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Database\Eloquent\Builder;
use Ramsey\Uuid\Uuid;

use function Laravel\Prompts\search;

class CreateAccessToken extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:create-access-token';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $user_id = search(
            label: 'Search for a user by ID, first name, last name, or email',
            options: fn (string $value) => strlen($value) > 0
            ? User::where(function (Builder $query) use ($value) {

                $is_uuid = Uuid::isValid($value);

                if ($is_uuid) {
                    $query->where('id', $value);
                }

                $query->where('first_name', 'ilike', "%$value%")
                    ->orWhere('last_name', 'ilike', "%$value%")
                    ->orWhere('email', 'ilike', "%$value%");
            })->get()->mapWithKeys(fn (User $user) => [$user->id => "{$user->first_name} {$user->last_name} ({$user->email})"])->all()
            : []
        );

        if ($user_id) {
            $user = User::find($user_id);

            $token = $user->createToken('CLI Token')->plainTextToken;

            $this->info("Access token for user {$user->first_name} {$user->last_name} ({$user->email}):");
            $this->line($token);
        } else {
            $this->error('No user found');
        }
    }
}
