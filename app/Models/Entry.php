<?php

namespace App\Models;

use App\Models\Contracts\DeletionProtected;
use App\Models\Traits\IsIdSearchable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Ramsey\Uuid\Uuid;

class Entry extends Model implements DeletionProtected
{
    use HasFactory, HasUuids, IsIdSearchable;

    public function newUniqueId(): string
    {
        return Uuid::uuid7();
    }

    public function canBeDeleted(): bool
    {
        // Initial design indicates that an entry should never be deleted. Not even ammended. Only corrected via a new entry.
        return false;
    }

    public function ledger(): BelongsTo
    {
        return $this->belongsTo(Ledger::class);
    }

    public function transaction(): BelongsTo
    {
        return $this->belongsTo(Transaction::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function uom(): BelongsTo
    {
        return $this->belongsTo(Uom::class);
    }

    public function debit_account(): BelongsTo
    {
        return $this->belongsTo(Account::class, 'debit_account_id');
    }

    public function credit_account(): BelongsTo
    {
        return $this->belongsTo(Account::class, 'credit_account_id');
    }
}
