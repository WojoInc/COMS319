<?php

namespace App\Http\Controllers;

use App\Book;
use App\Shelf;
use App\Loan;
use Faker\Provider\DateTime;
use Illuminate\Contracts\Session\Session;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;


class BookController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
        return view('books/create');
    }

    public function show(Book $book)
    {
        return \View::make('books/loans')->with([
            'book' => $book
        ]);
    }

    public function showDestroy()
    {
        return \View::make('books/delete');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
        $validator = Validator::make($request->all(), [
            'book_name' => 'required|alpha_num',
            'author' => 'required',
            'shelf' => 'required'
        ]);

        $shelf_id = Shelf::where('shelf_name', $request->get('shelf'))->pluck('id')->first();

        if ($validator->fails()) {
            return redirect('/books/create')->withErrors($validator)->withInput();
        }
        Book::create([
            'book_name' => $request->get('book_name'),
            'author' => $request->get('author'),
            'shelf_id' => $shelf_id
        ]);

        return redirect('/');
    }

    public function borrow(Request $request, Book $book)
    {
        $book->availability = 0;
        $book->save();
        $date = new \DateTimeImmutable('now');
        $date->modify('+7 days');

        Loan::create([
            'user_id' => \Auth::user()->id,
            'book_id' => $book->id,
            'due_date' => $date,
            'returned_date' => null
        ]);
        return \Redirect::back();
    }

    public function return(Request $request, Book $book)
    {
        $book->availability = 1;
        $book->save();
        $date = new \DateTimeImmutable('now');

        $loan = Loan::where([
            'book_id' => $book->id,
            'returned_date' => null
        ])->first();

        $loan->returned_date = $date;
        $loan->save();
        return \Redirect::back();
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Book $book
     * @return \Illuminate\Http\Response
     */
    public function destroy(Book $book)
    {
        //
        $book->delete();
        return \Redirect::to('books/remove');
    }
}
