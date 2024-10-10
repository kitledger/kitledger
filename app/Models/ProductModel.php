<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Traits\IsIdSearchable;

class ProductModel extends Model
{
    use HasFactory, HasUuids, IsIdSearchable;

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }
}
