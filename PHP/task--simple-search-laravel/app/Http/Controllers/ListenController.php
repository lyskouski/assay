<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ListenController extends Controller
{
    public function index()
    {
        return view('listen');
    }

    public function imageShown(Request $request)
    {
        event (new \App\Events\ImageShown($request->get('image')));
    }
}