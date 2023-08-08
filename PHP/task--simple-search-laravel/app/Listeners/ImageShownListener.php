<?php

namespace App\Listeners;

use App\Events\ImageShown;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class ImageShownListener
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  \App\Events\ImageShown  $event
     * @return void
     */
    public function handle(ImageShown $event)
    {
        //
    }
}
