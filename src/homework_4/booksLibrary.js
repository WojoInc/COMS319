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
        this.activeUser = user;
        this.BKIDS = [];
        this.Books = this.getBooks();
        this.Shelves = {
            art: new Shelf("Art", 0),
            sci: new Shelf("Science", 1),
            sport: new Shelf("Sport", 2),
            lit: new Shelf("Literature", 3)
        };
        alert(JSON.stringify(this.Books));

        this.Container.html(this.createHTML());

        this.assignHandlers();
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
                    //TODO add event handler to each element or set it to cascade
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
        if (this.activeUser === 'admin') {
            HTML += Library.createHTMLForInput();
        }
        return HTML;
    }

    static createHTMLForInput() {
        let HTML = "<input type='text' placeholder='Book Name' id='input-bkname'>";
        HTML += "<input type='text' placeholder='Shelf (Art, Science, etc.' id='input-sfname'>";
        HTML += "<input type='button' value='Add Book' id='btn-addbk'>";
        return HTML;
    }

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
                alert("Response from AJAX: \n" + data);
                received = JSON.parse(data || "[]");
            }
        });
        /*Iterate over the received object array, and deserialize it,
         *calling the Book constructor for each one.
         */
        let lib = this;
        received.forEach(function (elem) {
            deserialized.push(new Book(elem['name'], elem['borrowedBy'], elem['availability'], elem['id']));
            //add book id to array to make it easier to add books later by reducing time complexity when searching
            // existing books for id conflicts when generating a new book id
            lib.BKIDS.push(elem['id']);
        });
        return deserialized;
    }

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
                this.Container.html(this.createHTML());
                this.assignHandlers();
                this.pushBooks();
                $slf.val();
                $bk.val();
            }
        }

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

    assignHandlers() {
        let lib = this;
        $('#btn-addbk').click(function (e) {
            e.preventDefault();
            lib.addBook();
        });
    }

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
        let HTML = "<td id=\"" + this.id + "\">";
        HTML += this.name + "</td>";
        return HTML;
    }

    getID() {
        return this.id;
    }
}