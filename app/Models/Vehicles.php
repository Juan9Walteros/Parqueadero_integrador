<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;

class Vehicles extends Model
{
  
    protected $fillable = [
     
        'plate',
        'marca',
        'model',
        'color',
        'id_user',
        'qr_code',
        'id_type',
    ];
}
