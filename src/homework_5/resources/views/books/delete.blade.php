<html>
<body>
<h2><a href="/">Home</a>->Delete Book</h2>
<h1>Delete Book</h1>
<form id="delete-form" method="post" action="/books/">
    {{csrf_field()}}
    {{method_field('DELETE')}}
    <script>
        function setBookID(id) {
            document.getElementById('delete-form').setAttribute('action', '/books/' + id);
        }
    </script>
    <br>
    <label>Book ID</label>
    <input type="text" placeholder="Enter Book ID" id="book_id" name="book_id" onfocusout="setBookID(value);"
           required><br/>
    <br>
    <input type="submit" value="Submit" id="submit" name="submit">
</form>
</body>
</html>