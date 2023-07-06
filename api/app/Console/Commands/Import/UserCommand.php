<?php

namespace App\Console\Commands\Import;

use App\Models\Role;
use App\Models\Store;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Ramsey\Uuid\Uuid;

class UserCommand extends ImportCommand
{
    protected $signature = 'import:user';
    protected $description = 'Import users';

    public function handle(): int
    {
        $this->info('Import users');
        $startTime = Carbon::now();

        $data = $this->getData(ImportType::USER);
        foreach ($data->row as $item) {
            if (!$barcode = (string)$item->id) continue;

            $fio = array_filter(explode(' ', (string)$item->fio), fn(string $element) => !empty($element));
            if (!count($fio)) {
                User::where('barcode', $barcode)->first()?->update(['status' => false]);
                continue;
            }

            $lastName = array_shift($fio);
            $firstName = array_shift($fio) ?? '';
            $middleName = array_shift($fio);
            $position = (string)$item->pisition;

            try {
                try {
                    $user = User::where('barcode', $barcode)->firstOrFail();
                    $user->first_name = $firstName;
                    $user->last_name = $lastName;
                    $user->middle_name = $middleName;
                }
                catch (ModelNotFoundException $e) {
                    $role = Role::where('name', Role::WORKER)->firstOrFail();
                    if ($position) {
                        if (str_starts_with(mb_strtolower($position), 'директор')
                            or str_starts_with(mb_strtolower($position), 'заместитель директора')
                            or str_starts_with(mb_strtolower($position), 'руководитель отдела продаж')) {
                            $role = Role::where('name', Role::ADMIN)->firstOrFail();
                        }
                        elseif (str_starts_with(mb_strtolower($position), 'заведующ')) {
                            $role = Role::where('name', Role::MANAGER)->firstOrFail();
                        }
                    }

                    $user = new User([
                        'id' => Uuid::uuid4()->toString(),
                        'barcode' => $barcode,
                        'first_name' => $firstName,
                        'last_name' => $lastName,
                        'middle_name' => $middleName,
                        'role_id' => $role?->id
                    ]);
                }

                $user->status = ((string)$item->active === '1' and (string)$item->operatorkkm === 'true');
                if ($inn = (string)$item->inn) $user->inn = $inn;
                if ($position) $user->position = $position;

                $user->save();

                try {
                    $stores = [];
                    foreach ($item->apteki as $item2) {
                        foreach ($item2->uuid as $uuid) {
                            if ($store = Store::find((string)$uuid)) $stores[] = $store->id;
                        }
                    }

                    $user->stores()->sync($stores);
                }
                catch (\DomainException $e) {}
            }
            catch (\Exception $e) {
                $this->error($e->getMessage());

                return self::FAILURE;
            }
        }

        $this->info('Пользователи успешно обновлены: ' . $startTime->diff(Carbon::now())->format('%iм %sс'));

        return self::SUCCESS;
    }
}
