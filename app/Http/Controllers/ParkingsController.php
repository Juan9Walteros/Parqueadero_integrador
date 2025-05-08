<?php
 
namespace App\Http\Controllers;
 
use App\Helpers\AuthHelper;
use App\Http\Requests\CreateParkingsRequest;
use App\Http\Requests\CreateUserRequest;
use App\Http\Requests\CreateVehiclesRequest;
use App\Http\Requests\UpdateParkingsRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Requests\UpdateVehiclesRequest;
use App\Models\Parkings;
use App\Models\User;
use App\Models\Vehicles;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
 
class ParkingsController extends Controller

{

    /**

     * Display a listing of the resource.

     *

     * @return \Illuminate\Http\Response

     */

    public function index(): JsonResponse

    {

          try{

//            if (!AuthHelper::isAdmin() || !AuthHelper::isWarden())
            

            $parkings = Parkings::all();

            return response()->json([

              'Estacionamientos' => $parkings,
 
            ]);

          }catch(Exception $e){

            return response()->json([

              'error' =>'error al obtener el estacionamiento' . $e->getMessage()

            ],500);

        }   

}

    public function show($id): JsonResponse

    {

        try {
            // Buscar el usuario por su ID

            $parkings = Parkings::findOrFail($id);
 
            // Devolver el usuario encontrado en formato JSON

            return response()->json([

                'Estacionamiento' => $parkings

            ]);

        } catch (ModelNotFoundException $e) {

            // Manejar la excepción si el usuario no existe

            return response()->json(['message' => 'El estacionamiento no existe'], 404);

        } catch (Exception $e) {

            // Manejar cualquier otro error y devolver una respuesta de error

            return response()->json([

                'message' => 'Error al obtener el Estacionamiento: ' . $e->getMessage()

            ], 500);

        }

    }
 
 
 
 
     

    public function store(CreateParkingsRequest $request): JsonResponse

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

            $parkings = Parkings::create([
                'availability' => $data['availability'],
                'id_vehicle' => $data['id_vehicle'],
            ]);
 
            return response()->json([

                'message' => 'Estacionamiento registrado correctamente',

                'Estacionamiento' => $parkings

            ], 201); // Código de estado HTTP 201 para indicar éxito en la creación

        } catch (ValidationException $e) {

            $errors = $e->validator->errors()->all();
 
            // En caso de error, devolver una respuesta JSON con un mensaje de error

            return response()->json([

                'message' => 'Error al registrar el Estacionamiento: ' . $e->getMessage(),

                'errors' => $errors

            ], 422); // Código de estado HTTP 422 para indicar una solicitud mal formada debido a errores de validación

        } catch (Exception $e) {

            // En caso de otros errores, devuelve un mensaje genérico de error

            return response()->json([

                'message' => 'Error al registrar el Estacionamiento: ' . $e->getMessage()

            ], 500); // Código de estado HTTP 500 para indicar un error del servidor

        }
 
    }
 
    public function update(UpdateParkingsRequest $request, $id): JsonResponse
    {
        try {

            if (!AuthHelper::isAdmin())
            {
                return response()->json([
                 
                    'message' => 'el usuario no es un administrador'   
                ]);
            }

            // Encuentra el usuario por su ID
            $parkings = Parkings::findOrFail($id);

            $data = $request->validated();

            // Actualizar el usuario con los datos proporcionados
            $parkings->update([

                'availability' => $data['availability'],
                'id_vehicle' => $data['id_vehicle'],

            ]);
            $parkings->refresh();
            return response()->json([
                'message' => 'Estacionamiento actualizado correctamente',
                'Estacionamient' => $parkings
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'El Estacionamiento no existe'], 404);
        } catch (ValidationException $e) {
            $errors = $e->validator->errors()->all();
            // En caso de error, devolver una respuesta JSON con un mensaje de error
            return response()->json([
                'message' => 'Error al actualizar el Estacionamiento: ' . $e->getMessage(),
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
            }

            // Encuentra el usuario por su ID

            $parkings = Parkings::findOrFail($id);
 
            // Eliminar el usuario

            $parkings->delete();
 
            return response()->json([

               'message' => 'Estacionamiento eliminado correctamente'

            ]);

        } catch (ModelNotFoundException $e) {

            return response()->json(['message' => 'El Estacionamiento no existe'], 404);

        } catch (Exception $e) {

            // En caso de otros errores, devuelve un mensaje genérico de error

            return response()->json([

                'message' => 'Error al eliminar el Estacionamiento: ' . $e->getMessage()

            ], 500); // Código de estado HTTP 500 para indicar un error del servidor

        }

    }

}