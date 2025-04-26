<?php

declare(strict_types=1);

namespace App\Core;

use App\Models\Organization;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Throwable;

class OrganizationManager
{
    public function create(User $user, string $name): Organization|false
    {
        DB::beginTransaction();

        try {
            $organization = new Organization;
            $organization->name = $name;
            $organization->save();

            $organization->users()->attach($user->id);

            DB::commit();

            return $organization;

        } catch (Throwable $e) {
            DB::rollBack();
            // Log the error
            Log::error('Error creating organization: '.$e->getMessage());

            return false;
        }
    }
}
