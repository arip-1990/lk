<?php

namespace App\Http\Controllers\V1\User;

use App\Models\Result;
use App\Models\Store;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;

class WorkerController extends Controller
{
    public function handle(): JsonResponse
    {
        if (!Auth::check() or Auth::user()->role->name === 'worker')
            return new JsonResponse(['message' => 'Доступ запрещен!'], 403);

        $data = [];
        if (Auth::user()->stores->count()) {
            foreach (Auth::user()->stores as $store) {
                foreach ($this->prepareData($store->users, $store) as $key => $workers) {
                    $data[] = [
                        'store' => $key,
                        'workers' => $workers
                    ];
                }
            }
        }
        else {
            Store::query()->chunk(10, function (Collection $stores) use (&$data) {
                foreach ($stores as $store) {
                    foreach ($this->prepareData($store->users, $store) as $key => $workers) {
                        $data[] = [
                            'store' => $key,
                            'workers' => $workers
                        ];
                    }
                }
            });
        }

        return new JsonResponse($data);
    }

    private function prepareData(Collection $data, Store $store = null): array
    {
        $newData = [];
        /** @var User $user */
        foreach ($data as $user) {
            if (!$store and !$user->stores->count()) continue;

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
                            if ($result->answers->contains($user->id)) $totalCorrects++;
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

            if ($store) {
                $newData[$store->name][] = [
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
            else {
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
        }
        return $newData;
    }
}
