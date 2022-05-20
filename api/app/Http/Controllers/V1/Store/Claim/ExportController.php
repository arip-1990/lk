<?php

namespace App\Http\Controllers\V1\Store\Claim;

use App\Models\Claim;
use Illuminate\Routing\Controller;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class ExportController extends Controller
{
    public function handle()
    {
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setCellValue('A1', 'Аптека');
        $sheet->mergeCells('A1:F1');
        $sheet->setCellValue('A2', 'Дата');
        $sheet->setCellValue('B2', 'Поставщик');
        $sheet->setCellValue('C2', 'Накладная, номер и дата');
        $sheet->setCellValue('D2', 'Недовоз, указать сколько мест');
        $sheet->setCellValue('E2', 'Недовложение, указать  наименование и количество');
        $sheet->setCellValue('F2', 'Дата довоза по этой накладной');

        $sheet->getColumnDimension('A')->setAutoSize(true);
        $sheet->getColumnDimension('B')->setAutoSize(true);
        $sheet->getColumnDimension('C')->setAutoSize(true);
        $sheet->getColumnDimension('D')->setAutoSize(true);
        $sheet->getColumnDimension('E')->setAutoSize(true);
        $sheet->getColumnDimension('F')->setAutoSize(true);
        $sheet->getStyle('A1:F1')->getFont()->setBold(true);
        $sheet->getStyle('A2:F2')->getFont()->setBold(true);
        $sheet->getStyle('A2:F2')->getAlignment()->setHorizontal('center');

        $index = 3;
        $claims = [];
        /** @var Claim $claim */
        foreach (Claim::all() as $claim)
            $claims[$claim->store->name][] = $claim;

        foreach ($claims as $key => $items) {
            $sheet->setCellValue('A' . $index, $key);

            foreach ($items as $claim) {
                $index++;
                $sheet->setCellValue('A' . $index, $claim->created_at->format('d/m/Y'));
                $sheet->getStyle('A' . $index)->getNumberFormat()->setFormatCode(NumberFormat::FORMAT_DATE_DDMMYYYY);
                $sheet->setCellValue('B' . $index, $claim->provider->name);
                $sheet->setCellValue('C' . $index, $claim->invoice);
                $sheet->setCellValue('D' . $index, $claim->not_delivery);
                $sheet->setCellValue('E' . $index, $claim->not_attachment);
                $sheet->setCellValue('F' . $index, $claim->delivery_at?->format('d/m/Y') ?? '');
                $sheet->getStyle('F' . $index)->getNumberFormat()->setFormatCode(NumberFormat::FORMAT_DATE_DDMMYYYY);

                $sheet->getStyle('A' . $index . ':F' . $index)->getAlignment()->setHorizontal('right');

                $sheet->getRowDimension($index)->setOutlineLevel(1);
                $sheet->getRowDimension($index)->setVisible(true);
            }

            $index++;
            $sheet->getRowDimension($index)->setCollapsed(true);
            $index++;
        }

        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Disposition: attachment; filename="Претензии к поставщикам.xlsx"');
        (new Xlsx($spreadsheet))->save('php://output');
    }
}
