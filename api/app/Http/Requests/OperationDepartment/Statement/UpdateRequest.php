<?php

namespace App\Http\Requests\OperationDepartment\Statement;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'doneAt' => 'required|date',
            'status' => 'required|boolean',
            'comment' => 'string|nullable',
            'answerMedias' => 'array',
            'answerMedias.*' => 'file|mimes:webp,jpg,jpeg'
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge(['status' => $this->toBoolean($this->status)]);
    }

    private function toBoolean($booleable): bool
    {
        return filter_var($booleable, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
    }
}
