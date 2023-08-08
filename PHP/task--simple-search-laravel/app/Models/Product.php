<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    public static function matchCondition($search)
    {
        $result = [];
        if ($search) {
            $result = Product::when($search, function ($query) use ($search) {
                $query->where('id', '=', $search)
                    ->orWhere('name', 'like', "%$search%");
            })->get();
        }
        return $result;
    }
}
