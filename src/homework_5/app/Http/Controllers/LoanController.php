<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Loan;

class LoanController extends Controller
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
        $loans = Loan::all();
        return view('loans/all')->with('loans', $loans);
    }

}
