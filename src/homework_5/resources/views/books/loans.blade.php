<html>
<head>
    <link rel="stylesheet" href="{{ URL::asset('css/loans.css') }}">
</head>
<body>
<h2><a href="/">Home</a>->Borrow History->{{$book->book_name}}</h2>
<h1>Loan History</h1>
@if($book->loans->count()>0)
    <table id="loans">
        <tr>
            <th>Loan ID</th>
            <th>User ID</th>
            <th>Book ID</th>
            <th>Due Date</th>
            <th>Returned Date</th>
        </tr>
        @foreach($book->loans as $loan)
            <tr>
                <td>{{$loan->id}}</td>
                <td>{{$loan->user_id}} | {{$loan->user->username}}</td>
                <td>{{$loan->book_id}}</td>
                <td>{{$loan->due_date}}</td>
                <td>{{$loan->returned_date}}</td>
            </tr>
        @endforeach
    </table>
@else
    <h2>No loans!</h2>
@endif
</body>
</html>