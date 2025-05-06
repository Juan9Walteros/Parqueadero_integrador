<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateVehiclesRequest extends FormRequest
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
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "plate" => ["required", "string"],
            "marca" => ["required", "string"],
            "model" => ["required", "string"],
            "color" => ["required", "string"],
            "id_user"=> ["required", "integer"],
            "qr_code"=> ["required", "string"],
            "id_type"=> ["required", "integer"],

        ];
    }
}
