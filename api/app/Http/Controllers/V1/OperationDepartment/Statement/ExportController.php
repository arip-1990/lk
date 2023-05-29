<?php

namespace App\Http\Controllers\V1\OperationDepartment\Statement;

use App\Models\Category;
use App\Models\Statement;
use Carbon\Carbon;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Symfony\Component\HttpFoundation\Response;

class ExportController extends Controller
{
    public function __invoke(Category $category): Response
    {
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Products');
        $sheet->setCellValue('A1', '№');
        $sheet->setCellValue('B1', 'Дата');
        $sheet->setCellValue('C1', 'Адрес аптеки');
        $sheet->setCellValue('D1', $category->id === 67 ? 'Что необходимо выполнить' : 'Описание проблемы');
        $sheet->setCellValue('E1', 'Вложение');
        $sheet->setCellValue('F1', 'Заявитель');
        $sheet->setCellValue('G1', 'Комментарий');
        if ($category->id === 87) {
            $sheet->setCellValue('H1', 'Вложение склада');
            $sheet->setCellValue('I1', 'Дата исполнения');
        }
        else {
            $sheet->setCellValue('H1', 'Дата исполнения');
        }

        $sheet->getStyle('A1')->applyFromArray([
            'font' => ['bold' => true],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'wrapText' => true]
        ]);
        $sheet->getStyle('B1')->applyFromArray([
            'font' => ['bold' => true],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'wrapText' => true]
        ]);
        $sheet->getStyle('C1')->applyFromArray([
            'font' => ['bold' => true],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'wrapText' => true]
        ]);
        $sheet->getStyle('D1')->applyFromArray([
            'font' => ['bold' => true],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'wrapText' => true]
        ]);
        $sheet->getStyle('E1')->applyFromArray([
            'font' => ['bold' => true],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'wrapText' => true]
        ]);
        $sheet->getStyle('F1')->applyFromArray([
            'font' => ['bold' => true],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'wrapText' => true]
        ]);
        $sheet->getStyle('G1')->applyFromArray([
            'font' => ['bold' => true],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'wrapText' => true]
        ]);
        $sheet->getStyle('H1')->applyFromArray([
            'font' => ['bold' => true],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'wrapText' => true]
        ]);
        if ($category->id === 87) {
            $sheet->getStyle('I1')->applyFromArray([
                'font' => ['bold' => true],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'wrapText' => true]
            ]);
        }

        $i = 2;
        Statement::where('category_id', $category->id)->orderBy('status')
            ->orderBy('created_at')->chunk(1000, function ($statements) use (&$i, $sheet, $category) {
                /** @var Statement $statement */
                foreach ($statements as $statement) {
                    $sheet->setCellValue('A' . $i, $i - 1);
                    $sheet->setCellValue('B' . $i, $statement->created_at->format('d-m-Y H:i'));
                    $sheet->setCellValue('C' . $i, $statement->store?->name ?? '');
                    $sheet->setCellValue('D' . $i, $statement->must);
                    $sheet->setCellValue('E' . $i, $statement->hasMedia() ? 'Есть' : 'Нет');
                    $sheet->setCellValue('F' . $i, $statement->user->first_name . ' ' . $statement->user->last_name);
                    $sheet->setCellValue('G' . $i, $statement->comment);

                    if ($category->id === 87) {
                        $sheet->setCellValue('H' . $i, $statement->hasMedia(true) ? 'Есть' : 'Нет');
                        $sheet->setCellValue('I' . $i, $statement->done_at?->format('d-m-Y H:i') ?? '');
                    }
                    else {
                        $sheet->setCellValue('H' . $i, $statement->done_at?->format('d-m-Y H:i') ?? '');
                    }

                    if ($statement->hasMedia())
                        $sheet->getCell('E' . $i)->getHyperlink()->setUrl(env('APP_URL') . URL::route('download.statement', ['statement' => $statement], false));

                    if ($category->id === 87 and $statement->hasMedia(true))
                        $sheet->getCell('H' . $i)->getHyperlink()->setUrl(env('APP_URL') . URL::route('download.statement', ['statement' => $statement, 'answer' => true], false));

                    $i++;
                }
            });

        $fileName = Carbon::now()->format('Y-m-d') . '-' . $category->name . '.xlsx';
        $writer = new Xlsx($spreadsheet);
        $writer->save(Storage::disk('local')->path($fileName));

        return Storage::disk('local')->download($fileName);
    }
}
