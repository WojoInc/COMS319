/**
 * Created by PhpStorm.
 * User: wojoinc@iastate.edu
 * Date: 10/1/17
 * Time: 1:17 PM
 */
class Calculator {

    constructor(elementId) {

        this.leftOp = 0;
        this.lastOp = '';
        this.memory = 0;

        this.View = {
            textRow: {id: "textRow", type: "text", value: "", onclick: ""},
            button1: {id: "button1", type: "button", value: 1, onclick: ""},
            button2: {id: "button2", type: "button", value: 2, onclick: ""},
            button3: {id: "button3", type: "button", value: 3, onclick: ""},
            button4: {id: "button4", type: "button", value: 4, onclick: ""},
            button5: {id: "button5", type: "button", value: 5, onclick: ""},
            button6: {id: "button6", type: "button", value: 6, onclick: ""},
            button7: {id: "button7", type: "button", value: 7, onclick: ""},
            button8: {id: "button8", type: "button", value: 8, onclick: ""},
            button9: {id: "button9", type: "button", value: 9, onclick: ""},
            button0: {id: "button0", type: "button", value: 0, onclick: ""},
            buttonPlus: {id: "button-plus", type: "button", value: '+', onclick: ""},
            buttonSub: {id: "button-sub", type: "button", value: '-', onclick: ""},
            buttonMul: {id: "button-mul", type: "button", value: '*', onclick: ""},
            buttonDiv: {id: "button-div", type: "button", value: '/', onclick: ""},
            buttonDot: {id: "button-dot", type: "button", value: '.', onclick: ""},
            buttonEqual: {id: "button-equal", type: "button", value: '=', onclick: ""},
            //TODO fix these values once parser is done
            buttonClr: {id: "button-clr", type: "button", value: 'C', onclick: ""},
            buttonMR: {id: "button-mrec", type: "button", value: 'MR', onclick: ""},
            buttonMSUB: {id: "button-msub", type: "button", value: 'M-', onclick: ""},
            buttonMADD: {id: "button-madd", type: "button", value: 'M+', onclick: ""},
            buttonMCLR: {id: "button-mclr", type: "button", value: 'MC', onclick: ""},
            container: document.getElementById(elementId)
        };

        this.Controller = {
            viewClickHandler: function (e) {
                let target = e.target;
                if (target.id == "button-equal") {
                    this.buttonHandlerEqual(Calculator.getCurrentEntry());
                } else if (target.id == "button-clr") {
                    this.buttonHandlerClr();
                } else if (target.id == "button-plus") {
                    this.buttonHandlerPlus();
                } else if (target.id == "button-sub") {
                    this.buttonHandlerMinus();
                } else if (target.id == "button-mul") {
                    this.buttonHandlerMul();
                } else if (target.id == "button-div") {
                    this.buttonHandlerDiv();
                } else if (target.id == "button-dot") {
                    this.buttonHandler(target.value);
                } else if (target.id == "button-mrec") {
                    this.buttonHandlerMemRec();
                } else if (target.id == "button-msub") {
                    this.buttonHandlerMemSub();
                } else if (target.id == "button-madd") {
                    this.buttonHandlerMemAdd();
                } else if (target.id == "button-mclr") {
                    this.buttonHandlerMemClr();
                }
                else {
                    this.buttonHandler(target.value);
                }
                this.colorizeButtons(target.id);
            }
        };

        this.clearOps = ['=', 'M+', 'M-', 'MR', 'MC'];
        this.attachButtonHandlers();
        let htmlString = this.createHTMLforView();
        console.log(htmlString);
        this.View.container.innerHTML = htmlString;
        return this;

    } // end of constructor

