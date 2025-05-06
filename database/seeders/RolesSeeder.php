<?php
 
namespace Database\Seeders;
 // Corregido el nombre del modelo
 
use App\Models\Categorias;
use App\Models\Roles;
use Illuminate\Database\Seeder;
 
class RolesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            'Administrador',
            'Usuario',
            "Celador"
        ];
 
        foreach ($roles as $role) {
            Roles::create([
                'name' => $role
            ]);
        }
    }
}