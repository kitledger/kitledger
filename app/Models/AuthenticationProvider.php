<?php

namespace App\Models;

use App\Models\Abstract\BaseModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AuthenticationProvider extends BaseModel
{
    use HasFactory;

    protected $fillable = ['provider', 'provider_user_id', 'user_id', 'last_used_at'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
