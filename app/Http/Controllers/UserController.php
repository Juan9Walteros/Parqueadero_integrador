<?php
 
namespace App\Http\Controllers;
 
use App\Helpers\AuthHelper;
use App\Http\Requests\CreateUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
 
class UserController extends Controller

{

    /**

     * Display a listing of the resource.

     *

     * @return \Illuminate\Http\Response

     */

    public function index(): JsonResponse

    {

          try{

            if (!AuthHelper::isAdmin())
            {
                return response()->json([
                 
                    'message' => 'el usuario no es un administrador'   
                ]);
            }

            $users = User::all();

            return response()->json([

              'users' => $users,
 
            ]);

          }catch(Exception $e){

            return response()->json([

              'error' =>'error al obtener usuaruios' . $e->getMessage()

            ],500);

        }   

}

    public function show($id): JsonResponse

    {

        try {
            // Buscar el usuario por su ID
            if (!AuthHelper::isAdmin())
            {
                return response()->json([
                 
                    'message' => 'el usuario no es un administrador'   
                ]);
            }
            if ($id == 1) {
                return response()->json([
                   'message' => 'este usuario no esta disponible para visualizacion comuniquese con su administrador.'
                ]);
            }

            $user = User::findOrFail($id);
 
            // Devolver el usuario encontrado en formato JSON

            return response()->json([

                'user' => $user

            ]);

        } catch (ModelNotFoundException $e) {

            // Manejar la excepción si el usuario no existe

            return response()->json(['message' => 'El usuario no existe'], 404);

        } catch (Exception $e) {

            // Manejar cualquier otro error y devolver una respuesta de error

            return response()->json([

                'message' => 'Error al obtener el usuario: ' . $e->getMessage()

            ], 500);

        }

    }
 
 
 
 
     

    public function store(CreateUserRequest $request): JsonResponse

    {

        try {

            if (!AuthHelper::isAdmin())
            {
                return response()->json([
                 
                    'message' => 'el usuario no es un administrador'   
                ]);
            }

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
 
    public function update(UpdateUserRequest $request, $id): JsonResponse
    {
        try {
            // Encuentra el usuario por su ID
            $user = User::findOrFail($id);

            $data = $request->validated();

            // Actualizar el usuario con los datos proporcionados
            $user->update([
                'name' => $data['name'],
                'documento' => $data['documento'],
                'email' => $data['email'],
                'password' => bcrypt($data['password']),
                'id_rol' => $data['id_rol'],
                'phone' => $data['phone'],
            ]);
            $user->refresh();
            return response()->json([
                'message' => 'Usuario actualizado correctamente',
                'user' => $user
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'El usuario no existe'], 404);
        } catch (ValidationException $e) {
            $errors = $e->validator->errors()->all();
            // En caso de error, devolver una respuesta JSON con un mensaje de error
            return response()->json([
                'message' => 'Error al actualizar el usuario: ' . $e->getMessage(),
                'errors' => $errors
            ], 422);
        }
        
    }
 


    public function destroy($id): JsonResponse

    {

        try {

            if (!AuthHelper::isAdmin())
            {
                return response()->json([ 
                    'message' => 'el usuario no es un administrador'   
                ]);
            }else if ($id == 1) {
                return response()->json([
                   'message' => 'este usuario no esta disponible para eminacion comuniquese con su administrador.'
                ]);
            }
 
            

            // Encuentra el usuario por su ID

            $user = User::findOrFail($id);

           
            $user->vehicles()->delete();
 
            // Eliminar el usuario

            $user->delete();
 
            return response()->json([

               'message' => 'Usuario eliminado correctamente'

            ]);

        } catch (ModelNotFoundException $e) {

            return response()->json(['message' => 'El usuario no existe'], 404);

        } catch (Exception $e) {

            // En caso de otros errores, devuelve un mensaje genérico de error

            return response()->json([

                'message' => 'Error al eliminar el usuario: ' . $e->getMessage()

            ], 500); // Código de estado HTTP 500 para indicar un error del servidor

        }

    }

}