<?php

namespace App\Http\Resources;

use App\Models\Provider;
use Illuminate\Http\Resources\Json\JsonResource;

class ProviderResource extends JsonResource
{
    public function toArray($request): array
    {
        /** @var Provider $this */
        return [
            'id' => $this->id,
            'name' => $this->name,
            'phones' => $this->phones,
            'status' => $this->status
        ];
    }
}
