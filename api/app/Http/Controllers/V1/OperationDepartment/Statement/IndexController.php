<?php

namespace App\Http\Controllers\V1\OperationDepartment\Statement;

use App\Http\Resources\StatementResource;
use App\Models\Category;
use App\Models\Statement;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;

class IndexController extends Controller
{
    public function handle(Category $category, Request $request): JsonResource
    {
        $query = Statement::where('category_id', $category->id)->orderBy('status')->orderBy('created_at');
        if (Auth::user()->stores->count()) {
            $query->whereIn('store_id', Auth::user()->stores->pluck('id'));
        }

        return StatementResource::collection($query->paginate($request->get('pageSize', 10)));
    }
}
