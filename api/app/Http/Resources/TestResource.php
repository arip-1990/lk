<?php

namespace App\Http\Resources;

use App\Models\Test;
use App\UseCases\TestService;
use Illuminate\Http\Resources\Json\JsonResource;

class TestResource extends JsonResource
{
    public function toArray($request): array
    {
        /** @var Test $this */
        return [
            'id' => $this->id,
            'category' => new CategoryResource($this->category),
            'score' => $this->score,
            'totalScore' => $this->results->count(),
            'start' => $this->created_at->format('Y-m-d H:i:s'),
            'finish' => $this->finished_at?->format('Y-m-d H:i:s'),
            'results' => (new TestService())->getResults($this, true)
        ];
    }
}
