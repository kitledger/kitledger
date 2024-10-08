<?php

namespace App\Rules;

use App\Models\TransactionModel;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Str;

class TransactionModelExists implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $transaction_model = TransactionModel::where(function (Builder $query) use ($value) {
            $isUuid = Str::isUuid($value);

            if ($isUuid) {
                $query->where('id', $value)
                    ->orWhere('ref_id', $value)
                    ->orWhere('alt_id', $value);
            } else {
                $query->where('ref_id', $value)->orWhere('alt_id', $value);
            }
        })
            ->where('active', true)
            ->first();

        if (! $transaction_model) {
            $fail("Invalid transaction model: $value.");
        }
    }
}
