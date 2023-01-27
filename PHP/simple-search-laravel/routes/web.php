<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('index');
});

Route::get('/search', 'App\Http\Controllers\SearchController@index')->name("search");
Route::post('/search', 'App\Http\Controllers\SearchController@search')->name("search");

Route::get('/listen', 'App\Http\Controllers\ListenController@index')->name("listen");

Route::get('/administer', 'App\Http\Controllers\AdministerController@index')->name("administer");
