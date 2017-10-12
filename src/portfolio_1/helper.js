$(document).ready(function () {
    $('#button-encode').click(function (e) {
        encode();
    });
});

function encode() {
    $.ajax({
        url: 'ajax/encrypt.php',
        message: $('#textarea-plaintext').text(),
    })
}