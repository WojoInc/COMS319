function loadImageData() {
    let ctx = $('#img-src').context;
    return ctx.getImageData(0, 0, ctx.width(), ctx.height());
}

function bitAtLoc_Int(input, loc) {
    return ((input >> loc) );
}

function realStrtoBitStr(string) {
    let bitStr = [];
    for (let i = 0; i < string.length; i++) {
        //assume 16 bit character representations.
        //I believe that JS stores 16 chars to accommodate unicode
        let bitsCh = [];
        for (let j = 0; j < 16; j++) {
            bitsCh.push(bitAtLoc_Int(string.charCodeAt(i), j));
        }
        bitStr = bitStr.concat(bitsCh);
    }
    return bitStr;
}

function bitStrToRealStr(bits) {

}

function encode() {
    let imgData = loadImageData();
    let imgColors = imgData.data;
    console.log(realStrtoBitStr($('#message').val()).toString());
}

function getMessage() {
    let message = $('#message').val();
    return JSON.stringify(message);
}