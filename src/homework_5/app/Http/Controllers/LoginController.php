<?php

namespace App\Http\Controllers;

use App\Login;
use App\User;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\View;

class LoginController extends Controller
{

    use AuthenticatesUsers;

    /**
     * Where to redirect users after login.
     *
     * @var string
     */
    protected $redirectTo = '/';

    public function username()
    {
        return 'username';
    }

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest')->except('logout');
    }

    protected function validator(array $data)
    {
        return Validator::make($data, [
            'username' => 'required|alpha_num',
            'password' => 'required'
        ]);
    }

    public function index()
    {
        return View::make('auth/login');
    }

    public function authenticate()
    {
        $validator = $this->validator(Input::all());

        if ($validator->fails()) {
            return Redirect::to('/login')
                ->withErrors($validator)// send back all errors to the login form
                ->withInput(Input::except('password'));

        } else {

            $userinfo = array(
                'username' => Input::get('username'),
                'password' => Input::get('password')
            );
            if (\Auth::attempt($userinfo)) {
                return \redirect()->intended('/');
            } else {
                return Redirect::to('/login')->withErrors(['Invalid' => 'Invalid credentials']);
            }
        }
        /*
                $username = User::where('username', $request->get('username'))->pluck('username')->first();
                $librarian = User::where('username', $request->get('username'))->pluck('username')->first();
                session(['username' => $username]);
                session(['librarian' => $librarian]);
                session(['logged_in' => true]);
                return redirect('/');*/
    }

}
