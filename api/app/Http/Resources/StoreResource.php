<?php

namespace App\Http\Resources;

use App\Helper;
use App\Models\Store;
use Illuminate\Http\Resources\Json\JsonResource;

class StoreResource extends JsonResource
{
    public function toArray($request): array
    {
        /** @var Store $this */
        return [
            'id' => $this->id,
            'name' => $this->name,
            'phone' => Helper::formatPhone($this->phone),
            'status' => $this->status,
            'schedule' => $this->formatScheduleShort(),
            'totalClaims' => $this->claims->count()
        ];
    }
}
