<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class TestCommand extends Command
{
    protected $signature = 'test';
    protected $description = 'Тестовая команда';

    public function handle(): int
    {
//        Notification::send([$user], new StatementCreated($statement));
//        $spreadsheet = new Spreadsheet();
//        $sheet = $spreadsheet->getActiveSheet();
//        $sheet->setTitle('Products');
//        $sheet->setCellValue('A1', 'Дата');
//        $sheet->setCellValue('B1', 'Адрес аптеки');
//        $sheet->setCellValue('C1', 'Что необходимо выполнить');
//        $sheet->setCellValue('D1', 'Заявитель');
//        $sheet->setCellValue('E1', 'Комментарий');
//        $sheet->setCellValue('F1', 'Дата исполнения');
//        $sheet->getStyle('A1')->applyFromArray([
//            'font' => ['bold' => true],
//            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER]
//        ]);
//        $sheet->getStyle('B1')->applyFromArray([
//            'font' => ['bold' => true],
//            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER]
//        ]);
//        $sheet->getStyle('C1')->applyFromArray([
//            'font' => ['bold' => true],
//            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER]
//        ]);
//        $sheet->getStyle('D1')->applyFromArray([
//            'font' => ['bold' => true],
//            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER]
//        ]);
//        $sheet->getStyle('E1')->applyFromArray([
//            'font' => ['bold' => true],
//            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER]
//        ]);
//        $sheet->getStyle('F1')->applyFromArray([
//            'font' => ['bold' => true],
//            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER]
//        ]);
//
//        $i = 2;
//        $statements = Statement::query()->where('category_id', 67)->orderBy('status')->orderBy('created_at')->get();
//        /** @var Statement $statement */
//        foreach ($statements as $statement) {
//            $sheet->setCellValue('A' . $i, $statement->created_at->format('d-m-Y H:i'));
//            $sheet->setCellValue('B' . $i, $statement->store?->name ?? '');
//            $sheet->setCellValue('C' . $i, $statement->must);
//            $sheet->setCellValue('D' . $i, $statement->user->first_name . ' ' . $statement->user->last_name);
//            $sheet->setCellValue('E' . $i, $statement->comment);
//            $sheet->setCellValue('F' . $i, $statement->done_at?->format('d-m-Y H:i') ?? '');
//
//            $i++;
//        }
//
//        $writer = new Xlsx($spreadsheet);
//        $writer->save(Storage::disk('local')->path('Отдел эксплуатации.xlsx'));

        return 0;
    }
}
