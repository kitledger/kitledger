<?php

namespace App\Models;

use App\Models\Contracts\DeletionProtected;
use App\Models\Traits\IsIdSearchable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProductModel extends Model implements DeletionProtected
{
    use HasFactory, HasUuids, IsIdSearchable;

    public function canBeDeleted(): bool
    {
        // For now allow deletion.
        return true;
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }
}
