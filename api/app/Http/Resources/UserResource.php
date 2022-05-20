<?php

namespace App\Http\Resources;

use App\Models\User;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray($request): array
    {
        /** @var User $this */
        return [
            'id' => $this->id,
            'firstName' => $this->first_name,
            'lastName' => $this->last_name,
            'middleName' => $this->middle_name,
            'barcode' => $this->barcode,
            'email' => $this->email,
            'inn' => $this->inn,
            'mobilePhone' => $this->mobile_phone,
            'internalPhones' => $this->internal_phones,
            'position' => $this->position,
            'status' => $this->status,
            'role' => new RoleResource($this->role),
            'stores' => StoreResource::collection($this->stores)
        ];
    }
}
