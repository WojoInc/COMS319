function borrowBook(id) {
    $.ajax({
        method: 'post',
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        url: '/books/' + id + '/borrow',
        success: function (data) {
            $('#availability-' + id).html('no');
            $('#action-' + id).html(
                '<input type="button" onclick="returnBook(' + id + ');" value="Return" id="btn-return-' + id + '">'
            );
        },
        error: function () {
            alert('Failed to borrow book');
        }

    });

}

function returnBook(id) {
    $.ajax({
        method: 'post',
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        url: '/books/' + id + '/return',
        success: function (data) {
            $('#availability-' + id).html('yes');
            $('#action-' + id).html(
                '<input type="button" onclick="borrowBook(' + id + ');" value="Borrow" id="btn-borrow-' + id + '">'
            );
        },
        error: function () {
            alert('Failed to borrow book');
        }

    });

}
