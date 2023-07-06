<?php

namespace App\Console\Commands\Import;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use Illuminate\Console\Command;

abstract class ImportCommand extends Command
{
    protected function getData(ImportType $type = ImportType::STORE): \SimpleXMLElement
    {
        $config = config('services.1c');
        try {
            $client = new Client([
                'base_uri' => $config['base_url'],
                'auth' => [$config['login'], $config['password']],
                'verify' => false
            ]);

            $response = $client->get($config['urls'][$type->value]);
            $xml = simplexml_load_string($response->getBody()->getContents());
            if ($xml === false)
                throw new \DomainException('Ошибка парсинга xml');

            return $xml;
        } catch (\Exception | GuzzleException $e) {
            throw new \DomainException($e->getMessage());
        }
    }
}
