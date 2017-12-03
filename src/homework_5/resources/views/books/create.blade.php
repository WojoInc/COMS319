<html>
<body>
<h3><a href="/">Home</a>->Add Books</h3>
<h3>Add Books</h3>
<form method="post" action="/books">
    {{csrf_field()}}
    <br>
    <label>Book Name</label>
    <input type="text" placeholder="Enter Book Name" id="book_name" name="book_name" required><br/>
    <br>
    <label>Author</label>
    <input type="text" placeholder="Enter Author" id="author" name="author" required><br/>
    <label>Category</label>
    <select id="shelf" name="shelf" required>
        <option value="Art">Art</option>
        <option value="Science">Science</option>
        <option value="Sport">Sport</option>
        <option value="Literature">Literature</option>
    </select>
    <br>
    <input type="submit" value="Submit" id="submit" name="submit">
</form>
</body>
</html>