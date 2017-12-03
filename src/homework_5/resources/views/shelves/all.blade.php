<html>
<head>
    <link rel="stylesheet" href="{{ URL::asset('css/shelves.css') }}">
</head>
<body>
<h2><a href="/">Home</a>->All Shelves</h2>
<h1>All shelves</h1>
@if($shelves)
    @foreach($shelves as $shelf)
        <h3><a href="shelves/{{$shelf->id}}">{{$shelf->shelf_name}}</a></h3>
    @endforeach
@endif
</body>
</html>