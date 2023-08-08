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
        $favorites = $_COOKIE['favorites'] ?? '';
        $savedOutput = [];
        $one = explode('|', trim($favorites, '|'));
        if (sizeof($one) > 1 || $one[0]) {
            foreach ($one as $item) {
                $savedOutput[] = explode(':', $item);
            }
        }
        return view('search')
            ->with('searchInput', $input)
            ->with('savedOutput', $savedOutput)
            ->with('output', Product::matchCondition($input));
    }
}