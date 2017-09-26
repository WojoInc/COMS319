
function validate() {
    let first = document.getElementById("firstname").value;
    let last = document.getElementById("lastname").value;
    let gender = document.getElementById("gender").value;
    let state = document.getElementById("state").value;

    document.getElementById("status-first").appendChild(getStatusImage(nameFieldCheck(first), "firstname"));
    document.getElementById("status-last").appendChild(getStatusImage(nameFieldCheck(last), "lastname"));
    document.getElementById("status-gender").appendChild(getStatusImage(dropdownCheck(gender), "gender"));
    document.getElementById("status-state").appendChild(getStatusImage(dropdownCheck(state), "state"));

    //add state to local storage
    if (dropdownCheck(state)) {
        localStorage.setItem("state", state);
    }
    //semantic for older browsers that dont support html5 'required' property.
    //completely pointless otherwise.
    return nameFieldCheck(first) && nameFieldCheck(last) && dropdownCheck(gender) && dropdownCheck(state);
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

function nameFieldCheck(name) {
    return isAlphaNumeric(name);
}

function dropdownCheck(value) {
    return !(value == "")
}

function isAlphaNumeric(entry) {
    let regex = /^[a-z0-9]+$/i;
    if (entry != null && entry.match(regex)) {
        return true;
    }
    return false;
}