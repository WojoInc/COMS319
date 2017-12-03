<html>
<h1>Library Registration</h1>
@if($errors->any())
    <div class="alert alert-danger">
        <ul>
            @foreach($errors->all() as $msg)
                <li>{{$msg}}</li>
            @endforeach
        </ul>
    </div>
@endif
<form id="form-login" action="/register" method="post">
    {{csrf_field()}}
    <table id="layout-login-form">
        <tr>
            <td><label for="username">Username: </label></td>
            <td><input id="username" name="username" type="text" placeholder="Please enter username!" required></td>
        </tr>
        <tr>
            <td><label for="password">Password: </label></td>
            <td><input id="password" name="password" type="password" placeholder="Please enter password!" required></td>
        </tr>
        <tr>
            <td><label for="password-confirm">Confirm: </label></td>
            <td><input id="password-confirm" name="password_confirmation" type="password"
                       placeholder="Please confirm password!" required></td>
        </tr>
        <tr>
            <td><label for="email">Email: </label></td>
            <td><input id="email" name="email" type="email" placeholder="Please enter email!" required></td>
        </tr>
        <tr>
            <td><label for="phone">Phone: </label></td>
            <td><input id="phone" name="phone" type="text" placeholder="Please enter phone number!" required></td>
        </tr>
        <tr>
            <td><label for="type">Librarian: </label></td>
            <td><input id="type" name="type" type="checkbox"></td>
        </tr>
        <tr>
            <td><input type="submit" value="Register"></td>
        </tr>
        <tr>
            <td><a href="/auth/login">Or... Login</a></td>
        </tr>
    </table>
</form>
</html>