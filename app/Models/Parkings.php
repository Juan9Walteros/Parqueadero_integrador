<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;

class Parkings extends Model
{
    
    protected $fillable = [
        
        'id',
        'availability',
        'id_vehicle',
    ];
}
