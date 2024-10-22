<?php

namespace App\Models\Traits;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Ramsey\Uuid\Uuid;

trait IsIdSearchable
{
    public static function findById(string $id): ?Model
    {
        $record = self::where(function (Builder $query) use ($id) {

            $isUuid = Uuid::isValid($id);

            if ($isUuid) {
                $query->where('id', $id)
                    ->orWhere('ref_id', $id)
                    ->orWhere('alt_id', $id);
            } else {
                $query->where('ref_id', $id)->orWhere('alt_id', $id);
            }

        })
            ->first();

        return $record;
    }

    public static function getIdSearchQuery(string $id): Builder
    {
        return self::where(function (Builder $query) use ($id) {

            $isUuid = Uuid::isValid($id);

            if ($isUuid) {
                $query->where('id', $id)
                    ->orWhere('ref_id', $id)
                    ->orWhere('alt_id', $id);
            } else {
                $query->where('ref_id', $id)->orWhere('alt_id', $id);
            }

        });
    }
}
