<?php

namespace App\Http\Controllers\V1\TimeCard;

use App\Models\Store;
use App\Models\TimeCard;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Collection;
use PhpOffice\PhpSpreadsheet\Cell\AdvancedValueBinder;
use PhpOffice\PhpSpreadsheet\Cell\Cell;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Color;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class ExportController extends Controller
{
    private Spreadsheet $spreadsheet;
    private int $lastDay = 0;

    public function __construct()
    {
        $this->spreadsheet = new Spreadsheet();
    }

    public function handle(Request $request, Store $store)
    {
        Cell::setValueBinder(new AdvancedValueBinder());

        $style = [
            'font' => [
                'size' => 10,
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER
            ]
        ];
        $this->spreadsheet->getDefaultStyle()->applyFromArray($style);
        $this->spreadsheet->getActiveSheet()->getRowDimension('17')->setRowHeight(23);
        $this->spreadsheet->getActiveSheet()->getRowDimension('18')->setRowHeight(20);
        $this->spreadsheet->getActiveSheet()->getRowDimension('19')->setRowHeight(20);
        $this->spreadsheet->getActiveSheet()->getRowDimension('20')->setRowHeight(20);
        $this->spreadsheet->getActiveSheet()->getRowDimension('21')->setRowHeight(20);
        $this->spreadsheet->getActiveSheet()->getColumnDimension('A')->setWidth(5);
        $this->spreadsheet->getActiveSheet()->getColumnDimension('B')->setWidth(30);
        $this->spreadsheet->getActiveSheet()->getColumnDimension('C')->setWidth(15);
        $this->spreadsheet->getActiveSheet()->getColumnDimension('D')->setWidth(5);
        $this->spreadsheet->getActiveSheet()->getColumnDimension('E')->setWidth(5);
        $this->spreadsheet->getActiveSheet()->getColumnDimension('F')->setWidth(5);
        $this->spreadsheet->getActiveSheet()->getColumnDimension('G')->setWidth(5);
        $this->spreadsheet->getActiveSheet()->getColumnDimension('H')->setWidth(5);
        $this->spreadsheet->getActiveSheet()->getColumnDimension('i')->setWidth(5);
        $this->spreadsheet->getActiveSheet()->getColumnDimension('J')->setWidth(5);
        $this->spreadsheet->getActiveSheet()->getColumnDimension('K')->setWidth(5);
        $this->spreadsheet->getActiveSheet()->getColumnDimension('L')->setWidth(5);
        $this->spreadsheet->getActiveSheet()->getColumnDimension('M')->setWidth(5);
        $this->spreadsheet->getActiveSheet()->getColumnDimension('N')->setWidth(5);
        $this->spreadsheet->getActiveSheet()->getColumnDimension('O')->setWidth(5);
        $this->spreadsheet->getActiveSheet()->getColumnDimension('P')->setWidth(5);
        $this->spreadsheet->getActiveSheet()->getColumnDimension('Q')->setWidth(5);
        $this->spreadsheet->getActiveSheet()->getColumnDimension('R')->setWidth(5);
        $this->spreadsheet->getActiveSheet()->getColumnDimension('S')->setWidth(5);
        $this->spreadsheet->getActiveSheet()->getColumnDimension('T')->setWidth(9);
        $this->spreadsheet->getActiveSheet()->getColumnDimension('U')->setWidth(8);
        $this->spreadsheet->getActiveSheet()->getColumnDimension('V')->setWidth(11);
        $this->spreadsheet->getActiveSheet()->getColumnDimension('W')->setWidth(7);
        $this->spreadsheet->getActiveSheet()->getColumnDimension('X')->setWidth(7);
        $this->spreadsheet->getActiveSheet()->getColumnDimension('Y')->setWidth(7);
        $this->spreadsheet->getActiveSheet()->getColumnDimension('Z')->setWidth(7);

        $exportDate = Carbon::parse($request->get('period'))->startOfMonth();
        $this->lastDay = (int)$exportDate->clone()->lastOfMonth()->format('d');
        $timeCards = TimeCard::query()->where('store_id', $store->id)
            ->whereBetween('created_at', [$exportDate, $exportDate->clone()->endOfMonth()])->get();

        $halfMonth = true;
        for ($i = 15; $i < 31; $i++) {
            if ($timeCards->first()?->attendance->get($i) and $timeCards->first()?->attendance->get($i)['status']) {
                $halfMonth = false;
                break;
            }
        }

        $toDate = $halfMonth ? $exportDate->clone()->addDays(14) : $exportDate->clone()->endOfMonth();
        $this->createHeader(Carbon::parse($request->get('date')), $exportDate, $toDate);
        $this->createTableHeader();
        $this->createTableBody($timeCards);

        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Disposition: attachment; filename="TimeCard.xlsx"');
        (new Xlsx($this->spreadsheet))->save('php://output');
    }

    private function createHeader(Carbon $editDate, Carbon $fromDate, Carbon $toDate): void
    {
        $sheet = $this->spreadsheet->getActiveSheet();
        $sheet->setCellValue('V1', "Унифицированная форма № Т-13\nУтверждена Постановлением Госкомстата\nРоссии от 08.04.2001 № 26");
        $sheet->getStyle('V1')->getFont()->setSize(10);
        $sheet->mergeCells('V1:Z3');
        $sheet->getStyle('V1:Z3')->getAlignment()->setHorizontal('right');

        $sheet->setCellValue('D5', 'ООО "Дагфарм+"');
        $sheet->mergeCells('D5:U5');
        $sheet->getStyle('D5:U5')->getFont()->setBold(true);
        $sheet->setCellValue('D6', '(наименование организации)');
        $sheet->mergeCells('D6:U6');

        $sheet->setCellValue('D9', 'Табель');
        $sheet->mergeCells('D9:U9');
        $sheet->getStyle('D9:U9')->getFont()->setBold(true);
        $sheet->setCellValue('D10', 'учета использования рабочего времени');
        $sheet->mergeCells('D10:U10');
        $sheet->getStyle('D10:U10')->getFont()->setBold(true);

        $sheet->setCellValue('Y6', 'Код');
        $sheet->getStyle('Y6')->getFont()->setSize(10);
        $sheet->mergeCells('Y6:Z6');
        $sheet->getStyle('Y6:Z6')->getBorders()->getTop()->setBorderStyle(Border::BORDER_MEDIUM)->setColor(new Color('DA291C'));
        $sheet->getStyle('Y6:Y10')->getBorders()->getLeft()->setBorderStyle(Border::BORDER_MEDIUM)->setColor(new Color('DA291C'));
        $sheet->getStyle('Z6:Z10')->getBorders()->getRight()->setBorderStyle(Border::BORDER_MEDIUM)->setColor(new Color('DA291C'));
        $sheet->getStyle('Y6:Z6')->getBorders()->getBottom()->setBorderStyle(Border::BORDER_THIN)->setColor(new Color('DA291C'));
        $sheet->setCellValue('Y7', '30008');
        $sheet->getStyle('Y7')->getFont()->setSize(10);
        $sheet->mergeCells('Y7:Z7');
        $sheet->getStyle('Y7:Z7')->getBorders()->getBottom()->setBorderStyle(Border::BORDER_THIN)->setColor(new Color('DA291C'));
        $sheet->mergeCells('Y8:Z8');
        $sheet->getStyle('Y8:Z8')->getBorders()->getBottom()->setBorderStyle(Border::BORDER_THIN)->setColor(new Color('DA291C'));
        $sheet->mergeCells('Y9:Z10');
        $sheet->getStyle('Y10:Z10')->getBorders()->getBottom()->setBorderStyle(Border::BORDER_MEDIUM)->setColor(new Color('DA291C'));
        $sheet->setCellValue('W7', 'Форма по ОКУД');
        $sheet->getStyle('W7')->getFont()->setSize(10);
        $sheet->mergeCells('W7:X7');
        $sheet->getStyle('W7:X7')->getAlignment()->setHorizontal('right');
        $sheet->setCellValue('W8', 'по ОКПО');
        $sheet->getStyle('W8')->getFont()->setSize(10);
        $sheet->mergeCells('W8:X8');
        $sheet->getStyle('W8:X8')->getAlignment()->setHorizontal('right');

        $sheet->setCellValue('M12', 'Номер документа');
        $sheet->getStyle('M12')->getFont()->setSize(10);
        $sheet->mergeCells('M12:P12');
        $sheet->getStyle('M12:T12')->getBorders()->getTop()->setBorderStyle(Border::BORDER_THIN)->setColor(new Color('DA291C'));
        $sheet->getStyle('M12:N14')->getBorders()->getLeft()->setBorderStyle(Border::BORDER_THIN)->setColor(new Color('DA291C'));
        $sheet->getStyle('P12:P14')->getBorders()->getRight()->setBorderStyle(Border::BORDER_THIN)->setColor(new Color('DA291C'));
        $sheet->getStyle('T12:T14')->getBorders()->getRight()->setBorderStyle(Border::BORDER_THIN)->setColor(new Color('DA291C'));
        $sheet->mergeCells('M13:P14');
        $sheet->getStyle('M13:T13')->getBorders()->getTop()->setBorderStyle(Border::BORDER_THIN)->setColor(new Color('DA291C'));
        $sheet->getStyle('M14:T14')->getBorders()->getBottom()->setBorderStyle(Border::BORDER_THIN)->setColor(new Color('DA291C'));
        $sheet->setCellValue('Q12', 'Дата составления');
        $sheet->getStyle('Q12')->getFont()->setSize(10);
        $sheet->mergeCells('Q12:T12');
        $sheet->setCellValue('Q13', $editDate->format('d/m/Y'));
        $sheet->getStyle('Q13')->getNumberFormat()->setFormatCode(NumberFormat::FORMAT_DATE_DDMMYYYY);
        $sheet->getStyle('Q13')->getFont()->setSize(10);
        $sheet->mergeCells('Q13:T14');

        $sheet->setCellValue('W12', 'Отчетный период');
        $sheet->getStyle('W12')->getFont()->setSize(10);
        $sheet->mergeCells('W12:Z12');
        $sheet->getStyle('W12:Z12')->getBorders()->getOutline()->setBorderStyle(Border::BORDER_THIN)->setColor(new Color('DA291C'));
        $sheet->setCellValue('W13', 'с');
        $sheet->getStyle('W13')->getFont()->setSize(10);
        $sheet->mergeCells('W13:X13');
        $sheet->getStyle('W13:X13')->getBorders()->getLeft()->setBorderStyle(Border::BORDER_THIN)->setColor(new Color('DA291C'));
        $sheet->getStyle('W13:X13')->getBorders()->getRight()->setBorderStyle(Border::BORDER_THIN)->setColor(new Color('DA291C'));
        $sheet->getStyle('W13:Z13')->getBorders()->getBottom()->setBorderStyle(Border::BORDER_THIN)->setColor(new Color('DA291C'));
        $sheet->setCellValue('Y13', 'по');
        $sheet->getStyle('Y13')->getFont()->setSize(10);
        $sheet->mergeCells('Y13:Z13');
        $sheet->getStyle('Y13:Z13')->getBorders()->getRight()->setBorderStyle(Border::BORDER_THIN)->setColor(new Color('DA291C'));
        $sheet->setCellValue('W14', $fromDate->format('d/m/Y'));
        $sheet->getStyle('W14')->getNumberFormat()->setFormatCode(NumberFormat::FORMAT_DATE_DDMMYYYY);
        $sheet->getStyle('W14')->getFont()->setSize(10);
        $sheet->mergeCells('W14:X14');
        $sheet->getStyle('W14:X14')->getBorders()->getLeft()->setBorderStyle(Border::BORDER_THIN)->setColor(new Color('DA291C'));
        $sheet->getStyle('W14:X14')->getBorders()->getRight()->setBorderStyle(Border::BORDER_THIN)->setColor(new Color('DA291C'));
        $sheet->getStyle('W14:Z14')->getBorders()->getBottom()->setBorderStyle(Border::BORDER_THIN)->setColor(new Color('DA291C'));
        $sheet->setCellValue('Y14', $toDate->format('d/m/Y'));
        $sheet->getStyle('Y14')->getNumberFormat()->setFormatCode(NumberFormat::FORMAT_DATE_DDMMYYYY);
        $sheet->getStyle('Y14')->getFont()->setSize(10);
        $sheet->mergeCells('Y14:Z14');
        $sheet->getStyle('Y14:Z14')->getBorders()->getRight()->setBorderStyle(Border::BORDER_THIN)->setColor(new Color('DA291C'));
    }

    private function createTableHeader(): void
    {
        $sheet = $this->spreadsheet->getActiveSheet();
        $sheet->setCellValue('A17', "№\nп/п");
        $sheet->getStyle('A17')->getFont()->setSize(10);
        $sheet->getStyle('A17:Z17')->getBorders()->getTop()->setBorderStyle(Border::BORDER_MEDIUM)->setColor(new Color('DA291C'));
        $sheet->getStyle('A17:A22')->getBorders()->getLeft()->setBorderStyle(Border::BORDER_MEDIUM)->setColor(new Color('DA291C'));
        $sheet->getStyle('Z17:Z22')->getBorders()->getRight()->setBorderStyle(Border::BORDER_MEDIUM)->setColor(new Color('DA291C'));
        $sheet->getStyle('A22:Z22')->getBorders()->getBottom()->setBorderStyle(Border::BORDER_MEDIUM)->setColor(new Color('DA291C'));
        $sheet->getStyle('D17:S17')->getBorders()->getBottom()->setBorderStyle(Border::BORDER_MEDIUM)->setColor(new Color('DA291C'));
        $sheet->getStyle('A17:A22')->getBorders()->getRight()->setBorderStyle(Border::BORDER_MEDIUM)->setColor(new Color('DA291C'));
        $sheet->getStyle('A22:Z22')->getBorders()->getTop()->setBorderStyle(Border::BORDER_MEDIUM)->setColor(new Color('DA291C'));
        $sheet->mergeCells('A17:A21');
        $sheet->setCellValue('A22', '1');
        $sheet->getStyle('A22')->getFont()->setSize(8);

        $sheet->setCellValue('B17', "Фамилия инициалы, профессия,\nдолжность");
        $sheet->getStyle('B17')->getFont()->setSize(10);
        $sheet->mergeCells('B17:B21');
        $sheet->getStyle('B17:B22')->getBorders()->getRight()->setBorderStyle(Border::BORDER_MEDIUM)->setColor(new Color('DA291C'));
        $sheet->setCellValue('B22', '2');
        $sheet->getStyle('B22')->getFont()->setSize(8);

        $sheet->setCellValue('C17', 'Таб. №');
        $sheet->getStyle('C17')->getFont()->setSize(10);
        $sheet->mergeCells('C17:C21');
        $sheet->getStyle('C17:C22')->getBorders()->getRight()->setBorderStyle(Border::BORDER_MEDIUM)->setColor(new Color('DA291C'));
        $sheet->setCellValue('C22', '3');
        $sheet->getStyle('C22')->getFont()->setSize(8);

        $sheet->setCellValue('D17', 'Отметки о явках и неявках на работу по числам месяца');
        $sheet->getStyle('D17')->getFont()->setSize(10);
        $sheet->mergeCells('D17:S17');
        $sheet->getStyle('S17:S22')->getBorders()->getRight()->setBorderStyle(Border::BORDER_MEDIUM)->setColor(new Color('DA291C'));

        $chars = ['D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S'];
        for ($i = 1; $i <= 16; $i++) {
            $sheet->setCellValue($chars[$i - 1] . '18', $i < 16 ? $i : '');
            if ($i < 16)
                $sheet->getStyle($chars[$i - 1] . '18:' . $chars[$i - 1] . '21')->getBorders()->getRight()->setBorderStyle(Border::BORDER_THIN)->setColor(new Color('DA291C'));
        }
        for ($i = 16; $i <= 31; $i++) {
            $sheet->setCellValue($chars[$i - 16] . '20', $i <= $this->lastDay ? $i : '');
        }
        $sheet->getStyle('D18:S18')->getBorders()->getBottom()->setBorderStyle(Border::BORDER_THIN)->setColor(new Color('DA291C'));
        $sheet->getStyle('D19:S19')->getBorders()->getBottom()->setBorderStyle(Border::BORDER_THIN)->setColor(new Color('DA291C'));
        $sheet->getStyle('D20:S20')->getBorders()->getBottom()->setBorderStyle(Border::BORDER_THIN)->setColor(new Color('DA291C'));
        $sheet->setCellValue('D22', '4');
        $sheet->getStyle('D22')->getFont()->setSize(8);
        $sheet->mergeCells('D22:S22');

        $sheet->setCellValue('T17', 'Отработано за');
        $sheet->getStyle('T17')->getFont()->setSize(10);
        $sheet->mergeCells('T17:U17');
        $sheet->getStyle('V17:V22')->getBorders()->getRight()->setBorderStyle(Border::BORDER_MEDIUM)->setColor(new Color('DA291C'));
        $sheet->getStyle('U17:U19')->getBorders()->getRight()->setBorderStyle(Border::BORDER_THIN)->setColor(new Color('DA291C'));
        $sheet->getStyle('T17:U17')->getBorders()->getBottom()->setBorderStyle(Border::BORDER_THIN)->setColor(new Color('DA291C'));
        $sheet->setCellValue('T18', "половину\nмесяца");
        $sheet->getStyle('T18:T19')->getBorders()->getRight()->setBorderStyle(Border::BORDER_THIN)->setColor(new Color('DA291C'));
        $sheet->mergeCells('T18:T19');
        $sheet->setCellValue('U18', 'месяц');
        $sheet->getStyle('T19')->getBorders()->getRight()->setBorderStyle(Border::BORDER_THIN)->setColor(new Color('DA291C'));
        $sheet->getStyle('T19:V19')->getBorders()->getBottom()->setBorderStyle(Border::BORDER_THIN)->setColor(new Color('DA291C'));
        $sheet->mergeCells('U18:U19');
        $sheet->setCellValue('V17', "Норма дней\nв мес. у\nсотрудника");
        $sheet->mergeCells('V17:V19');
        $sheet->setCellValue('T20', 'дни');
        $sheet->mergeCells('T20:V20');
        $sheet->getStyle('T20:V20')->getBorders()->getBottom()->setBorderStyle(Border::BORDER_THIN)->setColor(new Color('DA291C'));
        $sheet->setCellValue('T21', 'часы');
        $sheet->mergeCells('T21:V21');
        $sheet->setCellValue('T22', '5');
        $sheet->getStyle('T22')->getFont()->setSize(8);
        $sheet->getStyle('T22')->getBorders()->getRight()->setBorderStyle(Border::BORDER_MEDIUM)->setColor(new Color('DA291C'));
        $sheet->setCellValue('U22', '6');
        $sheet->getStyle('U22')->getFont()->setSize(8);
        $sheet->getStyle('U22')->getBorders()->getRight()->setBorderStyle(Border::BORDER_MEDIUM)->setColor(new Color('DA291C'));
        $sheet->setCellValue('V22', '7');
        $sheet->getStyle('V22')->getFont()->setSize(8);

        $sheet->setCellValue('W17', 'Неявки по причинам');
        $sheet->getStyle('W17')->getFont()->setSize(10);
        $sheet->mergeCells('W17:Z18');
        $sheet->getStyle('W18:Z18')->getBorders()->getBottom()->setBorderStyle(Border::BORDER_THIN)->setColor(new Color('DA291C'));
        $sheet->setCellValue('W19', 'код');
        $sheet->getStyle('W19')->getFont()->setSize(10);
        $sheet->getStyle('W19:W21')->getBorders()->getRight()->setBorderStyle(Border::BORDER_THIN)->setColor(new Color('DA291C'));
        $sheet->mergeCells('W19:W21');
        $sheet->setCellValue('W22', '8');
        $sheet->getStyle('W22')->getFont()->setSize(8);
        $sheet->getStyle('W22')->getBorders()->getRight()->setBorderStyle(Border::BORDER_MEDIUM)->setColor(new Color('DA291C'));
        $sheet->setCellValue('X19', "дни\n(часы)");
        $sheet->getStyle('X19')->getFont()->setSize(10);
        $sheet->getStyle('X19:X21')->getBorders()->getRight()->setBorderStyle(Border::BORDER_THIN)->setColor(new Color('DA291C'));
        $sheet->mergeCells('X19:X21');
        $sheet->setCellValue('X22', '9');
        $sheet->getStyle('X22')->getFont()->setSize(8);
        $sheet->getStyle('X22')->getBorders()->getRight()->setBorderStyle(Border::BORDER_MEDIUM)->setColor(new Color('DA291C'));
        $sheet->setCellValue('Y19', 'код');
        $sheet->getStyle('Y19')->getFont()->setSize(10);
        $sheet->getStyle('Y19:Y21')->getBorders()->getRight()->setBorderStyle(Border::BORDER_THIN)->setColor(new Color('DA291C'));
        $sheet->mergeCells('Y19:Y21');
        $sheet->setCellValue('Y22', '10');
        $sheet->getStyle('Y22')->getFont()->setSize(8);
        $sheet->getStyle('Y22')->getBorders()->getRight()->setBorderStyle(Border::BORDER_MEDIUM)->setColor(new Color('DA291C'));
        $sheet->setCellValue('Z19', "дни\n(часы)");
        $sheet->getStyle('Z19')->getFont()->setSize(10);
        $sheet->mergeCells('Z19:Z21');
        $sheet->setCellValue('Z22', '11');
        $sheet->getStyle('A22')->getFont()->setSize(8);
    }

    private function createTableBody(Collection $timeCards): void
    {
        /** @var TimeCard $timeCard */
        foreach ($timeCards as $i => $timeCard) {
            $rowIndex = $i * 4 + 23;
            $sheet = $this->spreadsheet->getActiveSheet();
            $sheet->setCellValue('A' . $rowIndex, $i + 1);
            $sheet->getStyle('A' . $rowIndex . ':A' . $rowIndex + 3)->getBorders()->getLeft()->setBorderStyle(Border::BORDER_MEDIUM)->setColor(new Color('DA291C'));
            $sheet->getStyle('Z' . $rowIndex . ':Z' . $rowIndex + 3)->getBorders()->getRight()->setBorderStyle(Border::BORDER_MEDIUM)->setColor(new Color('DA291C'));
            $sheet->getStyle('A' . $rowIndex + 3 . ':Z' . $rowIndex + 3)->getBorders()->getBottom()->setBorderStyle(Border::BORDER_MEDIUM)->setColor(new Color('DA291C'));
            $sheet->getStyle('A' . $rowIndex . ':A' . $rowIndex + 3)->getBorders()->getRight()->setBorderStyle(Border::BORDER_MEDIUM)->setColor(new Color('DA291C'));
            $sheet->mergeCells('A' . $rowIndex . ':A' . $rowIndex + 3);

            $sheet->setCellValue('B' . $rowIndex, $timeCard->user . "\n" . $timeCard->post);
            $sheet->getStyle('B' . $rowIndex . ':B' . $rowIndex + 3)->getBorders()->getRight()->setBorderStyle(Border::BORDER_MEDIUM)->setColor(new Color('DA291C'));
            $sheet->mergeCells('B' . $rowIndex . ':B' . $rowIndex + 3);

            $sheet->setCellValue('C' . $rowIndex, $timeCard->time_card_number);
            $sheet->getStyle('C' . $rowIndex . ':C' . $rowIndex + 3)->getBorders()->getRight()->setBorderStyle(Border::BORDER_MEDIUM)->setColor(new Color('DA291C'));
            $sheet->mergeCells('C' . $rowIndex . ':C' . $rowIndex + 3);

            $totalHalfDays = 0;
            $totalHalfHours = 0;
            $totalDays = 0;
            $totalHours = 0;
            $chars = ['D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S'];
            for ($i = 0; $i < 15; $i++) {
                if ($timeCard->attendance->get($i)) {
                    $tmp = (int)($timeCard->attendance->get($i)['status'] === 'Я');
                    $totalDays += $tmp;
                    $totalHalfDays += $tmp;

                    $tmp = (int)$timeCard->attendance->get($i)['hours'];
                    $totalHours += $tmp;
                    $totalHalfHours += $tmp;
                }
                $sheet->setCellValue($chars[$i] . $rowIndex, $timeCard->attendance->get($i)['status'] ?? '');
                $sheet->setCellValue($chars[$i] . $rowIndex + 1, $timeCard->attendance->get($i)['hours'] ?? '');
                $sheet->getStyle($chars[$i] . $rowIndex . ':' . $chars[$i] . $rowIndex + 3)->getBorders()->getRight()->setBorderStyle(Border::BORDER_THIN)->setColor(new Color('DA291C'));
            }
            $sheet->setCellValue('S' . $rowIndex, '');
            $sheet->setCellValue('S' . $rowIndex + 1, '');
            for ($i = 15; $i < 31; $i++) {
                if ($timeCard->attendance->get($i)) {
                    $totalDays += $timeCard->attendance->get($i)['status'] === 'Я' ? 1 : 0;
                    $totalHours += (int)$timeCard->attendance->get($i)['hours'];
                }
                $sheet->setCellValue($chars[$i - 15] . $rowIndex + 2, $i + 1 <= $this->lastDay ? $timeCard->attendance->get($i)['status'] ?? '' : '');
                $sheet->setCellValue($chars[$i - 15] . $rowIndex + 3, $i + 1 <= $this->lastDay ? $timeCard->attendance->get($i)['hours'] ?? '' : '');
            }

            $sheet->getStyle('S' . $rowIndex . ':S' . $rowIndex + 3)->getBorders()->getRight()->setBorderStyle(Border::BORDER_MEDIUM)->setColor(new Color('DA291C'));
            $sheet->getStyle('D' . $rowIndex . ':S' . $rowIndex)->getBorders()->getBottom()->setBorderStyle(Border::BORDER_THIN)->setColor(new Color('DA291C'));
            $sheet->getStyle('D' . $rowIndex + 1 . ':S' . $rowIndex + 1)->getBorders()->getBottom()->setBorderStyle(Border::BORDER_MEDIUM)->setColor(new Color('DA291C'));
            $sheet->getStyle('D' . $rowIndex + 2 . ':S' . $rowIndex + 2)->getBorders()->getBottom()->setBorderStyle(Border::BORDER_THIN)->setColor(new Color('DA291C'));

            $sheet->setCellValue('T' . $rowIndex, $totalHalfDays ? $totalHalfDays . 'д' : '');
            $sheet->getStyle('T' . $rowIndex . ':T' . $rowIndex + 3)->getBorders()->getRight()->setBorderStyle(Border::BORDER_THIN)->setColor(new Color('DA291C'));
            $sheet->getStyle('T' . $rowIndex . ':V' . $rowIndex)->getBorders()->getBottom()->setBorderStyle(Border::BORDER_THIN)->setColor(new Color('DA291C'));
            $sheet->setCellValue('T' . $rowIndex + 1, $totalHalfHours ? $totalHalfHours . 'ч' : '');
            $sheet->getStyle('T' . $rowIndex + 1 . ':V' . $rowIndex + 1)->getBorders()->getBottom()->setBorderStyle(Border::BORDER_THIN)->setColor(new Color('DA291C'));
            $sheet->setCellValue('T' . $rowIndex + 2, $totalDays ? ($totalDays - $totalHalfDays) . 'д' : '');
            $sheet->getStyle('T' . $rowIndex + 2 . ':V' . $rowIndex + 2)->getBorders()->getBottom()->setBorderStyle(Border::BORDER_THIN)->setColor(new Color('DA291C'));
            $sheet->setCellValue('T' . $rowIndex + 3, $totalHours ? ($totalHours - $totalHalfHours) . 'ч' : '');

            $sheet->setCellValue('U' . $rowIndex, $totalDays ? $totalDays . 'д' : '');
            $sheet->getStyle('U' . $rowIndex . ':U' . $rowIndex + 3)->getBorders()->getRight()->setBorderStyle(Border::BORDER_THIN)->setColor(new Color('DA291C'));
            $sheet->mergeCells('U' . $rowIndex . ':U' . $rowIndex + 1);
            $sheet->setCellValue('U' . $rowIndex + 2, $totalHours ? $totalHours . 'ч' : '');
            $sheet->mergeCells('U' . $rowIndex + 2 . ':U' . $rowIndex + 3);

            $sheet->setCellValue('V' . $rowIndex, $timeCard->normative->days ? $timeCard->normative->days . 'д' : '');
            $sheet->getStyle('V' . $rowIndex . ':V' . $rowIndex + 3)->getBorders()->getRight()->setBorderStyle(Border::BORDER_MEDIUM)->setColor(new Color('DA291C'));
            $sheet->mergeCells('V' . $rowIndex . ':V' . $rowIndex + 1);
            $sheet->setCellValue('V' . $rowIndex + 2, $timeCard->normative->hours ? $timeCard->normative->hours . 'ч' : '');
            $sheet->mergeCells('V' . $rowIndex + 2 . ':V' . $rowIndex + 3);

            $sheet->setCellValue('W' . $rowIndex, 'В');
            $sheet->getStyle('W' . $rowIndex . ':W' . $rowIndex + 3)->getBorders()->getRight()->setBorderStyle(Border::BORDER_THIN)->setColor(new Color('DA291C'));
            $sheet->getStyle('W' . $rowIndex . ':Z' . $rowIndex)->getBorders()->getBottom()->setBorderStyle(Border::BORDER_THIN)->setColor(new Color('DA291C'));
            $sheet->setCellValue('W' . $rowIndex + 1, 'Б');
            $sheet->getStyle('W' . $rowIndex + 1 . ':Z' . $rowIndex + 1)->getBorders()->getBottom()->setBorderStyle(Border::BORDER_THIN)->setColor(new Color('DA291C'));
            $sheet->setCellValue('W' . $rowIndex + 2, 'ОТ');
            $sheet->getStyle('W' . $rowIndex + 2 . ':Z' . $rowIndex + 2)->getBorders()->getBottom()->setBorderStyle(Border::BORDER_THIN)->setColor(new Color('DA291C'));
            $sheet->setCellValue('W' . $rowIndex + 3, 'Р');

            $tmp = $timeCard->attendance->filter(fn(array $item) => $item['status'] === 'В')->count();
            $sheet->setCellValue('X' . $rowIndex, $tmp ?: '');
            $sheet->getStyle('X' . $rowIndex . ':X' . $rowIndex + 3)->getBorders()->getRight()->setBorderStyle(Border::BORDER_THIN)->setColor(new Color('DA291C'));
            $tmp = $timeCard->attendance->filter(fn(array $item) => $item['status'] === 'Б')->count();
            $sheet->setCellValue('X' . $rowIndex + 1, $tmp ?: '');
            $tmp = $timeCard->attendance->filter(fn(array $item) => $item['status'] === 'ОТ')->count();
            $sheet->setCellValue('X' . $rowIndex + 2, $tmp ?: '');
            $tmp = $timeCard->attendance->filter(fn(array $item) => $item['status'] === 'Р')->count();
            $sheet->setCellValue('X' . $rowIndex + 3, $tmp ?: '');

            $sheet->setCellValue('Y' . $rowIndex, 'ПР');
            $sheet->getStyle('Y' . $rowIndex . ':Y' . $rowIndex + 3)->getBorders()->getRight()->setBorderStyle(Border::BORDER_THIN)->setColor(new Color('DA291C'));
            $sheet->setCellValue('Y' . $rowIndex + 1, 'ДО');
            $sheet->setCellValue('Y' . $rowIndex + 2, 'Г');
            $sheet->setCellValue('Y' . $rowIndex + 3, 'НН');

            $tmp = $timeCard->attendance->filter(fn(array $item) => $item['status'] === 'ПР')->count();
            $sheet->setCellValue('Z' . $rowIndex, $tmp ?: '');
            $tmp = $timeCard->attendance->filter(fn(array $item) => $item['status'] === 'ДО')->count();
            $sheet->setCellValue('Z' . $rowIndex + 1, $tmp ?: '');
            $tmp = $timeCard->attendance->filter(fn(array $item) => $item['status'] === 'Г')->count();
            $sheet->setCellValue('Z' . $rowIndex + 2, $tmp ?: '');
            $tmp = $timeCard->attendance->filter(fn(array $item) => $item['status'] === 'НН')->count();
            $sheet->setCellValue('Z' . $rowIndex + 3, $tmp ?: '');
        }
    }
}
