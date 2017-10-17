$(document).ready(function () {
    $('#button-encode').click(function (e) {
        encode();
    });
    $('#button-decode').click(function (e) {
        decode();
    });

    $("#uploadimage").on('submit', (function (e) {
        e.preventDefault();
        $.ajax({
            url: "ajax/upload.php",
            type: "POST",
            data: new FormData(this),
            contentType: false,
            cache: false,
            processData: false,
            success: function (data) {
                $('#img-source').attr('src', data);
                return false;
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
            image: $('#file').val()
        },
        success: function (data) {
            $('#img-encoded').attr('src', data);
            localStorage.setItem('encoded-image-path', data);
        }
    })

}

function decode() {
    alert("Decoding");
    $.ajax({
        url: 'ajax/decrypt.php',
        type: 'POST',
        data: {
            image: $('#file').val()
        },
        success: function (data) {
            alert(data);
        }
    })

}

function uploadImage() {

}