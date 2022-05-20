<?php

namespace App\UseCases;

use App\Models\Category;
use App\Models\Question;
use Illuminate\Support\Collection;

class QuestionService
{
    public function randomTestQuestions(Category $category): Collection
    {
        $data = new Collection();
        if ($category->children->count()) {
            foreach ($category->children as $item) {
                if ($item->id === 18 or $item->id === 29) continue;

                $query = Question::query()->where('category_id', $item->id)->inRandomOrder();

                if ($category->children->count() > 3)
                    $query->take(2);
                else switch ($category->children->count()) {
                    case 1: $query->take(10); break;
                    case 2: $query->take(5); break;
                    case 3: $query->take(3); break;
                };

                /** @var Question $question */
                foreach ($query->get() as $question) $data->add($question);
            }
        }
        else {
            $query = Question::query()->where('category_id', $category->id)->inRandomOrder()->take(10);

            /** @var Question $question */
            foreach ($query->get() as $question) $data->add($question);
        }
        return $data;
    }
}
