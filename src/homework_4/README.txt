Code also has additional comments if necessary
My version of the homework currently has three users to demonstrate the functionality.
The users:
- UTom
- UBob
- admin (Librarian)

Each of the undergrad users will accept any password, while the librarian is admin:admin as described in
the assignment description. Both the user and admin versions of the library page will display the books in the
horizontal shelf format. I did not enter 24 books while writing the homework, but the way I have written the book id
generator, it will support up to 250 books. The books.txt file already contains books as samples, which are stored in
their JSON format, and parsed by the library when requested over AJAX.

Logging in as the librarian will show several green and several yellow boxes. Here Green denotes that a book is
available for checkout, while Yellow denotes that a book is currently borrowed by a user. Clicking on each book
displays a message stating who is borrowing the book.

As the assignment description was not clear on how to handle having more than one undergrad user, I solved this issue
the following way. Logging in as any undergrad will display the books in three colors:

    Red - Book is borrowed by current user
    Yellow - Book is unavailable, ie. borrowed by another user
    Green - Book is available to borrow.

Clicking on a red book will return the book, and clicking on one that is green will checkout the book, provided the
user has not reached the checkout limit of two books, in which case it does nothing.

Clicking on a Yellow book will display an alert stating that the book is unavailable to check out.