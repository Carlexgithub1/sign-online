// import * as PDFLib from "./vendor/pdf-lib";
console.log(pdfjsLib)

const sections = {
    loadfile: document.querySelector(".section.loadfile"),
    viewer: document.querySelector(".section.viewer")
}
const buttons = {
    btn_loadfile: document.getElementById("btn-loadfile"),
    btn_loadfile_header: document.getElementById("btn-loadfile-header"),
    btn_loadfile_footer: document.getElementById("btn-loadfile-footer"),
    btn_page_prev: document.getElementById("btn-page-prev"),
    btn_page_next: document.getElementById("btn-page-next"),
    btn_select_zone: document.getElementById("btn-select-zone"),
}

const file_input = document.getElementById("file-input");
const pdf_viewer = document.getElementById("pdf-viewer");
// console.log(buttons);

var current_document = undefined;

// Buttons actions
buttons.btn_loadfile.onclick = loadFile;
buttons.btn_loadfile_footer.onclick = loadFile;
buttons.btn_loadfile_header.onclick = loadFile;

buttons.btn_page_next.onclick = nextPage;
buttons.btn_page_prev.onclick = previousPage;

buttons.btn_select_zone.onclick = toogleSelection;
const btn_select_zone_ico = buttons.btn_select_zone.getElementsByTagName("i")[0];
btn_select_zone_ico.onclick = () => { buttons.btn_select_zone.click() };

file_input.onchange = loadPDF;

function loadFile() { file_input.click() }

async function loadPDF(input) {
    const file = await input.target.files[0].arrayBuffer();
    const doc = await PDFLib.PDFDocument.load(file);
    current_document = getDocument(doc);
    console.log(current_document);

    await renderDocument(current_document);
}

async function renderDocument(doc) {
    setViewerAttribute("title", doc.title);
    setViewerAttribute("pagecount", doc.pagecount);
    setViewerAttribute("currentpage", doc.currentpage + 1);
    await loadPage(doc.pages[doc.currentpage]);
}

function setViewerAttribute(attr, value) {
    let attributes_ids = {
        title: "viewer-title",
        pagecount: "viewer-pagecount",
        currentpage: "viewer-currentpage"
    }

    let container = document.getElementById(attributes_ids[attr]);
    container.innerText = value;
}
async function loadPage(page) {
    // const context = pdf_viewer.getContext("2d");
    // const viewport = page.getSize();

    // pdf_viewer.width = viewport.width;
    // pdf_viewer.height = viewport.height;

    const pdf_page_datauri = await page.saveAsBase64({ dataUri: true });
    pdf_viewer.src = pdf_page_datauri
    // console.log("Loading page: ", page);
}

function updateCurrentDocument() {
    renderDocument(current_document);
}

function getDocument(doc) {
    return {
        file: doc,
        pagecount: doc.getPageCount(),
        currentpage: 0
    }
}

// ANIMATION

function toogleSelection(e) {
    const classname = "active";
    if (!e.target.classList.contains(classname)) {
        e.target.classList.add(classname);
        // console.log("Selection active");
    } else {
        e.target.classList.remove(classname);
        // console.log("Selection inactive");
    }
}
function nextPage() {
    if (!current_document) return
    if (current_document.currentpage + 1 >= current_document.pagecount)
        throw new RangeError("Page out of range");

    ++current_document.currentpage;
    renderDocument(current_document)
}
function previousPage() {
    if (!current_document) return
    if (current_document.currentpage - 1 < 0) throw new RangeError("Page out of range");

    --current_document.currentpage;
    renderDocument(current_document);
}
