<?php

namespace App\Events;

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

    public function __construct(public User $user, public Statement $statement) {}

    /**
     * Get the channels the event should broadcast on.
     */
    public function broadcastOn(): Channel|PrivateChannel|array
    {
        return new PrivateChannel('statement');
    }
}
