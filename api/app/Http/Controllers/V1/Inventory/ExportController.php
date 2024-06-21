<?php

namespace App\Http\Controllers\V1\Inventory;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Inventory;
use Carbon\Carbon;
use Illuminate\Http\Request;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class ExportController extends Controller
{
    public function export(Category $category, Request $request)
    {
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        $sheet->setCellValue('A1', '№');
        $sheet->setCellValue('B1', 'Описание, характеристика');
        $sheet->setCellValue('C1', 'Адрес аптеки');
        $sheet->setCellValue('D1', 'Инвентарный номер');
        $sheet->setCellValue('E1', 'Line 1');
        $sheet->setCellValue('F1', 'Line 2');
        $sheet->setCellValue('G1', 'Barcode');
        $sheet->setCellValue('H1', 'Sheet');

        $data = Inventory::where('category_id', $category->id)->get();

        $row = 2;
        foreach ($data as $item) {
            $sheet->setCellValue('A' . $row, $item->id);
            $sheet->setCellValue('B' . $row, $item->description);
            if ($item->store == null) {
                $sheet->setCellValue('C' . $row, 'Офис');
            } else {
                $sheet->setCellValue('C' . $row, $item->store->name);
            }
            $sheet->setCellValue('D' . $row, $item->inventory_number);
            $sheet->setCellValue('E' . $row, $item->line1);
            $sheet->setCellValue('F' . $row, $item->line2);
            $sheet->setCellValue('G' . $row, $item->barcode);
            $sheet->setCellValue('H' . $row, $item->sheet);
            $row++;
        }

        $fileName = $category->name . '.xlsx';
        $filePath = storage_path('app/' . $fileName);
        $writer = new Xlsx($spreadsheet);
        $writer->save($filePath);

        return response()->download($filePath)->deleteFileAfterSend(true);
    }
}










