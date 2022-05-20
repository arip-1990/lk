<?php

namespace App\Http\Resources;

use App\Models\Document;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class DocumentResource extends JsonResource
{
    public function toArray($request): array
    {
        /** @var Document $this */
        return [
            'id' => $this->id,
            'title' => $this->title,
            'type' => $this->type,
            'sort' => $this->sort,
            'url' => Storage::url("documents/{$this->id}.{$this->type}"),
        ];
    }
}
