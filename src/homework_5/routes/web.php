<?php

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

Route::get('/', 'HomeController@index');

Route::get('books/create', 'BookController@create');
Route::get('books/remove', 'BookController@showDestroy');
Route::get('books/{book}', 'BookController@show');
Route::delete('books/{book}', 'BookController@destroy');
Route::post('books/{book}/borrow', 'BookController@borrow');
Route::post('books/{book}/return', 'BookController@return');


Route::get('loans', 'LoanController@index');

Route::get('shelves', 'ShelfController@index');
Route::get('shelves/{shelf}', 'ShelfController@show');


Route::post('login', 'LoginController@login');
Route::post('logout', 'LoginController@logout');
Route::get('login', 'LoginController@index')->name('login');

Route::get('register', 'RegisterController@create');
Route::post('register', 'RegisterController@store');
