<?php

namespace App\Events;

use App\Message;
use App\User;
use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class MessagePosted implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Message
     * @var Message Message being broadcast
     *
     */
    public $message;
    /**
     * User
     * @var User User account message was sent from
     */
    public $user;

    /**
     * Create a new event instance.
     *
     * @param Message $message
     * @param User $user
     */
    public function __construct(Message $message, User $user)
    {
        //
        $this->message = $message;
        $this->user = $user;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new PresenceChannel('chatroom');
    }
}
