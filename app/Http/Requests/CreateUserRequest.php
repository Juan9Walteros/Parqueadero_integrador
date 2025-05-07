<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password as PasswordRules; //solo para usuario

class CreateUserRequest extends FormRequest
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
            "name" => ["required", "string"],
            "documento" => ["required", "string"],
            "email" => ["required", "string"],
            "password" => [
                "required",
                "confirmed",
                PasswordRules::min(8)->letters()->symbols()->numbers(),
            ],
            "phone" => ["required", "integer", "unique:users,phone"],
            "id_rol" => ["required", "integer"],
        ];
    }
}
