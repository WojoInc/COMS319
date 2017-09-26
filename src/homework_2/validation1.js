function validate() {
    let name = document.forms["mainform"]["firstname"].value();
    let image = getStatusImage(nameFieldCheck(name), "firstname")
    document.getElementById["firstname"].appendChild(image);

}

function getStatusImage(valid, element) {
    let statusImage = document.getElementById(element + "-status");
    if (statusImage === null) {
        statusImage = new Image(15, 15);
        statusImage.id = element + "-status"
    }
    statusImage.src = valid ? 'correct.png' : 'wrong.png';
    return statusImage;
}

function nameFieldCheck(name) {
    if (name !== null) {
        return true;

    }
}