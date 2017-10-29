/**
 * Created by PhpStorm.
 * User: wojoinc
 * Date: 10/28/2017
 */
$(document).ready(function () {
    if (localStorage.getItem("username") == undefined) {
        alert("You need to login first!");
        window.location.replace("login.html");
    }
    else {
        new Library("content", localStorage.getItem("username"));
    }
});

class Library {
    constructor(parentElement, user) {
        this.Container = $('#' + parentElement);
        this.activeUser = new User(user);
        this.BKIDS = [];
        this.Books = this.getBooks();
        this.Shelves = {
            art: new Shelf("Art", 0),
            sci: new Shelf("Science", 1),
            sport: new Shelf("Sport", 2),
            lit: new Shelf("Literature", 3)
        };
        // alert(JSON.stringify(this.Books));

        this.Container.html(this.createHTML());

        if (this.activeUser.name === 'admin') {
            this.assignHandlersLibrarian();
        }
        else {
            this.assignHandlersUndergrad();
            this.activeUser.highlightBorrowed();
        }
    }

    createHTML() {
        let HTML = "<table id=\"library\">";
        let art = this.Shelves.art.createBeginHTML();
        let sci = this.Shelves.sci.createBeginHTML();
        let sport = this.Shelves.sport.createBeginHTML();
        let lit = this.Shelves.lit.createBeginHTML();
        let that = this;
        this.Books.forEach(function (elem) {
            switch (elem.getID() % 4) {
                case that.Shelves.art.getCategoryID():
                    art += elem.createHTML();
                    break;
                case that.Shelves.sci.getCategoryID():
                    sci += elem.createHTML();
                    break;
                case that.Shelves.sport.getCategoryID():
                    sport += elem.createHTML();
                    break;
                case that.Shelves.lit.getCategoryID():
                    lit += elem.createHTML();
                    break;
            }
        });
        art += this.Shelves.art.createEndHTML();
        sci += this.Shelves.art.createEndHTML();
        sport += this.Shelves.art.createEndHTML();
        lit += this.Shelves.art.createEndHTML();
        HTML = HTML + art + sci + sport + lit + "</table>";
        if (this.activeUser.name === 'admin') {
            HTML += Library.createHTMLForInput();
        }
        return HTML;
    }

    /**
     * Create additional HTML to add controls for admin view
     * @returns {string}
     */
    static createHTMLForInput() {
        let HTML = "<p id='desc'></p>";
        HTML += "<input type='text' placeholder='Book Name' id='input-bkname'>";
        HTML += "<input type='text' placeholder='Shelf (Art, Science, etc.' id='input-sfname'>";
        HTML += "<input type='button' value='Add Book' id='btn-addbk'>";
        return HTML;
    }

    /**
     * Pull books from books.txt over ajax.
     * @returns {Array}
     */
    getBooks() {
        let received = null;
        let deserialized = [];
        $.ajax({
            url: "get_books.php",
            type: "POST",
            async: false,
            data: {
                command: 0
            },
            //dataType: 'application/json; charset=utf-8',
            success: function (data) {
                //alert("Response from AJAX: \n" + data);
                received = JSON.parse(data || "[]");
            }
        });
        /*Iterate over the received object array, and deserialize it,
         *calling the Book constructor for each one.
         */
        let lib = this;
        received.forEach(function (elem) {
            deserialized.push(new Book(elem['name'], elem['borrowedBy'], elem['availability'], elem['id']));
            if (elem['borrowedBy'] === lib.activeUser.name) {
                lib.activeUser.borrowBook(elem['id']);
            }
            //add book id to array to make it easier to add books later by reducing time complexity when searching
            // existing books for id conflicts when generating a new book id
            lib.BKIDS.push(elem['id']);
        });
        return deserialized;
    }

    /**
     * Add a new book to library
     */
    addBook() {
        let $bk = $('#input-bkname');
        let $slf = $('#input-sfname');

        if ($bk.val() === '' || $slf.val() === '') {
            alert("Please make sure to input both a book name, and a shelf name!");
            return;
        }
        else {
            let bkid = this.generateBookID($slf.val().toUpperCase());
            if (bkid === -1) {
                alert("Shelf entered does not exist! Please pick from the available shelves.");
                $slf.val('');
                return;
            }
            else {
                this.Books.push(new Book($bk.val(), '', 1, bkid));
                this.BKIDS.push(bkid);
                this.Container.html(this.createHTML());
                this.assignHandlersLibrarian();
                this.pushBooks();
                $slf.val();
                $bk.val();
            }
        }

    }

