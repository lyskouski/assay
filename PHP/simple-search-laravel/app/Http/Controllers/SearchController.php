<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function index(Request $request)
    {
        return $this->search($request);
    }

    public function search(Request $request)
    {
        return view('search')
            ->with('searchInput', $request->get('search'))
            ->with('output', []);
    }
}