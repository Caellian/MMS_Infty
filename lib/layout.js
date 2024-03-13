// main ima auto margine na stranama, i za content koji treba izlaziti iz
// margine je korisno imati mjeru tih margina.

let main = document.querySelector("main");
if (main) {
    // za praćenje promjene u veličini koristim ne standardan
    // ResizeObserver, no podržan je u svim browserima osim IE
    let mainResizeWatch = new ResizeObserver((entries) => {
        let mainW = main.getBoundingClientRect().width;
        main.style = `--main-margin: ${(window.innerWidth - mainW) / 2}px`;
    })
    mainResizeWatch.observe(document.querySelector("body"));
    main.style = `--main-margin: ${(window.innerWidth - main.getBoundingClientRect().width) / 2}px`;
}

// Kod za navbar

let navBar = document.querySelector("nav");

let navLinks = navBar.getElementsByClassName("links")[0];
let menuButton = navBar.querySelector("button.menu");

menuButton.addEventListener("click", () => {
    if (navLinks.classList.contains("show")) {
        navLinks.classList.remove("show");
        menuButton.classList.remove("active");
    } else {
        navLinks.classList.add("show");
        menuButton.classList.add("active");
    }
});

function updateSubmenuOffset(submenu) {
    let parent = submenu.dataset.for;
    parent = Array.from(navLinks.querySelectorAll(`a[data-name]`)).filter(it => {
        return it.dataset.name == parent
    })[0];
    if (parent == null) {
        return
    }

    // populate submenu data
    let parentRect = parent.getBoundingClientRect();
    let parentOffset = parentRect.x + parentRect.width / 2;
    submenu.setAttribute("style", "--offset:" + parentOffset + "px;");
}

const [NavData, Submenus] = (() => {
    let result = Object.fromEntries(Array.from(navLinks.children).filter(it => {
        return it.tagName === "A" && it.dataset.name != null
    }).map(it => {
        return [it.dataset.name, {element: it}]
    }));

    let submenus = Array.from(navLinks.children).filter(it => {
        return it.dataset.for != null
    });

    for (const sub of submenus) {
        let parent = result[sub.dataset.for];
        parent.submenu = sub;

        updateSubmenuOffset(sub);
    }

    console.debug("Nav data:", result);
    return [result, submenus];
})();

let navResizeTracker = new ResizeObserver(() => {
    for (const sub of Submenus) {
        updateSubmenuOffset(sub);
    }
});
navResizeTracker.observe(navBar);

let currentSection = null;

function updateSectionDisplay() {
    for (const menu of Submenus) {
        menu.classList.remove("show")
    }
    if (currentSection != null) {
        NavData[currentSection].submenu.classList.add("show");
    }
}
function activateSection(section) {
    if (currentSection == section) {
        return
    }
    currentSection = section;
    updateSectionDisplay();
}
function closeSections() {
    currentSection = null;
    updateSectionDisplay();
}

navLinks.addEventListener("mousemove", (e) => {
    let section = e.target
    if (section.dataset.name == null) {
        return
    }
    if (currentSection == section) {
        return
    }
    activateSection(section.dataset.name);
});


navBar.addEventListener("mouseleave", (e) => {
    closeSections();
});