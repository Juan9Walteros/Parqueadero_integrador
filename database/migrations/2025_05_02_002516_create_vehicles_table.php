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
        Schema::create('vehicles', function (Blueprint $table) {
            $table->integer(column: 'id')->autoIncrement()->nullable(value: false);
            $table->string('plate')->unique()->nullable(value: false);
            $table->string('marca')->nullable(value: false);
            $table->string('model')->nullable(value: false);
            $table->string('color')->nullable(value: false);
            $table->integer('id_user')->nullable(value: false)->onDelete('cascade');   
            $table->string('qr_code')->nullable(value: false);  
            $table->integer('id_type')->nullable(value: false)->onDelete('cascade'); 
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicles');
    }
};
