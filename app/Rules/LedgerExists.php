<?php

namespace App\Rules;

use Closure;
use App\Models\Ledger;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Str;

class LedgerExists implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $ledger = Ledger::where(function (Builder $query) use ($value) {

			$isUuid = Str::isUuid($value);

			if ($isUuid) {
				$query->where('id', $value)
				->orWhere('ref_id', $value)
				->orWhere('alt_id', $value);
			}

			$query->where('ref_id', $value)->orWhere('alt_id', $value);

		})
		->where('active', true)
		->first();

		if (! $ledger) {
			$fail("Invalid ledger: $value.");
		}
    }
}
