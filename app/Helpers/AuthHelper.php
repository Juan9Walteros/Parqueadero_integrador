<?php
 
namespace App\Helpers;
 
use App\Models\User;
use Illuminate\Support\Facades\Auth;
 
class AuthHelper
{
    public static function isAdmin()
    {
        return Auth::check() && Auth::user()->id_rol === 1;
    }
   
    public static function isUser()
    {
        return Auth::check() && Auth::user()->id_rol === 2;
    }
   
    public static function isWarden()
    {
        return Auth::check() && Auth::user()->id_rol === 3;
    }
 
    
}