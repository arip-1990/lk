<?php

namespace App\Console\Commands;

use App\Models\Normative;
use App\Models\Store;
use App\Models\TimeCard;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;
use PhpOffice\PhpSpreadsheet\IOFactory;

class TimeCardCommand extends Command
{
    protected $signature = 'import:timeCard';
    protected $description = 'Import timeCard';

    public function handle(): int
    {
        $this->info('Import timeCard');
        $path = $this->copyFile();

        $reader = IOFactory::createReader('Xlsx');
        $reader->setReadDataOnly(true);
        $sheet = $reader->load($path);

        $store = null;
        foreach ($sheet->getActiveSheet()->toArray() as $row) {
            try {
                if (is_numeric($row[0]) and $store) {
                    $normative = Normative::query()
                        ->where('schedule', json_encode(['days' => trim($row[7]), 'hours' => $row[6]], JSON_UNESCAPED_UNICODE))
                        ->where('days', $row[4])->where('hours', $row[5])->first();
                    if (!$normative) {
                        $normative = Normative::query()->create([
                            'days' => $row[4],
                            'hours' => $row[5],
                            'schedule' => new Collection(['days' => trim($row[7]), 'hours' => $row[6]])
                        ]);
                    }

                    $timeCard = TimeCard::query()->where('user', trim($row[1]))
                        ->where('store_id', $store->id)->where('post', trim($row[2]))->first();
                    if ($timeCard) {
                        $timeCard->update([
                            'time_card_number' => trim($row[3]) ?? '',
                            'normative_id' => $normative->id
                        ]);
                    }
                    else {
                        TimeCard::query()->create([
                            'user' => trim($row[1]),
                            'post' => trim($row[2]),
                            'store_id' => $store,
                            'time_card_number' => trim($row[3]) ?? '',
                            'normative_id' => $normative->id
                        ]);
                    }
                }
                elseif (is_string($row[0]) and strlen($row[0]) > 5) {
                    $store = Store::query()->where('name', trim($row[0]))->first();
                }
            }
            catch (\DomainException $e) {}
        }

        $this->info('Done!');

        return 0;
    }

    private function copyFile(): string
    {
        $path = Storage::disk('local')->path('tmp/Табель.xlsx');
        $connection = ssh2_connect('192.168.2.16');
        if (!ssh2_auth_password($connection, 'arip', 'Arip_1990'))
            throw new \DomainException('Ошибка подключеня!');

        $sftp = ssh2_sftp($connection);
        $statInfo = ssh2_sftp_stat($sftp, '/E:/soc_apteka/Табель ДФ/Табель.xlsx');
        if ($statInfo['size'] <= 0)
            throw new \DomainException('Пустой файл!');

        $timeCard = TimeCard::query()->orderByDesc('created_at')->first();
        if ($timeCard and $timeCard->created_at >= Carbon::parse($statInfo['mtime']))
            throw new \DomainException('Нет изменений в файле!');

        $stream = @fopen('ssh2.sftp://' . intval($sftp) . '/E:/soc_apteka/Табель ДФ/Табель.xlsx', 'r');
        if (!$stream)
            throw new \DomainException("Не получилось открыть файл: /E:/soc_apteka/Табель ДФ/Табель.xlsx");

        $contents = stream_get_contents($stream);
        file_put_contents ($path, $contents);
        @fclose($stream);

        return $path;
    }
}
