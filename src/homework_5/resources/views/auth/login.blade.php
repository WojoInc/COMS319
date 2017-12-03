<html>
<title>Library</title>
<body>
<h1>Welcome to the Library, please login!</h1>
@if($errors->any())
    <div class="alert alert-danger">
        <ul>
            @foreach($errors->all() as $msg)
                <li>{{$msg}}</li>
            @endforeach
        </ul>
    </div>
@endif
<form id="form-login" action="login" method="post">
    {{csrf_field()}}
    <table id="layout-login-form">
        <tr>
            <td><input id="username" name="username" type="text" placeholder="Please enter username!" required></td>
        </tr>
        <tr>
            <td><input id="password" name="password" type="password" placeholder="Please enter password!" required></td>
        </tr>
        <tr>
            <td><input type="submit" value="Login"></td>
        </tr>
        <tr>
            <td><a href="register">Or... Register</a></td>
        </tr>
    </table>
</form>
</body>
</html>