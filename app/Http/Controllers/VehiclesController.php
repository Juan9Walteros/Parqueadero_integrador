<?php
 
namespace App\Http\Controllers;
 
use App\Helpers\AuthHelper;
use App\Http\Requests\CreateUserRequest;
use App\Http\Requests\CreateVehiclesRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Requests\UpdateVehiclesRequest;
use App\Models\User;
use App\Models\Vehicles;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Client\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Auth;
 
class VehiclesController extends Controller

{

    /**

     * Display a listing of the resource.

     *

     * @return \Illuminate\Http\Response

     */

    public function index(): JsonResponse

    {

          try{

            

            $vehicles = vehicles::all();

            return response()->json([

              'Vehiculos' => $vehicles,
 
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

            $vehicles = Vehicles::findOrFail($id);
 
            // Devolver el usuario encontrado en formato JSON

            return response()->json([

                'Vehiculos' => $vehicles,

            ]);

        } catch (ModelNotFoundException $e) {

            // Manejar la excepción si el usuario no existe

            return response()->json(['message' => 'El Vehiculo no existe'], 404);

        } catch (Exception $e) {

            // Manejar cualquier otro error y devolver una respuesta de error

            return response()->json([

                'message' => 'Error al obtener el Vehiculo: ' . $e->getMessage()

            ], 500);

        }

    }
 
    public function store(CreateVehiclesRequest $request): JsonResponse

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

            $vehicles = vehicles::create([

                'plate' => $data['plate'],
                'marca' => $data['marca'],
                'model' => $data['model'],
                'color' => $data['color'],
                'id_user' => $data['id_user'],
                'qr_code'=> $data['qr_code'],
                'id_type'=> $data['id_type'],

              
                
 
            ]);
 
            return response()->json([

                'message' => 'vehicles registrado correctamente',

                'vehicles' => $vehicles

            ], 201); // Código de estado HTTP 201 para indicar éxito en la creación

        } catch (ValidationException $e) {

            $errors = $e->validator->errors()->all();
 
            // En caso de error, devolver una respuesta JSON con un mensaje de error

            return response()->json([

                'message' => 'Error al registrar el vehicles: ' . $e->getMessage(),

                'errors' => $errors

            ], 422); // Código de estado HTTP 422 para indicar una solicitud mal formada debido a errores de validación

        } catch (Exception $e) {

            // En caso de otros errores, devuelve un mensaje genérico de error

            return response()->json([

                'message' => 'Error al registrar el usuario: ' . $e->getMessage()

            ], 500); // Código de estado HTTP 500 para indicar un error del servidor

        }
 
    }
 
    public function update(UpdateVehiclesRequest $request, $id): JsonResponse
    {
        try {

            if (!AuthHelper::isAdmin())
            {
                return response()->json([
                 
                    'message' => 'el usuario no es un administrador'   
                ]);
            }
            
            // Encuentra el usuario por su ID
            
            $vehicles = vehicles::findOrFail($id);

            $data = $request->validated();

            // Actualizar el usuario con los datos proporcionados
            $vehicles->update([

                'plate' => $data['plate'],
                'marca' => $data['marca'],
                'model' => $data['model'],
                'color' => $data['color'],
                'id_user' => $data['id_user'],   
                'qr_code'=> $data['qr_code'],
                'id_type'=> $data['id_type'],

            ]);
            $vehicles->refresh();
            return response()->json([
                'message' => 'Vehiculo actualizado correctamente',
                'Vehiculos' => $vehicles
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'El Vehiculo no existe'], 404);
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
            }

            // Encuentra el usuario por su ID

            $vehicles = vehicles::findOrFail($id);
 
            // Eliminar el usuario

            $vehicles->delete();
 
            return response()->json([

               'message' => 'Vehiculo eliminado correctamente'

            ]);

        } catch (ModelNotFoundException $e) {

            return response()->json(['message' => 'El Vehiculo no existe'], 404);

        } catch (Exception $e) {

            // En caso de otros errores, devuelve un mensaje genérico de error

            return response()->json([

                'message' => 'Error al eliminar el usuario: ' . $e->getMessage()

            ], 500); // Código de estado HTTP 500 para indicar un error del servidor

        }

    }

    public function getUserVehicles(Request $request)
{
    try {
        // No se necesita obtener el usuario autenticado
        // Simplemente devolver todos los vehículos, o si quieres filtrar según alguna otra lógica
        $vehicles = Vehicles::all();

        return response()->json([
            'Vehiculos' => $vehicles,
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Error al obtener vehículos: ' . $e->getMessage()
        ], 500);
    }
}


   



}