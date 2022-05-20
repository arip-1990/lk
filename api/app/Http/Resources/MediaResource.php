<?php

namespace App\Http\Resources;

use App\Models\Media;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class MediaResource extends JsonResource
{
    public function toArray($request): array
    {
        /** @var Media $this */
        $fileUrl = null;
        foreach (Storage::files($this->getMediaPath()) as $file) {
            $tmp = explode('/', $file);
            if (str_starts_with($tmp[count($tmp) - 1], $this->id)) {
                $fileUrl = Storage::url($file);
                break;
            }
        }
        return [
            'id' => $this->id,
            'title' => $this->title,
            'type' => $this->type,
            'sort' => $this->sort,
            'url' => $fileUrl,
            'createdAt' => $this->created_at->format('Y-m-d')
        ];
    }
}
