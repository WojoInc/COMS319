/**
 * Created by PhpStorm.
 * User: wojoinc
 * Date: 10/28/2017
 */
$(document).ready(function () {
    $('#btn-login').click(function () {
        let $user = $('#username');
        let $pass = $('#password');
        if ($pass.val() === 'admin' && $user.val() === 'admin') {
            localStorage.setItem('username', $user.val());
            $('#loginform').submit();
        }
        else if ($user.val()[0] === 'U' && $pass.val() !== '') {
            localStorage.setItem('username', $user.val());
            $('#loginform').submit();
        }
        else {
            alert("Incorrect username/password!");
            //reset fields
            $user.val('');
            $pass.val('');
        }
    });
});