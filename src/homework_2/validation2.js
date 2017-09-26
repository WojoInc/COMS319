function validate() {
    let email = document.getElementById("email").value;
    let phone = document.getElementById("phone").value;
    let address = document.getElementById("address").value;

    emailCheck = validateNotNull(/[a-zA-Z0-9]+[@]+[a-zA-Z0-9]+[.][a-zA-Z0-9]+/i);
    addressCheck = validateNotNull(/[a-zA-z']+[,][ ]?[a-zA-Z]+/i);

    document.getElementById("status-email").appendChild(getStatusImage(emailCheck(email), "email"));
    document.getElementById("status-phone").appendChild(getStatusImage(phoneCheck(phone), "phone"));
    document.getElementById("status-address").appendChild(getStatusImage(addressCheck(address), "address"));

    //add address to local storage
    if (addressCheck(address)) {
        localStorage.setItem("address", address);
    }
    //this is largely for older browsers that dont support html5 'required' property.
    //completely pointless otherwise.
    return emailCheck(email) && phoneCheck(phone) && addressCheck(address);
}

function getStatusImage(valid, element) {
    let statusImage = document.getElementById(element + "-status-image");
    if (statusImage === null) {
        statusImage = new Image(15, 15);
        statusImage.id = element + "-status-image"
    }
    statusImage.src = valid ? 'correct.png' : 'wrong.png';
    return statusImage;
}

function phoneCheck(value) {
    let regex = /\b\d{3}[-]\d{3}[-]\d{4}\b/i;
    let regex2 = /\b\d{10}\b/;
    if (value != null) {
        return !!(value.match(regex) || value.match(regex2));

    }
    return true;
}

function validateNotNull(regex) {
    return function (value) {
        return !!(value != null && value.match(regex));

    }
}

/*
 function emailCheck(value) {
 let regex = /[a-zA-Z0-9]+[@]+[a-zA-Z0-9]+[.][a-zA-Z0-9]+/i;
 return value!=null && value.match(regex);
 }

 function addressCheck(value) {
 let regex = /[a-zA-Z]+[,]+[a-zA-Z]/i;
 return value!=null && value.match(regex);
 }*/
