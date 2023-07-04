<?php

namespace App\Console\Commands\Import;

use App\Models\Role;
use App\Models\Store;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class UserCommand extends ImportCommand
{
    protected $signature = 'import:user';
    protected $description = 'Import users';

    public function handle(): int
    {
        $this->info('Import users');
        $startTime = Carbon::now();

        $data = $this->getData('user');
        foreach ($data->row as $item) {
            if (!$barcode = (string)$item->id) continue;

            $fio = array_filter(explode(' ', (string)$item->fio), fn (string $element) => !empty($element));
            $lastName = array_shift($fio);
            $firstName = array_shift($fio);
            $middleName = array_shift($fio);
            $position = (string)$item->pisition;
            $active = ((string)$item->active === '1' and (string)$item->operatorkkm === 'true');

            try {
                try {
                    $user = User::where('barcode', $barcode)->firstOrFail();
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
                            $role = Role::where('name', Role::ADMIN)->firstOrFail();
                        }
                        elseif (str_starts_with(strtolower($position), 'Заведующая')
                            or str_starts_with(strtolower($position), 'Заведующий')) {
                            $role = Role::where('name', Role::MANAGER)->firstOrFail();
                        }
                        else {
                            $role = Role::where('name', Role::WORKER)->firstOrFail();
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
                            if ($store = Store::find((string)$uuid))
                                $stores[] = $store;
                        }
                    }
                    $user->stores()->sync($stores);
                }
                catch (\DomainException $e) {}

                $user->save();
            }
            catch (\Exception $e) {
                $this->error($e->getMessage());

                return self::FAILURE;
            }
        }

        $this->info('Аптеки успешно обновлены: ' . $startTime->diff(Carbon::now())->format('%iм %sс'));

        return self::SUCCESS;
    }
}
