$(document).ready(function () {
    $('#button-encode').click(function (e) {
        encode();
    });
    $('#button-decode').click(function (e) {
        decode();
    });
});

function encode() {
    alert("Encoding");
    $.ajax({
        url: 'ajax/encrypt.php',
        type: 'POST',
        data: {
            message: $('#textarea-plaintext').val(),
            image: '000.jpg'
        },
        success: function (data) {
            alert(data);
        }
    })

}

function decode() {
    alert("Decoding");
    $.ajax({
        url: 'ajax/encrypt.php',
        type: 'POST',
        data: {
            image: '000.jpg'
        },
        success: function (data) {
            alert(data);
        }
    })

}