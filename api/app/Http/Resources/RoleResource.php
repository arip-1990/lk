<?php

namespace App\Http\Resources;

use App\Models\Role;
use Illuminate\Http\Resources\Json\JsonResource;

class RoleResource extends JsonResource
{
    public function toArray($request): array
    {
        /** @var Role $this */
        return [
            'name' => $this->name,
            'description' => $this->description,
        ];
    }
}
