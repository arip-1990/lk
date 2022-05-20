<?php

namespace App\Http\Resources;

use App\Models\TimeCard;
use Illuminate\Http\Resources\Json\JsonResource;

class TimeCardResource extends JsonResource
{
    public function toArray($request): array
    {
        /** @var TimeCard $this */
        return [
            'id' => $this->id,
            'timeCardNum' => $this->time_card_number,
            'normativeDays' => $this->normative->days,
            'normativeHours' => $this->normative->hours,
            'user' => $this->user,
            'post' => $this->post,
            'attendances' => $this->attendance
        ];
    }
}
