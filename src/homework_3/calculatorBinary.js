/**
 * Created by PhpStorm.
 * User: wojoinc@iastate.edu
 * Date: 10/1/17
 * Time: 1:16 PM
 */
class BinaryCalculator {

    constructor(elementId) {

        this.leftOp = 0;
        this.lastOp = '';
        this.memory = 0;

        this.View = {
            entryRow: {id: "entryRow", type: "text", value: "", onclick: "", style: "text-align: right"},
            button1: {id: "bbutton1", type: "button", value: 1, onclick: ""},
            button0: {id: "bbutton0", type: "button", value: 0, onclick: ""},
            buttonPlus: {id: "bbutton-plus", type: "button", value: '+', onclick: ""},
            buttonSub: {id: "bbutton-sub", type: "button", value: '-', onclick: ""},
            buttonMul: {id: "bbutton-mul", type: "button", value: '*', onclick: ""},
            buttonDiv: {id: "bbutton-div", type: "button", value: '/', onclick: ""},
            buttonMod: {id: "bbutton-mod", type: "button", value: '%', onclick: ""},
            buttonAnd: {id: "bbutton-and", type: "button", value: '&', onclick: ""},
            //TODO fix these values once parser is done
            buttonClr: {id: "bbutton-clr", type: "button", value: 'C', onclick: ""},
            buttonBSR: {id: "bbutton-bsr", type: "button", value: '>>', onclick: ""},
            buttonBSL: {id: "bbutton-bsl", type: "button", value: '<<', onclick: ""},
            buttonOR: {id: "bbutton-or", type: "button", value: '|', onclick: ""},
            buttonNOT: {id: "bbutton-not", type: "button", value: '~', onclick: ""},
            buttonEqual: {id: "bbutton-equal", type: "button", value: '=', onclick: ""},
            buttonMR: {id: "bbutton-mrec", type: "button", value: 'MR', onclick: ""},
            buttonMSUB: {id: "bbutton-msub", type: "button", value: 'M-', onclick: ""},
            buttonMADD: {id: "bbutton-madd", type: "button", value: 'M+', onclick: ""},
            buttonMCLR: {id: "bbutton-mclr", type: "button", value: 'MC', onclick: ""},
            container: document.getElementById(elementId)
        };

        this.Controller = {
            viewClickHandler: function (e) {
                let target = e.target;
                if (target.id == "bbutton-equal") {
                    this.buttonHandlerEqual(BinaryCalculator.getCurrentEntry());
                } else if (target.id == "bbutton-clr") {
                    this.buttonHandlerClr();
                } else if (target.id == "bbbutton-plus") {
                    this.buttonHandlerPlus();
                } else if (target.id == "bbutton-sub") {
                    this.buttonHandlerMinus();
                } else if (target.id == "bbutton-mul") {
                    this.buttonHandlerMul();
                } else if (target.id == "bbutton-div") {
                    this.buttonHandlerDiv();
                } else if (target.id == "bbutton-bsr") {
                    this.buttonHandlerShift(target.value);
                } else if (target.id == "bbutton-bsl") {
                    this.buttonHandlerShift(target.value);
                } else if (target.id == "bbutton-mod") {
                    this.buttonHandlerMod();
                } else if (target.id == "bbutton-and") {
                    this.buttonHandlerLogic(target.value);
                } else if (target.id == "bbutton-or") {
                    this.buttonHandlerLogic(target.value);
                } else if (target.id == "bbutton-not") {
                    this.buttonHandlerLogic(target.value);
                } else if (target.id == "bbutton-mrec") {
                    this.buttonHandlerMemRec();
                } else if (target.id == "bbutton-msub") {
                    this.buttonHandlerMemSub();
                } else if (target.id == "bbutton-madd") {
                    this.buttonHandlerMemAdd();
                } else if (target.id == "bbutton-mclr") {
                    this.buttonHandlerMemClr();
                }
                else {
                    this.buttonHandler(target.value);
                }
                this.colorizeButtons(target.id);
            }
        };

        this.clearOps = ['=', 'M+', 'M-', 'MR', 'MC', '<<', '>>'];
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
        return document.getElementById('entryRow').value;
    }

    static bStrToInt(binary) {
        return parseInt(binary, 2);
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
        document.getElementById('entryRow').value = '';
        this.lastOp = 'C';
    }

    buttonHandler(value) {
        if (this.clearOps.includes(this.lastOp)) {
            document.getElementById('entryRow').value = '';
            this.lastOp = value;
        }
        document.getElementById('entryRow').value = document.getElementById('entryRow').value + value;
    }

