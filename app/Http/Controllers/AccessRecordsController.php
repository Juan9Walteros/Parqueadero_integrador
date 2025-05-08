<?php
 
namespace App\Http\Controllers;
 
use App\Helpers\AuthHelper;
use App\Http\Requests\CreateAccessRecordsRequest;
use App\Http\Requests\CreateUserRequest;
use App\Http\Requests\CreateVehiclesRequest;
use App\Http\Requests\UpdateAccessRecordsRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Requests\UpdateVehiclesRequest;
use App\Models\Access_records;
use App\Models\User;
use App\Models\Vehicles;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
 
class AccessRecordsController extends Controller

{

    /**

     * Display a listing of the resource.

     *

     * @return \Illuminate\Http\Response

     */

    public function index(): JsonResponse

    {

          try{
            
            if (AuthHelper::isUser())
            {
                return response()->json([
                 
                    'message' => 'el usuario no es un administrador'   
                ]);
            }

            $accessrecords = Access_records::all();

            return response()->json([

              'Registros' => $accessrecords,
 
            ]);

          }catch(Exception $e){

            return response()->json([

              'error' =>'error al obtener el registro' . $e->getMessage()

            ],500);

        }   

}

    public function show($id): JsonResponse

    {

        try {

            
            // Buscar el usuario por su ID

            $accessrecords = Access_records::findOrFail($id);
 
            // Devolver el usuario encontrado en formato JSON

            return response()->json([

                'Registros' => $accessrecords,

            ]);

        } catch (ModelNotFoundException $e) {

            // Manejar la excepción si el usuario no existe

            return response()->json(['message' => 'El registro no existe'], 404);

        } catch (Exception $e) {

            // Manejar cualquier otro error y devolver una respuesta de error

            return response()->json([

                'message' => 'Error al obtener el registro: ' . $e->getMessage()

            ], 500);

        }

    }
 
 
 
 
     

    public function store(CreateAccessRecordsRequest $request): JsonResponse

    {

        try {

            if (AuthHelper::isUser())
            {
                return response()->json([
                 
                    'message' => 'el usuario no es un celador'   
                ]);
            }

            $data = $request->validated();

            // Crear un nuevo usuario con los datos proporcionados

            $accessrecords = Access_records::create([
                'id_vehicle' => $data['id_vehicle'],
                'entry_time' => $data['entry_time'],
                'exit_time' => $data['exit_time'],
            ]);
 
            return response()->json([

                'message' => 'Registro registrado correctamente',

                'Registro' => $accessrecords

            ], 201); // Código de estado HTTP 201 para indicar éxito en la creación

        } catch (ValidationException $e) {

            $errors = $e->validator->errors()->all();
 
            // En caso de error, devolver una respuesta JSON con un mensaje de error

            return response()->json([

                'message' => 'Error al registrar ..: ' . $e->getMessage(),

                'errors' => $errors

            ], 422); // Código de estado HTTP 422 para indicar una solicitud mal formada debido a errores de validación

        } catch (Exception $e) {

            // En caso de otros errores, devuelve un mensaje genérico de error

            return response()->json([

                'message' => 'Error al registrar : ' . $e->getMessage()

            ], 500); // Código de estado HTTP 500 para indicar un error del servidor

        }
 
    }
 
    public function update(UpdateAccessRecordsRequest $request, $id): JsonResponse
    {
        try {

            if (!AuthHelper::isAdmin())
            {
                return response()->json([
                 
                    'message' => 'el usuario no es un administrador'   
                ]);
            }

            // Encuentra el usuario por su ID
            $accessrecords = Access_records::findOrFail($id);

            $data = $request->validated();

            // Actualizar el usuario con los datos proporcionados
            $accessrecords->update([

                'id_vehicle' => $data['id_vehicle'],
                'entry_time' => $data['entry_time'],
                'exit_time' => $data['exit_time'],

            ]);
            $accessrecords->refresh();
            return response()->json([
                'message' => 'Registro actualizado correctamente',
                'Registros' => $accessrecords
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'El Registro no existe'], 404);
        } catch (ValidationException $e) {
            $errors = $e->validator->errors()->all();
            // En caso de error, devolver una respuesta JSON con un mensaje de error
            return response()->json([
                'message' => 'Error al actualizar el registro: ' . $e->getMessage(),
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

            $accessrecords = Access_records::findOrFail($id);
 
            // Eliminar el usuario

            $accessrecords->delete();
 
            return response()->json([

               'message' => 'Registro eliminado correctamente'

            ]);

        } catch (ModelNotFoundException $e) {

            return response()->json(['message' => 'El Registro no existe'], 404);

        } catch (Exception $e) {

            // En caso de otros errores, devuelve un mensaje genérico de error

            return response()->json([

                'message' => 'Error al eliminar el Registro: ' . $e->getMessage()

            ], 500); // Código de estado HTTP 500 para indicar un error del servidor

        }

    }

    public function scanQRCode($qr_code): JsonResponse
    {
        try {
            // Buscar el vehículo por el código QR
            $vehicle = Vehicles::where('qr_code', $qr_code)->first();
    
            // Si no se encuentra el vehículo asociado al código QR
            if (!$vehicle) {
                return response()->json([
                    'message' => 'No se encontró vehículo asociado al código QR'
                ], 404);
            }
    
            // Verificar si ya hay una entrada activa (es decir, una entrada sin salida)
            $activeAccessRecord = Access_records::where('id_vehicle', $vehicle->id)
                                                ->whereNull('exit_time') // Salida nula
                                                ->first();
    
            if ($activeAccessRecord) {
                // Si hay una entrada sin salida, se registra una salida
                $activeAccessRecord->exit_time = now();
                $activeAccessRecord->save(); // Guardar la salida
    
                return response()->json([
                    'message' => 'Salida registrada correctamente',
                    'Registro' => $activeAccessRecord
                ]);
            } else {
                // Si no hay entrada activa, se puede registrar una nueva entrada
                $accessRecord = Access_records::create([
                    'id_vehicle' => $vehicle->id,  // Relacionar el vehículo con el acceso
                    'entry_time' => now(),         // Establecer la hora de entrada
                    'exit_time' => null            // Salida nula al inicio
                ]);
    
                return response()->json([
                    'message' => 'Entrada registrada correctamente',
                    'Registro' => $accessRecord
                ], 201); // Código HTTP 201 para creación exitosa
            }
    
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Error al procesar el escaneo: ' . $e->getMessage()
            ], 500); // Código HTTP 500 para error del servidor
        }
    }
    
    
    }

    