    /**
     * Get name of shelf book belongs to based on ID.
     * @param bookID id of book
     * @returns {*}
     */
    getShelfFromID(bookID) {
        let shelf;
        switch (bookID % 4) {
            case this.Shelves.art.getCategoryID():
                shelf = this.Shelves.art.category;
                break;
            case this.Shelves.sci.getCategoryID():
                shelf = this.Shelves.sci.category;
                break;
            case this.Shelves.sport.getCategoryID():
                shelf = this.Shelves.sport.category;
                break;
            case this.Shelves.lit.getCategoryID():
                shelf = this.Shelves.lit.category;
                break;
        }
        return shelf;
    }

    /**
     * Generate new book ID. Generate random multiple of four and then add category offset.
     * @param shelf the shelf, and thereby category, to add book to
     * @returns {number} the new book id.
     */
    generateBookID(shelf) {
        let offset = 0;
        switch (shelf) {
            case 'ART':
                offset = this.Shelves.art.getCategoryID();
                break;
            case 'SCIENCE':
                offset = this.Shelves.sci.getCategoryID();
                break;
            case 'SPORT':
                offset = this.Shelves.sport.getCategoryID();
                break;
            case 'LITERATURE':
                offset = this.Shelves.lit.getCategoryID();
                break;
            default:
                return -1;
        }
        //if id exists already, generate a new one
        let newID = (Math.floor(Math.random() * 249)) * 4 + offset;
        if (this.BKIDS.includes(newID)) {
            this.generateBookID(shelf);
        }
        else {
            return newID;
        }
    }

    /**
     * Assign the necessary event handlers for the admin view of the library
     */
    assignHandlersLibrarian() {
        let lib = this;
        $('#btn-addbk').click(function (e) {
            e.preventDefault();
            lib.addBook();
        });
        $('.book').click(function (e) {
            let book = lib.Books[lib.BKIDS.indexOf(parseInt(this.id))];
            $('#desc').html("\"" + book.name + "\"" +
                (book.availability !== 1 ? (" is borrowed by: " + book.borrowedBy) : (" is available" )) +
                " and belongs on shelf: " + lib.getShelfFromID(book.id));
        });
    }

    checkoutBook(book) {
        book.borrowedBy = this.activeUser.name;
        book.availability = 0;
        this.activeUser.borrowBook(book.getID());
        //update element on page so that it appears as checked out by user
        $('#' + book.getID()).attr('class', 'book borrowed');
        this.createHTML();
        this.pushBooks();
    }

    returnBook(book) {
        if (this.activeUser.returnBook(book.getID())) {
            book.availability = 1;
            book.borrowedBy = '';
            //update element on page to appear as available
            $('#' + book.getID()).attr('class', 'book available');
            this.createHTML();
            this.pushBooks();
        }
        else {
            //condition where book is not available but is also not checked out by user, ie checked out by another user
            alert("This book is not available!");
        }
    }

    /**
     * Assign the handlers for the undergrad view of the library
     */
    assignHandlersUndergrad() {
        let lib = this;
        $('.book').click(function (e) {
            let book = lib.Books[lib.BKIDS.indexOf(parseInt(this.id))];
            if (book.availability === 1) {
                if (lib.activeUser.canCheckout()) {
                    lib.checkoutBook(book);
                }
            }
            else {
                lib.returnBook(book);
            }
        });
    }

    /**
     * Push current contents of Library.Books to books.txt over ajax.
     */
    pushBooks() {
        $.ajax({
            url: "get_books.php",
            type: "POST",
            data: {
                command: 1,
                books: JSON.stringify(this.Books)
            },
        });
    }


}

class User {
    constructor(username) {
        this.name = username;
        this.numBooks = 0;
        this.borrowed = [];
    }

    canCheckout() {
        return this.numBooks < 2;
    }

    borrowBook(id) {
        this.borrowed[this.numBooks] = id;
        this.numBooks++;
    }

    returnBook(id) {
        let loc = this.borrowed.indexOf(id);
        if (loc >= 0) {
            this.borrowed[this.borrowed.indexOf(id)] = '';
            this.numBooks--;
            return true;
        }
        else return false;
    }

    highlightBorrowed() {
        let user = this;
        this.borrowed.forEach(function (e) {
            $('#' + e).attr('class', 'book borrowed');
        })
    }
}

class Shelf {
    constructor(category, id) {
        this.category = category;
        this.id = id;
    }

    createBeginHTML() {
        return "<tr><th>" + this.category + "</th>";
    }

    createEndHTML() {
        return "</tr>";
    }

    getCategoryID() {
        return this.id;
    }
}

class Book {
    constructor(name, borrowedBy, availability, id) {
        this.name = name;
        this.borrowedBy = borrowedBy;
        this.availability = availability;
        this.id = id;
    }

    createHTML() {
        let HTML = "<td class='book " + (this.availability === 1 ? "available" : "unavailable");
        HTML += "' id=\"" + this.id + "\">";
        HTML += this.name + "</td>";
        return HTML;
    }

    getID() {
        return this.id;
    }
}