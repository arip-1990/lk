<?php

namespace App\Console\Commands\Export;

use App\Models\Statement;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class StatementCommand extends Command
{
    protected $signature = 'export:statement';
    protected $description = 'Выгрузка заявок';

    public function handle(): int
    {
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Заявки в отдел IT');
        $sheet->setCellValue('A1', '№');
        $sheet->setCellValue('B1', 'Дата');
        $sheet->setCellValue('C1', 'Адрес аптеки');
        $sheet->setCellValue('D1', 'Что необходимо выполнить');
        $sheet->setCellValue('E1', 'Заявитель');
        $sheet->setCellValue('F1', 'Комментарий');
        $sheet->setCellValue('G1', 'Дата исполнения');
        $sheet->getStyle('A1')->applyFromArray([
            'font' => ['bold' => true],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER]
        ]);
        $sheet->getStyle('B1')->applyFromArray([
            'font' => ['bold' => true],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER]
        ]);
        $sheet->getStyle('C1')->applyFromArray([
            'font' => ['bold' => true],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER]
        ]);
        $sheet->getStyle('D1')->applyFromArray([
            'font' => ['bold' => true],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER]
        ]);
        $sheet->getStyle('E1')->applyFromArray([
            'font' => ['bold' => true],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER]
        ]);
        $sheet->getStyle('F1')->applyFromArray([
            'font' => ['bold' => true],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER]
        ]);
        $sheet->getStyle('G1')->applyFromArray([
            'font' => ['bold' => true],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER]
        ]);

        $i = 2;
        Statement::where('category_id', 68)->orderBy('status')->orderBy('created_at')->chunk(1000, function ($statements) use (&$i, $sheet) {
            /** @var Statement $statement */
            foreach ($statements as $statement) {
                $sheet->setCellValue('A' . $i, $i - 1);
                $sheet->setCellValue('B' . $i, $statement->created_at->format('d-m-Y H:i'));
                $sheet->setCellValue('C' . $i, $statement->store?->name ?? '');
                $sheet->setCellValue('D' . $i, $statement->must);
                $sheet->setCellValue('E' . $i, $statement->user->first_name . ($statement->user->last_name ? " {$statement->user->last_name}" : ''));
                $sheet->setCellValue('F' . $i, $statement->comment);
                $sheet->setCellValue('G' . $i, $statement->done_at?->format('d-m-Y H:i') ?? '');

                $i++;
            }
        });

        $writer = new Xlsx($spreadsheet);
        $writer->save(Storage::disk('local')->path('Отдел IT.xlsx'));

        return 0;
    }
}
