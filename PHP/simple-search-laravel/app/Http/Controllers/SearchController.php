<?php
namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function index(Request $request)
    {
        return $this->search($request);
    }

    public function search(Request $request)
    {
        $input = $request->get('search');
        return view('search')
            ->with('searchInput', $input)
            ->with('output', Product::matchCondition($input));
    }
}