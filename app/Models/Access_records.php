<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;

class Access_records extends Model
{
  
    protected $fillable = [
        
        'id_vehicle',
        'entry_time',
        'exit_time',
    ];
}
