<?php

namespace App\UseCases;

use App\Models\Answer;
use App\Models\Question;
use App\Models\Result;
use App\Models\Test;
use Illuminate\Support\Collection;

class TestService
{
    public function store(Test $test, array $results): void
    {
        $total = 0;
        foreach ($results as $item) {
            /** @var Question $question */
            $question = Question::query()->find($item['question']);
            Result::query()->create([
                'test_id' => $test->id,
                'question_id' => $question->id,
                'answers' => new Collection($item['answers'])
            ]);

            $corrects = 0;
            $totalTmp = 0;
            $wrongAnswers = 0;
            /** @var Answer $tmp */
            $tmp = $question->answers->get($question->answers->search(fn(Answer $item) => $item->title == 'Все ответы верны'));
            if ($tmp !== false and $tmp->correct) {
                if (in_array($tmp->id, $item['answers'])) {
                    $corrects = 1;
                    $totalTmp = 1;
                }
                else {
                    $corrects = $question->answers->count() - 1;
                    foreach ($question->answers as $answer) {
                        if (in_array($answer->id, $item['answers']))
                            $totalTmp++;
                    }
                }
            }
            else {
                /** @var Answer $answer */
                foreach ($question->answers as $answer) {
                    $checked = in_array($answer->id, $item['answers']);
                    if ($answer->correct) {
                        $corrects++;
                        if ($checked) $totalTmp++;
                    }
                    elseif ($checked) $wrongAnswers++;
                }
            }

            $totalScore = round($totalTmp / $corrects, 2) - round(1 / $question->answers->count() * $wrongAnswers, 2);
            $total += max($totalScore, 0);
        }

        $test->finish($total);
        $test->save();
    }

    public function getResults(mixed $test, bool $groupByCategory = false): Collection
    {
        $data = new Collection();
        /** @var Result $result */
        foreach ($test->results as $result) {
            $question = $result->question;
            $tmp = $question->answers->get($question->answers->search(fn(Answer $item) => $item->title == 'Все ответы верны'));
            if ($tmp !== false and $tmp->correct) {
                $answersScore = $this->getAnswersScore($result, $question->answers, $tmp);
            }
            else $answersScore = $this->getAnswersScore($result, $question->answers);

            $totalScore = ($answersScore['corrects'] / $answersScore['totalCorrects']) - (1 / $question->answers->count() * $answersScore['wrongAnswers']);
            $data->add([
                'key' => $question->category->id,
                'category' => $question->category->name,
                'question' => $question->title,
                'answers' => $answersScore['answers'],
                'corrects' => $answersScore['corrects'],
                'totalCorrects' => $answersScore['totalCorrects'],
                'total' => $totalScore > 0 ? round($totalScore, 1) : 0
            ]);
        }

        if ($groupByCategory) {
            $tmp = [];
            foreach ($data as $result) {
                $tmp[$result['category']] = [
                    'key' => $result['key'],
                    'category' => $result['category'],
                    'corrects' => isset($tmp[$result['category']]['corrects']) ? $tmp[$result['category']]['corrects'] + $result['corrects'] : $result['corrects'],
                    'totalCorrects' => isset($tmp[$result['category']]['totalCorrects']) ? $tmp[$result['category']]['totalCorrects'] + $result['totalCorrects'] : $result['totalCorrects']
                ];
            }

            $data = new Collection();
            foreach ($tmp as $value) $data->add($value);
        }

        return $data;
    }

    public function getAnswersScore(Result $result, Collection $answers, Answer $allCorrects = null): array
    {
        $selectedAllCorrect = false;
        if ($allCorrects and $result->answers->contains($allCorrects->id)) {
            $selectedAllCorrect = true;
        }
        $totalCorrects = 0;
        $corrects = 0;
        if ($allCorrects) {
            if ($selectedAllCorrect) {
                $totalCorrects = 1;
                $corrects = 1;
            }
            else {
                $totalCorrects = $answers->count() - 1;
            }
        }
        $data = [];
        $wrongAnswers = 0;
        foreach ($answers as $item) {
            if ($allCorrects and $selectedAllCorrect) {
                $checked = ($item->title === 'Все ответы верны');
                $data[] = [
                    'title' => $item->title,
                    'checked' => $checked,
                    'correct' =>  $checked
                ];
            }
            else {
                $checked = $result->answers->contains($item->id);
                $data[] = [
                    'title' => $item->title,
                    'checked' => $checked,
                    'correct' => $allCorrects ? ($item->title !== 'Все ответы верны') : $item->correct
                ];

                if ($allCorrects) {
                    if ($checked) $corrects++;
                }
                else {
                    if ($item->correct) {
                        $totalCorrects++;
                        if ($checked) $corrects++;
                    }
                    elseif ($checked) $wrongAnswers++;
                }
            }
        }

        return [
            'corrects' => $corrects,
            'totalCorrects' => $totalCorrects,
            'wrongAnswers' => $wrongAnswers,
            'answers' => $data
        ];
    }
}
