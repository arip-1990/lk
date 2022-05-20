<?php

namespace App\Http\Resources;

use App\Models\Claim;
use Illuminate\Http\Resources\Json\JsonResource;

class ClaimResource extends JsonResource
{
    public function toArray($request): array
    {
        /** @var Claim $this */
        return [
            'id' => $this->id,
            'provider' => new ProviderResource($this->provider),
            'invoice' => $this->invoice,
            'notDelivery' => $this->not_delivery,
            'notAttachment' => $this->not_attachment,
            'regrading' => $this->regrading,
            'shortShelfLife' => $this->short_shelf_life?->format('Y-m-d'),
            'deliveryAt' => $this->delivery_at?->format('Y-m-d H:i:s'),
            'createdAt' => $this->created_at->format('Y-m-d'),
            'store' => new StoreResource($this->store)
        ];
    }
}
