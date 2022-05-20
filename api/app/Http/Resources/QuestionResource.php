<?php

namespace App\Http\Resources;

use App\Models\Question;
use Illuminate\Http\Resources\Json\JsonResource;

class QuestionResource extends JsonResource
{
    public function toArray($request): array
    {
        /** @var Question $this */
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'answers' => AnswerResource::collection($this->answers)
        ];
    }
}
