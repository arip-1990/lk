<?php

namespace App\Console\Commands;

use App\Models\Answer;
use App\Models\Category;
use App\Models\Question;
use Illuminate\Console\Command;
use PhpOffice\PhpSpreadsheet\Reader\Xlsx;

class QuestionCommand extends Command
{
    protected $signature = 'import:question {file}';
    protected $description = 'Import questions';

    public function handle(): int
    {
        $this->info('Import questions');

        $category = Category::query()->find(37);
        /** @var Category $item */
        foreach (Category::query()->find(30)?->children as $item) {
            $item->parent = $category;
        }

        $reader = new Xlsx();
        $sheet = $reader->load($this->argument('file'))->getActiveSheet();
        $rows = $sheet->toArray();
        $count_data = count($rows);

        $question = null;
        $category = Category::query()->create([
            'name' => 'Преимущество компрессионного трикотажа',
            'parent_id' => Category::query()->find(30)?->id
        ]);

        foreach ($rows as $i => $row) {
            $this->info("\033[2KЗапись данных: " . ($i + 1) . ' / ' . $count_data . "\r");

            if (preg_match('/^\d{1,2}\.?/', trim($row[0]))) {
                try {
                    $text = mb_convert_encoding(trim(preg_replace('/^\d{1,2}\.?/', '', $row[0])), 'UTF-8', 'UTF-8');
                    $question = Question::query()->create([
                        'title' => trim($text),
                        'category_id' => $category->id
                    ]);
                }
                catch (\Exception $e) {
                    $question = null;
                }
            }
            elseif ($question and trim($row[0])) {
                $text = mb_convert_encoding(trim(preg_replace('/^[a-zA-Zа-яА-Я](\.|\))?/', '', $row[0])), 'UTF-8', 'UTF-8');
                Answer::query()->create([
                    'title' => trim($text),
                    'question_id' => $question,
                    'correct' => trim($row[1]) == '+'
                ]);
            }
        }

        $this->newLine();
        $this->info('Done!');

        return 0;
    }
}