    colorizeButtons(elementID) {
        let buttons = this.View.container.getElementsByTagName('input');
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].style.color = 'black';
        }
        document.getElementById(elementID).style.color = 'red';
    }

    static getCurrentEntry() {
        return parseFloat(document.getElementById('textRow').value);
    }

    //
    // attachButtonHandlers
    // determines what action is taken when a button is clicked
    // makes sure that when we click on a button or cell, the "this"
    // reference is fixed to that cell
    //
    attachButtonHandlers() {
        this.View.container.onclick
            = this.Controller.viewClickHandler.bind(this);
    }

    buttonHandlerClr() {
        this.leftOp = 0;
        document.getElementById('textRow').value = '';
        this.lastOp = 'C';
    }

    buttonHandler(value) {
        if (this.clearOps.includes(this.lastOp)) {
            document.getElementById('textRow').value = '';
            this.lastOp = value;
        }
        document.getElementById('textRow').value = document.getElementById('textRow').value + value;
    }

    buttonHandlerEqual(value) {
        switch (this.lastOp) {
            case '+':
                this.buttonHandlerPlus();
                break;
            case '-':
                this.buttonHandlerMinus();
                break;
            case '*':
                this.buttonHandlerMul();
                break;
            case '/':
                this.buttonHandlerDiv();
                break;
        }
        document.getElementById('textRow').value = this.leftOp;
        this.leftOp = 0;
        this.lastOp = '=';
    }

    buttonHandlerMemClr() {
        this.memory = 0;
        this.lastOp = 'MC';
    }

    buttonHandlerMemAdd() {
        this.memory += Calculator.getCurrentEntry();
        this.lastOp = 'M+';
    }

    buttonHandlerMemSub() {
        this.memory -= Calculator.getCurrentEntry();
        this.lastOp = 'M-'
    }

    buttonHandlerMemRec() {
        document.getElementById('textRow').value = this.memory;
        this.lastOp = 'MR';
    }

    buttonHandlerMinus() {
        if (this.leftOp != 0) {
            this.leftOp -= Calculator.getCurrentEntry();
        }
        else {
            this.leftOp = Calculator.getCurrentEntry();
        }
        document.getElementById('textRow').value = '';
        this.lastOp = '-';
    }

    buttonHandlerPlus() {
        if (this.leftOp != 0) {
            this.leftOp += Calculator.getCurrentEntry();
        }
        else {
            this.leftOp = Calculator.getCurrentEntry();
        }
        document.getElementById('textRow').value = '';
        this.lastOp = '+';
    }

    buttonHandlerMul() {
        if (this.leftOp != 0) {
            this.leftOp *= Calculator.getCurrentEntry();
        }
        else {
            this.leftOp = Calculator.getCurrentEntry();
        }
        document.getElementById('textRow').value = '';
        this.lastOp = '*';
    }

    buttonHandlerDiv() {
        if (this.leftOp != 0) {
            this.leftOp /= Calculator.getCurrentEntry();
        }
        else {
            this.leftOp = Calculator.getCurrentEntry();
        }
        document.getElementById('textRow').value = '';
        this.lastOp = '/';
    }

    //
    // createHTMLforView
    // Utility. creates HTML formatted text for the entire view
    //
    createHTMLforView() {
        var s;
        s = "<table id=\"myTable\" border=2>"

        // row for results
        s += "<tr><td>" + this.createHTMLforElement(this.View.textRow) + "</td></tr>";
        s += "<tr><td>";

        // thisulator buttons
        s += this.createHTMLforElement(this.View.button7);
        s += this.createHTMLforElement(this.View.button8);
        s += this.createHTMLforElement(this.View.button9);
        s += this.createHTMLforElement(this.View.buttonPlus);
        s += "</td></tr><tr><td>";
        s += this.createHTMLforElement(this.View.button4);
        s += this.createHTMLforElement(this.View.button5);
        s += this.createHTMLforElement(this.View.button6);
        s += this.createHTMLforElement(this.View.buttonSub);
        s += "</td></tr><tr><td>";
        s += this.createHTMLforElement(this.View.button1);
        s += this.createHTMLforElement(this.View.button2);
        s += this.createHTMLforElement(this.View.button3);
        s += this.createHTMLforElement(this.View.buttonMul);
        s += "</td></tr><tr><td>";
        s += this.createHTMLforElement(this.View.button0);
        s += this.createHTMLforElement(this.View.buttonDot);
        s += this.createHTMLforElement(this.View.buttonEqual);
        s += this.createHTMLforElement(this.View.buttonDiv);
        s += "</td></tr><tr><td>";
        s += this.createHTMLforElement(this.View.buttonClr);
        s += this.createHTMLforElement(this.View.buttonMR);
        s += this.createHTMLforElement(this.View.buttonMSUB);
        s += "</td></tr><tr><td>";
        s += this.createHTMLforElement(this.View.buttonMADD);
        s += this.createHTMLforElement(this.View.buttonMCLR);
        s += "</td></tr></table>";
        return s;
    }


    //
    // createHTMLforElement
    // utility. creates html formatted text for an element
    //
    createHTMLforElement(element) {
        var s = "<input ";
        s += " id=\"" + element.id + "\"";
        s += " type=\"" + element.type + "\"";
        s += " value= \"" + element.value + "\"";
        s += " onclick= \"" + element.onclick + "\"";
        s += ">";
        return s;
    }

} // end of Calculator;


