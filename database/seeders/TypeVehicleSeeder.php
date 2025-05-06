<?php
 
namespace Database\Seeders;
 // Corregido el nombre del modelo
 
use App\Models\Categorias;
use App\Models\Type_vehicles;
use Illuminate\Database\Seeder;
 
class TypeVehicleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $types = [
            'Motocicleta',
            'Bicicleta',
        ];
 
        foreach ($types as $type) {
            Type_vehicles::create([
                'name' => $type
            ]);
        }
    }
}