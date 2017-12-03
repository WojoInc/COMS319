<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Foundation\Auth\RegistersUsers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RegisterController extends Controller
{

    use RegistersUsers;

    /**
     * Where to redirect users after registration.
     *
     * @var string
     */
    protected $redirectTo = '/';

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest');
    }

    protected function validator(Request $request)
    {
        return Validator::make($request->all(), [
            'username' => 'required|alpha_num|unique:users_table,username',
            'password' => 'required|confirmed',
            'password_confirmation' => 'required',
            'email' => 'required|email|unique:users_table,email'
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
        return \View::make('auth/register');
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
        $validator = $this->validator($request)->validate();

        $user = User::create([
            'username' => $request->get('username'),
            'password' => bcrypt($request->get('password')),
            'email' => $request->get('email'),
            'phone' => $request->get('phone'),
            'is_librarian' => $request->get('type')
        ]);

        return redirect('login');
    }
}
