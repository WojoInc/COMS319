// initialize
$(document).ready(function() {
    // add action to the file input
    $('#image-input').change(function (e){
        importImage(e);
    });

    $('#button-encode').click(function (e){
        encode();
    });

    $('#button-decode').click(function (e) {
        decode();
    });
});

// artificially limit the message size
let maxMessageSize = 1000;

// put image in the canvas and display it
let importImage = function(e) {
    let reader = new FileReader();

    reader.onload = function(event) {
        // display uploaded image
        $('#image-input').css('display', 'block');
        $('#image-input').attr('src',event.target.result);

        // Make sure all inputs and outputs are blank
        $('#textarea-plaintext').text('');

        /*document.getElementById('message').value = '';
        document.getElementById('password').value = '';
        document.getElementById('password2').value = '';
        document.getElementById('messageDecoded').innerHTML = '';*/

        // read the data into the canvas element
        let img = new Image();
        img.onload = function() {
            let ctx = document.getElementById('canvas-source').getContext('2d');
            ctx.canvas.width = img.width;
            ctx.canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            decode();
        };
        img.src = event.target.result;
    };

    reader.readAsDataURL(e.target.files[0]);
};

// encode the image and save it
let encode = function() {
    let message = $('#textarea-plaintext').text();
    let password = $('#input-pass-enc').text();
    let output = $('#img-encoded');
    let canvas = $('#canvas-source').get(0);
    let ctx = canvas.getContext('2d');

    // ask about using password. Would like to use php if possible
    /*if (password.length > 0) {
        messag$('#textarea-plaintext').text();e = sjcl.encrypt(password, message);
    } else {
        message = JSON.stringify({'text': message});
    }*/
    message = JSON.stringify({'text': message});

    // exit early if the message is too big for the image
    let pixelCount = ctx.canvas.width * ctx.canvas.height;
    if ((message.length + 1) * 16 > pixelCount * 4 * 0.75) {
        alert('Message is too big for the image.');
        return;
    }

    // exit early if the message is above an artificial limit
    if (message.length > maxMessageSize) {
        alert('Message is too big.');
        return;
    }

    // encode the encrypted message with the supplied password
    let imgData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    encodeMessage(imgData.data, sjcl.hash.sha256.hash(password), message);
    ctx.putImageData(imgData, 0, 0);

    // view the new image
    alert('Done! Right-click -> Save As...');

    output.attr('src',canvas.toDataURL());

};

// decode the image and display the contents if there is anything
var decode = function() {
    let password = document.getElementById('password2').value;
    let passwordFail = 'Password is incorrect or there is nothing here.';

    // decode the message with the supplied password
    let ctx = $('#canvas-source').get(0).getContext('2d');
    let imgData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    let message = decodeMessage(imgData.data, sjcl.hash.sha256.hash(password));

    // try to parse the JSON
    let obj = null;
    try {
        obj = JSON.parse(message);
    } catch (e) {
        // display the "choose" view

        document.getElementById('choose').style.display = 'block';
        document.getElementById('reveal').style.display = 'none';

        if (password.length > 0) {
            alert(passwordFail);
        }
    }

    // display the "reveal" view
    if (obj) {
        document.getElementById('choose').style.display = 'none';
        document.getElementById('reveal').style.display = 'block';

        // decrypt if necessary
        if (obj.ct) {
            try {
                obj.text = sjcl.decrypt(password, message);
            } catch (e) {
                alert(passwordFail);
            }
        }

        // escape special characters
        var escChars = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            '\'': '&#39;',
            '/': '&#x2F;',
            '\n': '<br/>'
        };
        var escHtml = function(string) {
            return String(string).replace(/[&<>"'\/\n]/g, function (c) {
                return escChars[c];
            });
        };
        document.getElementById('messageDecoded').innerHTML = escHtml(obj.text);
    }
};

// returns an integer value 0 or 1, for the nth bit of the input
let bitAt = function(input, nth) {
   return ((input >> nth) & 1);
};

// sets the bit in 'location' to 'bit' (either a 1 or 0)
let setBit = function(number, location, bit) {
   return (number & ~(1 << location)) | (bit << location);
};

// returns an array of 1s and 0s representing a 2-byte unicode number
let getBitsFromNumber = function(number) {
   let bits = [];
   for (let i = 0; i < 16; i++) {
       bits.push(bitAt(number, i));
   }
   return bits;
};

// returns the next 2-byte number
let getNumberFromBits = function(bytes, history, hash) {
    let num = 0, pos = 0;
    while (pos < 16) {
        let loc = getNextLocation(history, hash, bytes.length);
        let bit = bitAt(bytes[loc], 0);
        num = setBit(num, pos, bit);
        pos++;
    }
    return num;
};

// returns an array of 1s and 0s for the string 'message'
let getMessageBits = function(message) {
    let messageBits = [];
    for (let i = 0; i < message.length; i++) {
        let code = message.charCodeAt(i);
        messageBits = messageBits.concat(getBitsFromNumber(code));
    }
    return messageBits;
};

// gets the next location to store a bit
let getNextLocation = function(history, hash, total) {
    let pos = history.length;
    let location = Math.abs(hash[pos % hash.length] * (pos + 1)) % total;
    while (true) {
        if (location >= total) {
            location = 0;
        } else if (history.indexOf(location) >= 0) {
            location++;
        } else if ((location + 1) % 4 === 0) {
            location++;
        } else {
            history.push(location);
            return location;
        }
    }
};

// encodes the supplied 'message' into the CanvasPixelArray 'colors'
let encodeMessage = function(colors, hash, message) {
    // make an array of bits from the message
    let messageBits = getBitsFromNumber(message.length);
    messageBits = messageBits.concat(getMessageBits(message));

    // this will store the color values we've already modified
    let history = [];

    // encode the bits into the pixels
    let pos = 0;
    while (pos < messageBits.length) {
        // set the next color value to the next bit
        let loc = getNextLocation(history, hash, colors.length);
        colors[loc] = setBit(colors[loc], 0, messageBits[pos]);

        while ((loc + 1) % 4 !== 0) {
            loc++;
        }
        colors[loc] = 255;

        pos++;
    }
};

// returns the message encoded in the CanvasPixelArray 'colors'
let decodeMessage = function(colors, hash) {
    // this will store the color values we've already read from
    let history = [];

    // get the message size
    let messageSize = getNumberFromBits(colors, history, hash);

    // exit early if the message is too big for the image
    if ((messageSize + 1) * 16 > colors.length * 0.75) {
        return '';
    }

    // exit early if the message is above an artificial limit
    if (messageSize === 0 || messageSize > maxMessageSize) {
        return '';
    }

    // put each character into an array
    let message = [];
    for (let i = 0; i < messageSize; i++) {
        let code = getNumberFromBits(colors, history, hash);
        message.push(String.fromCharCode(code));
    }

    return message.join('');
};
