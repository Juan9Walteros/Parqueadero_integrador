<?php

namespace App\Http\Controllers;

use App\Helpers\AuthHelper;
use App\Http\Requests\CreateUserRequest;
use App\Http\Requests\LoginRequest;
use App\Models\User;

use Illuminate\Support\Facades\Auth;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;



class AuthController extends Controller
{

    public function store(CreateUserRequest $request):JsonResponse
    {
        try {

            $data = $request->validated();
            // Crear un nuevo usuario con los datos proporcionados
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => bcrypt($data['password']),
                'id_rol' => $data['id_rol'],
                'phone' => $data['phone'],
            ]);
            return response()->json([
                'message' => 'Usuario registrado correctamente',
                'token' => $user->createToken("token")->plainTextToken,
                'user' => $user
            ], 201); // Código de estado HTTP 201 para indicar éxito en la creación
        } catch (ValidationException $e) {
            $errors = $e->validator->errors()->all();

            // En caso de error, devolver una respuesta JSON con un mensaje de error
            return response()->json([
                'message' => 'Error al registrar el usuario: ' . $e->getMessage(),
                'errors' => $errors
            ], 422); // Código de estado HTTP 422 para indicar una solicitud mal formada debido a errores de validación
        } catch (Exception $e) {
            // En caso de otros errores, devuelve un mensaje genérico de error
            return response()->json([
                'message' => 'Error al registrar el usuario: ' . $e->getMessage()
            ], 500); // Código de estado HTTP 500 para indicar un error del servidor
        }

    }

    public function login(LoginRequest $request)
    {
        /* Validar el login */
        $data = $request->validated();

        if (!User::where('email', $data['email'])->exists()) {
            return response()->json([
                'errors' => ['El email  no existe']
            ], 422);
        }
        if (!Auth::attempt($data)) {
            return response([
                "errors" => ["El email o el password son incorrectos"]
            ], 422);
        }

        // Autenticar al usuario y cargar sus inscripciones
        $user = Auth::user();
        //->load('users')

        //Retornar un token
        return [
            "token" => $user->createToken("token")->plainTextToken,
            "user" => $user,
            "message" => "Inicio de sesión exitoso"
        ];
           
    }
    public function logout(Request $request)
    {
        $user = $request->user();
        $user->currentAccessToken()->delete();

        return [
            "user" => null
        ];
    }
}