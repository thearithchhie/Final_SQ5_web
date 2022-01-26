<?php
namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class OrderChangedEvent
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $oldStatus;

    public $updatedOrder;

    /**
     * OrderChangedEvent constructor.
     * @param $oldOrder
     * @param $updatedOrder
     */
    public function __construct($oldStatus, $updatedOrder)
    {
        $this->oldStatus = $oldStatus;
        $this->updatedOrder = $updatedOrder;
    }


}
