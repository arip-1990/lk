<?php

namespace App\Http\Controllers\V1\OperationDepartment\Statement;

use App\Http\Resources\StatementResource;
use App\Models\Category;
use App\Models\Statement;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;

class IndexController extends Controller
{
    public function handle(Category $category, Request $request): JsonResource
    {
        $query = Statement::where('category_id', $category->id)->where('created_at', '>', Carbon::now()->startOfYear());

        if ($request->has('status')) $query->where('status', (bool)$request->get('status'));
        if ($request->has('performer')) $query->where('performer_id', $request->get('performer'));

        if ($request->has('store')) $query->where('store_id', $request->get('store'));
        elseif (Auth::user()->stores->count()) $query->whereIn('store_id', Auth::user()->stores->pluck('id'));

        return StatementResource::collection(
            $query->orderBy('status')->orderByDesc('created_at')->paginate($request->get('pageSize', 10))
        );
    }
}
