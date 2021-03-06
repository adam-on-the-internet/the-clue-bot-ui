function setupAccordionClasses(classnames) {
    classnames.forEach((classname) => {
       setupAccordionClass(classname);
    });
}

function setupAccordionClass(classname) {
    const acc = document.getElementsByClassName(classname);
    let i;

    for (i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function() {
            this.classList.toggle("active");
            let panel = this.nextElementSibling;
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
            } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
            }
        });
    }
}
