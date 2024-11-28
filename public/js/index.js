const buttons = {
    btn_openfile: document.getElementById("btn-openfile"),
    btn_openfile_footer: document.getElementById("btn-openfile-footer"),
    btn_page_prev: document.getElementById("btn-page-prev"),
    btn_page_next: document.getElementById("btn-page-next"),
    btn_select_zone: document.getElementById("btn-select-zone"),
}
const inputFile = document.getElementById("current-file")

// console.log(buttons);

buttons.btn_openfile.onclick = openDoc;
buttons.btn_openfile_footer.onclick = openDoc;
inputFile.onchange = loadFile;

function openDoc() { inputFile.click() }

function loadFile(input) {
    console.log("Input file: ", input.target.files[0]);
}
