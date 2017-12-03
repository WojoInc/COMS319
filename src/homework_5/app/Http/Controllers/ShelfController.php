<?php

namespace App\Http\Controllers;

use App\Shelf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\View;

class ShelfController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
        $shelves = Shelf::all();
        return View::make('shelves/all')->with('shelves', $shelves);

    }

    /**
     * Display the specified resource.
     *
     * @param Shelf $shelf
     * @return \Illuminate\Http\Response
     */
    public function show(Shelf $shelf)
    {
        //
        return view('shelves/shelf')->with('shelf', $shelf);
    }

}
