const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d")

ctx.rect(0, 0, canvas.width, canvas.height)

var isdrawing = false;
var coordinates = {
    start: { x: 0, y: 0 },
    end: { x: 0, y: 0 }
}

canvas.onmousedown = function (e) {
    coordinates.start.x = e.offsetX;
    coordinates.start.y = e.offsetY;
    isdrawing = true;
}

canvas.onmousemove = function (e) {
    if (isdrawing) {
        coordinates.end.x = e.offsetX;
        coordinates.end.y = e.offsetY;
        drawRect(coordinates);
    }
}

canvas.onmouseup = function (e) {
    isdrawing = false;

}

function drawRect(coordinates) {
    ctx.lineWidth = 2;
    ctx.setLineDash([0.5, 0.5, 0.5]);
    ctx.strokeStyle = "#ffffff";

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.roundRect(
        coordinates.start.x,
        coordinates.start.y,
        coordinates.end.x - coordinates.start.x,
        coordinates.end.y - coordinates.start.y,
        8
    )
    ctx.stroke();
}