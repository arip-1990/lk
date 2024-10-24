<?php

namespace App\Http\Controllers\V1\Test;

use App\Models\Category;
use App\Models\Result;
use App\Models\Store;
use App\Models\Test;
use App\Models\User;
use App\UseCases\TestService;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class ExportController extends Controller
{
    private Spreadsheet $spreadsheet;
    private $store;

    public function __construct(private readonly TestService $testService)
    {
        $this->spreadsheet = new Spreadsheet();
        foreach(range('A','E') as $columnID)
            $this->spreadsheet->getActiveSheet()->getColumnDimension($columnID)->setAutoSize(true);

        $this->spreadsheet->getActiveSheet()->calculateColumnWidths();
    }

    public function handle(string $type, Request $request)
    {
        $this->store = Store::where('id', $request->get('store_id'))->first();
        $category = match ($type) {
            'new' => Category::find(30),
            'promo' => Category::find(37),
            default => Category::find(29),
        };

        $this->createTest($category);

        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Disposition: attachment; filename="Тесты.xlsx"');
        (new Xlsx($this->spreadsheet))->save('php://output');
    }

    private function createTest(Category $category): void
    {
        $sheet = $this->spreadsheet->getActiveSheet();
        $sheet->setCellValue('A1', 'Аптека');
        $sheet->setCellValue('B1', 'Пользователь');
        $sheet->setCellValue('C1', 'Должность');
        $sheet->setCellValue('D1', 'Результат');
        $sheet->mergeCells('D1:E1');
        $sheet->setCellValue('D2', 'Количество правильных ответов (баллов)');
        $sheet->setCellValue('E2', 'Процент правильных ответов (%)');

        $sheet->getStyle('A1:E1')->getFont()->setBold(true);
        $sheet->getStyle('A2:E2')->getFont()->setBold(true);
        $sheet->getStyle('A1:Z1')->getAlignment()->setHorizontal('center');
        $sheet->getStyle('A2:Z2')->getAlignment()->setHorizontal('center');

        $index = 3;
        foreach ($this->getData() as $key => $workers) {
            $sheet->setCellValue('A' . $index, $key);

            foreach ($workers as $worker) {
                /** @var Test $test */
                foreach (Test::query()->whereNotNull('finished_at')->where('user_id', $worker['id'])->where('category_id', $category->id)->get() as $test) {
                    $index++;
                    $totalRes = $test->results->count();
                    $sheet->setCellValue('B' . $index, $worker['firstName'] . ' ' . $worker['lastName']);
                    $sheet->setCellValue('C' . $index, $worker['position']);
                    $sheet->setCellValue('D' . $index, $test->score . '/' . $totalRes);
                    $sheet->setCellValue('E' . $index, $totalRes ? round($test->score / $totalRes * 100) : 0);

                    $chars = ['F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
                    foreach ($this->testService->getResults($test, true) as $result) {
                        $char1 = array_shift($chars);
                        $char2 = array_shift($chars);

                        $sheet->setCellValue($char1 . '1', $result['category']);
                        $sheet->mergeCells($char1 . '1:' . $char2 . '1');
                        $sheet->setCellValue($char1 . '2', 'Балл');
                        $sheet->setCellValue($char2 . '2', '%');

                        $sheet->setCellValue($char1 . $index, $result['corrects']);
                        $sheet->setCellValue($char2 . $index, round($result['corrects'] / $result['totalCorrects'] * 100));
                    }

                    $sheet->getStyle('D' . $index . ':K' . $index)->getAlignment()->setHorizontal('right');

                    $sheet->getRowDimension($index)->setOutlineLevel(1);
                    $sheet->getRowDimension($index)->setVisible(false);
                }
            }

            $index++;
            $sheet->getRowDimension($index)->setCollapsed(true);
            $index++;
        }
    }

    private function getData(): array
    {
        $newData = [];
        /** @var User $user */
        foreach ($this->store->users as $user) {
            $percent = 0;
            $newCorrects = [0, 0];
            foreach ($user->tests as $test) {
                $tmpCorrects = [0, 0];
                $totalScore = 0;
                /** @var Result $result */
                foreach ($test->results as $result) {
                    $totalCorrects = 0;
                    $corrects = 0;
                    foreach ($result->question->answers as $item2) {
                        if ($item2->correct) {
                            $corrects++;
                            if ($result->answers->contains($user->id))
                                $totalCorrects++;
                        }
                    }
                    $tmpCorrects[0] += $totalCorrects;
                    $tmpCorrects[1] += $corrects;
                    $totalScore++;
                }

                $tmp = $totalScore ? $test->score / $totalScore * 100 : 0;
                if ($tmp > $percent) {
                    $percent = $tmp;
                    $newCorrects = $tmpCorrects;
                }
            }

            foreach ($user->stores as $item) {
                $newData[$item->name][] = [
                    'id' => $user->id,
                    'firstName' => $user->first_name,
                    'lastName' => $user->last_name,
                    'middleName' => $user->middle_name,
                    'position' => $user->position,
                    'percent' => round($percent),
                    'corrects' => $newCorrects[1],
                    'totalCorrects' => $newCorrects[0],
                ];
            }
        }
        return $newData;
    }
}
