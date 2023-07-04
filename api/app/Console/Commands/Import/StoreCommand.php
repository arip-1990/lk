<?php

namespace App\Console\Commands\Import;

use App\Models\City;
use App\Models\Location;
use App\Models\Store;
use Carbon\Carbon;
use Ramsey\Uuid\Uuid;

class StoreCommand extends ImportCommand
{
    protected $signature = 'import:store';
    protected $description = 'Import stores';

    public function handle(): int
    {
        $this->info('Import stores');
        $startTime = Carbon::now();

        try {
            $data = $this->getData();

            $sort = Store::orderByDesc('sort')->first()?->sort ?? 0;
            $fields = [];
            foreach ($data->pharmacies->pharmacy as $item) {
                $type = null;
                $prefix = null;
                $address = explode(',', $item->address);
                if (count($address) === 4) {
                    $city = trim(str_replace(['мкр.', 'мкр ', 'пгт.', 'пгт '], '', $address[1]));
                    if (str_contains(strtolower($address[2]), 'пр')) {
                        $type = Location::TYPE_AVENUE;
                        $prefix = 'пр';
                    }
                    elseif (str_contains(strtolower($address[2]), 'ул')) {
                        $type = Location::TYPE_STREET;
                        $prefix = 'ул';
                    }

                    $street = trim(str_replace(['пр.', 'пр ', 'ул.', 'ул '], '', $address[2]));
                    $house = trim(str_replace(['д.', 'д', ' '], '', $address[3]));
                }
                else {
                    $city = trim($address[0]);
                    if (str_contains(strtolower($address[1]), 'пр')) {
                        $type = Location::TYPE_AVENUE;
                        $prefix = 'пр';
                    }
                    elseif (str_contains(strtolower($address[1]), 'ул')) {
                        $type = Location::TYPE_STREET;
                        $prefix = 'ул';
                    }

                    $street = trim(str_replace(['пр.', 'пр ', 'ул.', 'ул '], '', $address[1]));
                    $house = trim(str_replace(['д.', 'д', ' '], '', $address[2]));
                }

                if (!$city = City::firstWhere('name', $city))
                    continue;

                $street = str_replace(['Петра 1', 'Ахмет-хана'], ['Петра I', 'Амет-Хана'], $street);
                $house = preg_replace('/\(.+\)/', '', $house);
                if (!$location = Location::where('city_id', $city->id)->where('street', $street)->where('house', $house)->first())
                    $location = Location::create([
                        'id' => Uuid::uuid4()->toString(),
                        'type' => $type,
                        'prefix' => $prefix,
                        'city_id' => $city->id,
                        'street' => $street,
                        'house' => $house
                    ]);

                if ($coordinates = $item->coordinates and (float)$coordinates->lat)
                    $location->update(['coordinate' => [(float)$coordinates->lat, (float)$coordinates->lon]]);

                $schedules = [];
                foreach ($item->schedules->schedule as $schedule) {
                    $schedules[] = [
                        'open' => (string) $schedule->open_time,
                        'close' => (string) $schedule->close_time
                    ];
                }

                $fields[] = [
                    'id' => (string)$item->uuid,
                    'name' => (string)$item->title,
                    'phone' => trim((string)$item->phone, '+') ?: null,
                    'schedule' => json_encode($schedules, JSON_UNESCAPED_UNICODE),
                    'location_id' => $location->id,
                    'status' => true,
                    'sort' => $sort++,
                    'company_id' => str_contains(strtolower((string)$item->title), 'дф') ? 2 : 1
                ];
            }

            Store::upsert($fields, 'id', ['name', 'phone', 'schedule']);
        } catch (\DomainException $e) {
            $this->error($e->getMessage());

            return self::FAILURE;
        }

        $this->info('Аптеки успешно обновлены: ' . $startTime->diff(Carbon::now())->format('%iм %sс'));

        return self::SUCCESS;
    }
}
