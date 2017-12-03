<html>
<body>
<h3><a href="/">Home</a></h3>
<h1>Welcome to the online library, {{session('username')}}!</h1>

<form id="usermenu">
    {{csrf_field()}}
    @if(session('librarian'))
        <input id="btn-add-book" type="submit" value="Add Book" formmethod="get" formaction="/books/create"><br>
        <input id="btn-delete-book" type="submit" value="Delete Book" formmethod="get" formaction="/books/remove"><br>
        <input id="btn-view-borrow" type="submit" value="View Borrow History" formmethod="get" formaction="/loans"><br>
    @endif
    <input id="btn-view-shelves" type="submit" value="View All Shelves" formmethod="get" formaction="/shelves"><br>
    <input id="btn-logout" type="submit" value="Logout" formmethod="post" formaction="/logout"><br>
</form>
</body>
</html>