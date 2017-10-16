$(document).ready(function () {
    $('#button-encode').click(function (e) {
        encode();
    });
    $('#button-decode').click(function (e) {
        decode();
    });

    $("#uploadimage").on('submit', (function (e) {
        $.ajax({
            url: "ajax/upload.php",
            type: "POST",
            data: new FormData(this),
            contentType: false,
            cache: false,
            processData: false,
            success: function (data) {
                alert(data);
                $('#loading').hide();
                $("#message").html(data);
            }
        });
    }));
});

function encode() {
    alert("Encoding");
    $.ajax({
        url: 'ajax/encrypt.php',
        type: 'POST',
        data: {
            message: $('#textarea-plaintext').val(),
            image: 'witcherfiend.png'
        },
        success: function (data) {
            alert(data);
        }
    })

}

function decode() {
    alert("Decoding");
    $.ajax({
        url: 'ajax/decrypt.php',
        type: 'POST',
        data: {
            image: 'simple.png'
        },
        success: function (data) {
            alert(data);
        }
    })

}

function uploadImage() {

}