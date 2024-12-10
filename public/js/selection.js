const viewer = document.getElementById("pdf-viewer");
const canvas = document.getElementById("pdf-viewer-overlay");
const btn_select_zone = document.getElementById("btn-select-zone");
const ctx = canvas.getContext("2d")

console.log("Outil de selection : ", btn_select_zone);

var isdrawing = false;
var coordinates = {
    start: { x: 0, y: 0 },
    end: { x: 0, y: 0 }
}

viewer.addEventListener("custom:resize", function (e) {
    console.log("Resizing overlay...");

    canvas.width = e.target.width
    canvas.height = e.target.height
})

btn_select_zone.addEventListener("custom:toogleselection", toogleCanvasVisibility)


canvas.onmousedown = function (e) {
    if (!isSelectionActive()) return;
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
    ctx.setLineDash([5]);
    ctx.strokeStyle = "#1a1a1a";
    ctx.fillStyle = "#1a1a1a22";

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
    ctx.fill();
}

function toogleCanvasVisibility(e) {
    console.log("Toogling canvas visibility...: ", e.detail.active);

    let classname = "active";
    if (e.detail.active) canvas.classList.add(classname);
    else canvas.classList.remove(classname);
}

function isSelectionActive() {
    console.log("Checking if selection is active... ");
    return btn_select_zone.classList.contains("active") ? true : false;
}