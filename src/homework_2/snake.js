let canvas = document.getElementById("snake-canvas");
let context = canvas.getContext("2d");

toggle = createToggle(document.getElementById("start-stop"));
move = createSnakeMovement(context);
function createToggle(buttonelement) {
    let running = false;
    return function () {
        if (running) {
            running = false;
            buttonelement.innerHTML = "Start";
            alert("stopped");
        }
        else {
            for (let i = 0; i < 50; i++) {
                move("");
            }
            running = true;
            buttonelement.innerHTML = "Stop";
            alert("started");
        }
    }
}

function createSnakeMovement(ctx) {
    let dirs = [(1, 0), (0, 1), (-1, 0), (0, -1)];
    let curdir = 0;
    let xinc = 0;
    let yinc = 0;
    let x = 10;
    let y = 10;
    ctx.fillStyle = "#FF0000";
    return function (direction) {
        switch (direction.toUpperCase()) {
            case "LEFT":
                if (curdir == 3) {
                    curdir = 0;
                }
                else {
                    curdir++;
                }
                break;
            case "RIGHT":
                if (curdir == 0) {
                    curdir = 3;
                }
                else {
                    curdir--;
                }
                break;
        }
        xinc, yinc = dirs[curdir];
        ctx.fillRect(x += xinc, y += yinc, 5, 5);
    }
}