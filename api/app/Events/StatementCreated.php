<?php

namespace App\Events;

use App\Http\Resources\StatementResource;
use App\Http\Resources\UserResource;
use App\Models\Statement;
use App\Models\User;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class StatementCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public UserResource $user;
    public StatementResource $statement;

    public function __construct(User $user, Statement $statement) {
        $this->user = new UserResource($user);
        $this->statement = new StatementResource($statement);
    }

    /**
     * Get the channels the event should broadcast on.
     */
    public function broadcastOn(): Channel|PrivateChannel|array
    {
        return new Channel('statement');
    }
}
