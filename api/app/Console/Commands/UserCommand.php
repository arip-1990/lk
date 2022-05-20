<?php

namespace App\Console\Commands;

use App\Models\Role;
use App\Models\Store;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class UserCommand extends Command
{
    protected $signature = 'import:user';
    protected $description = 'Import users';

    public function handle(): int
    {
        $this->info('Import users');
        $data = simplexml_load_file('http://external:123456@10.8.0.30:180/cb/hs/ExternalAPIv2/users');
        $count_data = count($data->row);
        $i = 1;
        foreach ($data->row as $item) {
            $this->info("\033[2KЗапись данных: " . $i . ' / ' . $count_data . "\r");
            if (!$barcode = (string)$item->id) continue;

            $fio = array_filter(explode(' ', (string)$item->fio), fn (string $element) => !empty($element));
            $lastName = array_shift($fio);
            $firstName = array_shift($fio);
            $middleName = array_shift($fio);
            $position = (string)$item->pisition;
            $active = ((string)$item->active === '1' and (string)$item->operatorkkm === 'true');

            try {
                try {
                    /** @var User $user */
                    $user = User::query()->where('barcode', $barcode)->firstOrFail();
                    $user->first_name = $firstName ?? '';
                    $user->last_name = $lastName;
                    $user->middle_name = $middleName;
                }
                catch (ModelNotFoundException $e) {
                    $role = null;
                    try {
                        if (str_starts_with(strtolower($position), 'Директор')
                            or str_starts_with(strtolower($position), 'Заместитель директора')
                            or str_starts_with(strtolower($position), 'Руководитель отдела продаж')) {
                            $role = Role::query()->where('name', Role::ADMIN)->firstOrFail();
                        }
                        elseif (str_starts_with(strtolower($position), 'Заведующая')
                            or str_starts_with(strtolower($position), 'Заведующий')) {
                            $role = Role::query()->where('name', Role::MANAGER)->firstOrFail();
                        }
                        else {
                            $role = Role::query()->where('name', Role::WORKER)->firstOrFail();
                        }
                    }
                    catch (ModelNotFoundException $e) {}

                    $user = new User([
                        'barcode' => $barcode,
                        'first_name' => $firstName ?? '',
                        'last_name' => $lastName,
                        'middle_name' => $middleName,
                        'role_id' => $role?->id
                    ]);
                }
                $user->status = $active;
                if ($inn = (string)$item->inn) $user->inn = $inn;
                if ($position) $user->position = $position;

                try {
                    $stores = [];
                    foreach ($item->apteki as $item2) {
                        foreach ($item2->uuid as $uuid) {
                            if ($store = Store::query()->find((string)$uuid))
                                $stores[] = $store;
                        }
                    }
                    $user->stores()->sync($stores);
                }
                catch (\DomainException $e) {}

                $user->save();
            }
            catch (\Exception $e) {
                $this->newLine();
                return 1;
            }
            $i++;
        }

        return 0;
    }
}
