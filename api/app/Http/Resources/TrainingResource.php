<?php

namespace App\Http\Resources;

use App\Models\Training;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class TrainingResource extends JsonResource
{
    public function toArray($request): array
    {
        /** @var Training $this */
        $fileUrl = null;
        foreach (Storage::files('trainings') as $file) {
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
            'link' => $this->link ?? $fileUrl,
        ];
    }
}
