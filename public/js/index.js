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

const partials = {
    header: document.querySelector(".header")
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
    reduceHeader();
    const file = await input.target.files[0].arrayBuffer();
    console.log("File : ", file);

    const loadingtask = pdfjsLib.getDocument(file);
    await loadingtask.promise.then(getDocument);
    console.log("Current document : ", current_document);

    await renderDocument(current_document);
}

async function renderDocument(doc) {
    setViewerAttribute("title", doc.metadata.info.Title);
    setViewerAttribute("pagecount", doc.pagecount);
    setViewerAttribute("currentpage", doc.currentpage);
    await renderPage(await doc.file.getPage(doc.currentpage));
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
async function renderPage(page) {
    console.log("Rendering page...")
    const canvas = pdf_viewer;
    const canvasContext = canvas.getContext("2d");
    const viewport = await page.getViewport({ scale: 1 });
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const rendercontext = { canvasContext, viewport };
    await page.render(rendercontext);
    console.log("Page rendered succesfully!")

    canvas.dispatchEvent(new Event("custom:resize"));
}

function updateCurrentDocument() {
    renderDocument(current_document);
}

async function getDocument(doc) {

    current_document = {
        file: doc,
        pagecount: doc.numPages,
        currentpage: 1,
        metadata: await doc.getMetadata()
    }
}

// ANIMATION

function toogleSelection(e) {
    let ToogleSelectionEvent = function (active) { return new CustomEvent("custom:toogleselection", { detail: { active } }) };
    const classname = "active";
    if (!e.target.classList.contains(classname)) {
        e.target.classList.add(classname);
        e.target.dispatchEvent(ToogleSelectionEvent(true));
    } else {
        e.target.classList.remove(classname);
        e.target.dispatchEvent(ToogleSelectionEvent(false));
    }

}
function nextPage() {
    if (!current_document) return
    if (current_document.currentpage + 1 > current_document.pagecount)
        throw new RangeError("Page out of range");

    ++current_document.currentpage;
    renderDocument(current_document)
}
function previousPage() {
    if (!current_document) return
    if (current_document.currentpage - 1 <= 0) throw new RangeError("Page out of range");

    --current_document.currentpage;
    renderDocument(current_document);
}

function reduceHeader(reduce = true) {
    if (!reduce) {
        partials.header.classList.remove("small");
        sections.loadfile.classList.add("visible");
        sections.viewer.classList.remove("visible");
    } else {
        partials.header.classList.add("small");
        sections.loadfile.classList.remove("visible");
        sections.viewer.classList.add("visible");
    }
}