    buttonHandlerEqual() {
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
            case '%':
                this.buttonHandlerMod();
                break;
            case '&':
                this.buttonHandlerLogic(this.lastOp);
                break;
            case '|':
                this.buttonHandlerLogic(this.lastOp);
                break;
        }
        document.getElementById('entryRow').value = this.leftOp >= 0 ? this.leftOp.toString(2) : 'Value is negative!';
        this.lastOp = 0;
    }

    buttonHandlerMemClr() {
        this.memory = 0;
        this.lastOp = 'MC';
    }

    buttonHandlerMemAdd() {
        this.memory += BinaryCalculator.bStrToInt(BinaryCalculator.getCurrentEntry());
        this.lastOp = 'M+';
    }

    buttonHandlerMemSub() {
        this.memory -= BinaryCalculator.bStrToInt(BinaryCalculator.getCurrentEntry());
        this.lastOp = 'M-'
    }

    buttonHandlerMemRec() {
        document.getElementById('entryRow').value = this.memory.toString(2);
        this.lastOp = 'MR';
    }

    buttonHandlerMinus() {
        if (this.leftOp != 0) {
            this.leftOp -= BinaryCalculator.bStrToInt(BinaryCalculator.getCurrentEntry());
        }
        else {
            this.leftOp = BinaryCalculator.bStrToInt(BinaryCalculator.getCurrentEntry());
        }
        document.getElementById('entryRow').value = '';
        this.lastOp = '-';
    }

    buttonHandlerPlus() {
        if (this.leftOp != 0) {
            this.leftOp += BinaryCalculator.bStrToInt(BinaryCalculator.getCurrentEntry());
        }
        else {
            this.leftOp = BinaryCalculator.bStrToInt(BinaryCalculator.getCurrentEntry());
        }
        document.getElementById('entryRow').value = '';
        this.lastOp = '+';
    }

    buttonHandlerMul() {
        if (this.leftOp != 0) {
            this.leftOp *= BinaryCalculator.bStrToInt(BinaryCalculator.getCurrentEntry());
        }
        else {
            this.leftOp = BinaryCalculator.bStrToInt(BinaryCalculator.getCurrentEntry());
        }
        document.getElementById('entryRow').value = '';
        this.lastOp = '*';
    }

    //Performs integer division via Math.floor(), skipped support for floating point numbers in this calculator
    buttonHandlerDiv() {
        if (this.leftOp != 0) {
            this.leftOp = Math.floor(this.leftOp / BinaryCalculator.bStrToInt(BinaryCalculator.getCurrentEntry()));
        }
        else {
            this.leftOp = BinaryCalculator.bStrToInt(BinaryCalculator.getCurrentEntry());
        }
        document.getElementById('entryRow').value = '';
        this.lastOp = '/';
    }

    buttonHandlerShift(elementVal) {
        if (elementVal == '>>') {
            document.getElementById('entryRow').value = (BinaryCalculator.bStrToInt(BinaryCalculator.getCurrentEntry()) >> 1).toString(2);
        } else if (elementVal == '<<') {
            document.getElementById('entryRow').value = (BinaryCalculator.bStrToInt(BinaryCalculator.getCurrentEntry()) << 1).toString(2);
        }
        this.lastOp = elementVal;
    }

    buttonHandlerMod() {
        if (this.leftOp != 0) {
            this.leftOp %= BinaryCalculator.bStrToInt(BinaryCalculator.getCurrentEntry());
        }
        else {
            this.leftOp = BinaryCalculator.bStrToInt(BinaryCalculator.getCurrentEntry());
        }
        document.getElementById('entryRow').value = '';
        this.lastOp = '%';
    }

    buttonHandlerLogic(elementVal) {
        if (elementVal == '&') {
            if (this.leftOp != 0) {
                this.leftOp &= BinaryCalculator.bStrToInt(BinaryCalculator.getCurrentEntry());
            }
            else {
                this.leftOp = BinaryCalculator.bStrToInt(BinaryCalculator.getCurrentEntry());
            }
            document.getElementById('entryRow').value = '';
        } else if (elementVal == '|') {
            if (this.leftOp != 0) {
                this.leftOp |= BinaryCalculator.bStrToInt(BinaryCalculator.getCurrentEntry());
            }
            else {
                this.leftOp = BinaryCalculator.bStrToInt(BinaryCalculator.getCurrentEntry());
            }
            document.getElementById('entryRow').value = '';
        } else if (elementVal == '~') {
            this.leftOp = 0;
            //apply mask to avoid issues with flipping bits, as js stores values as 64bits, inverting all bits gives negative value otherwise
            let entry = BinaryCalculator.getCurrentEntry();
            let maskLen = entry.length;
            let mask = Math.pow(2, maskLen) - 1;
            let value = (~BinaryCalculator.bStrToInt((BinaryCalculator.getCurrentEntry()))) & mask;
            let output = value.toString(2);
            //pad with leading zeroes
            while (output.length < maskLen) {
                output = '0' + output;
            }
            document.getElementById('entryRow').value = output;
        }
        this.lastOp = elementVal;
    }

    //
    // createHTMLforView
    // Utility. creates HTML formatted text for the entire view
    //
    createHTMLforView() {
        var s;
        s = "<table id=\"myTable\" border=2>"

        // row for results
        s += "<tr><td>" + this.createHTMLforElement(this.View.entryRow) + "</td></tr>";
        s += "<tr><td>";

        // thisulator buttons
        s += this.createHTMLforElement(this.View.button0);
        s += this.createHTMLforElement(this.View.button1);
        s += this.createHTMLforElement(this.View.buttonPlus);
        s += this.createHTMLforElement(this.View.buttonSub);
        s += "</td></tr><tr><td>";
        s += this.createHTMLforElement(this.View.buttonMul);
        s += this.createHTMLforElement(this.View.buttonDiv);
        s += this.createHTMLforElement(this.View.buttonMod);
        s += this.createHTMLforElement(this.View.buttonAnd);
        s += "</td></tr><tr><td>";
        s += this.createHTMLforElement(this.View.buttonOR);
        s += this.createHTMLforElement(this.View.buttonNOT);
        s += this.createHTMLforElement(this.View.buttonBSR);
        s += this.createHTMLforElement(this.View.buttonBSL);
        s += "</td></tr><tr><td>";
        s += this.createHTMLforElement(this.View.buttonEqual);
        s += this.createHTMLforElement(this.View.buttonClr);
        s += "</td></tr><tr><td>";
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
