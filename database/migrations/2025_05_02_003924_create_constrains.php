<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {

            $table->foreign(columns: 'id_rol')->references(columns: 'id')->on(table: 'roles');

        });

        Schema::table('vehicles', function (Blueprint $table) {

            $table->foreign(columns: 'id_user')->references(columns: 'id')->on(table: 'users');
            $table->foreign(columns: 'id_type')->references(columns: 'id')->on(table: 'type_vehicles');

        });   

        Schema::table('parkings', function (Blueprint $table) {

            $table->foreign(columns: 'id_vehicle')->references(columns: 'id')->on(table: 'vehicles');

        });

        Schema::table('access_records', function (Blueprint $table) {

            $table->foreign(columns: 'id_vehicle')->references(columns: 'id')->on(table: 'vehicles');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('constrains');
    }
};
