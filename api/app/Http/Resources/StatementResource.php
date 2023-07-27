<?php

namespace App\Http\Resources;

use App\Models\Statement;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\URL;

class StatementResource extends JsonResource
{
    public function toArray($request): array
    {
        /** @var Statement $this */
        return [
            'id' => $this->id,
            'category' => new CategoryResource($this->category),
            'must' => $this->must,
            'comment' => $this->comment,
            'createdAt' => $this->created_at->format('Y-m-d'),
            'doneAt' => $this->done_at?->format('Y-m-d'),
            'status' => $this->status,
            'media' => $this->hasMedia() ? env('APP_URL') . URL::route('download.statement', ['statement' => $this], false) : null,
            'answerMedia' => $this->hasMedia(true) ? env('APP_URL') . URL::route('download.statement', ['statement' => $this, 'answer' => true], false) : null,
            'applicant' => new UserResource($this->applicant),
            'performer' => new UserResource($this->performer),
            'store' => new StoreResource($this->store),
        ];
    }
}
