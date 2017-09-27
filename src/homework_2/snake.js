let canvas = document.getElementById("snake-canvas");
let context = canvas.getContext("2d");

move = createSnakeMovement(context);
toggle = createToggle(document.getElementById("start-stop"));


function createToggle(buttonelement) {
    let running = false;
    let timer;
    let validPosition = true;
    return function () {
        if (!validPosition) {
            //reload page
            location.reload();
            return;
        }
        if (running) {
            running = false;
            clearInterval(timer);
            timer = null;
            buttonelement.innerHTML = "Start";
        }
        else {
            if (timer == null) {
                timer = setInterval(function () {
                    validPosition = move("");
                    if (!validPosition) {
                        running = false;
                        clearInterval(timer);
                        timer = null;
                        buttonelement.innerHTML = "Reset"
                    }
                }, 250);
            }
            running = true;
            buttonelement.innerHTML = "Stop";
        }
    }
}

function createSnakeMovement(ctx) {
    let xdir = [1, 0, -1, 0];
    let ydir = [0, 1, 0, -1];
    let curdir = 0;
    let xinc = 0;
    let yinc = 0;
    let x = 10;
    let y = 10;
    ctx.fillStyle = "red";
    return function (direction) {
        switch (direction.toUpperCase()) {
            case "RIGHT":
                if (curdir == 3) {
                    curdir = 0;
                }
                else {
                    curdir++;
                }
                break;
            case "LEFT":
                if (curdir == 0) {
                    curdir = 3;
                }
                else {
                    curdir--;
                }
                break;
        }
        xinc = xdir[curdir];
        yinc = ydir[curdir];
        ctx.fillRect(x += xinc, y += yinc, 1, 1);
        //return false if border hit, else return true
        //values hardcoded for now, could change to get the value from the window instead later
        return (0 < x) && (x < 600) && (0 < y) && (y < 400);
    }
}