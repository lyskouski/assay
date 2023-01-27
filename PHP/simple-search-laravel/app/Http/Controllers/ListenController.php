<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ListenController extends Controller
{
    public function index()
    {
        return view('listen');
    }
}