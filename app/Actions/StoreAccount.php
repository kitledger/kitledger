<?php

namespace App\Actions;

use App\Models\Account;
use App\Models\Ledger;
use Illuminate\Support\Str;

class StoreAccount
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the action.
     */
    public function execute(array $data): Account
    {
        $data_class = (object) $data;

        $account = new Account;

        $ledger = Ledger::findById($data_class->ledger_id);

        // Get the parent account if it exists.
        $parent_account = ! empty($data_class->parent_id) ?

            Account::findById($data_class->parent_id)

        : null;

        $account->ref_id = $data['ref_id'] ?? 'ACC_'.Str::ulid();
        $account->alt_id = $data['alt_id'] ?? null;
        $account->name = $data['name'];
        $account->balance_type = $data['balance_type'];
        $account->ledger_id = $ledger->id;
        $account->parent_id = $parent_account ? $parent_account->id : null;
        $account->active = $data['active'] ?? true;

        // If the parent account exists, ensure that the account's ledger_id and balance_type match the parent account's.
        if ($parent_account) {
            if ($ledger->id !== $parent_account->ledger_id) {
                $account->ledger_id = $parent_account->ledger_id;
            }

            if ($account->balance_type !== $parent_account->balance_type) {
                $account->balance_type = $parent_account->balance_type;
            }
        }

        $account->save();

        return $account;
    }
}
