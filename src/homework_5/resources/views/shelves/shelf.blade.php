<html>
<head>
    <link rel="stylesheet" href="{{ URL::asset('css/shelves.css') }}">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    <script src="{{URL::asset('js/books/borrow.js')}}"></script>
</head>
<body>
<h2><a href="/">Home</a>-><a href="/shelves">All Shelves</a>->{{$shelf->shelf_name}}</h2>
<table id="{{$shelf->shelf_name}}-table">
    <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Author</th>
        <th>Available?</th>
        <th></th>
    </tr>
    @foreach($shelf->books as $book)
        <tr>
            <td>{{$book->id}}</td>
            <td><a href="/books/{{$book->id}}">{{$book->book_name}}</a></td>
            <td>{{$book->author}}</td>
            <td id="availability-{{$book->id}}">{{$book->availability ? 'yes' : 'no'}}</td>
            <td id="action-{{$book->id}}">
                @if($book->availability)
                    <input type="button" onclick="borrowBook({{$book->id}});" value="Borrow"
                           id="btn-borrow-{{$book->id}}">
                @else
                    <input type="button" onclick="returnBook({{$book->id}});" value="Return"
                           id="btn-return-{{$book->id}}">
                @endif
            </td>
        </tr>
    @endforeach
</table>
</body>
</html>