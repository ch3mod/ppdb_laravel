<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateUkuranSeragamRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'uuid' => ['required', 'exists:peserta_ppdb,id'],
            'baju' => ['nullable'],
            'sepatu' => ['nullable'],
            'baju_batik' => ['boolean'],
            'seragam_olahraga' => ['boolean'],
            'atribut' => ['boolean'],
        ];
    }
}
