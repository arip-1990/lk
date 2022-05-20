<?php

namespace App\Http\Resources;

use App\Models\Answer;
use Illuminate\Http\Resources\Json\JsonResource;

class AnswerResource extends JsonResource
{
    public function toArray($request): array
    {
        /** @var Answer $this */
        return [
            'id' => $this->id,
            'title' => $this->title,
            'comment' => $this->comment,
            'correct' => $this->correct,
        ];
    }
}
