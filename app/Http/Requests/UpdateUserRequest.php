<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password as PasswordRules; //solo para usuario

class UpdateUserRequest extends FormRequest
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
        $user_id = $this->route("user");
        return [
            "name" => ["required", "string"],
            "documento" => ["required", "string"],
            "email" => [
                "required", 
                "email", 
                "unique:users,email," . $user_id // Excluir el correo del usuario actual
            ],
            "password" => [
                "required",
                PasswordRules::min(8)->letters()->symbols()->numbers(),
                "unique:users,password," . $user_id
            ],
            "phone" => [
    "required",
    "integer",
    "unique:users,phone," . $user_id // Excluir el teléfono del usuario actual
],

            "id_rol" => ["required", "integer"],
        ];
    }
}
