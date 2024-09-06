<?php

namespace App\Listeners;

use App\Events\StatementEvent;
use Illuminate\Support\Facades\Http;
use GuzzleHttp\Exception\GuzzleException;


class SendStatementNotification
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
     * @throws GuzzleException
     */
    public function handle(StatementEvent $event):void
    {
        $statement = $event->data->load(['store', 'applicant']);

        // Преобразование модели в массив с включенными связанными данными
        $data = $statement->toArray();

//        Http::post('http://192.168.0.103:5000/broadcast', [
//            $data
//        ]);
    }
}




