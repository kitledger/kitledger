<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Ramsey\Uuid\Uuid;

class ExchangeRate extends Model
{
    use HasFactory, HasUuids;

    public function newUniqueId(): string
    {
        return Uuid::uuid7();
    }
}
