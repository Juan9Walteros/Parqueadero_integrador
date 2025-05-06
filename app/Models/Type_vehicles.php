<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;

class Type_vehicles extends Model
{
   
    protected $fillable = [
        'type_vehicles',
        'id',
        'name',
    ];
}
