<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model; //le dice a eloquent q es un modelo
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;

class Roles extends Model
{
    //
    
    protected $fillable = [

        'id',
        'name',
        'description',
    ];
}
