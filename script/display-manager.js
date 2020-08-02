function displayStats(stats) {
    const statsContent = buildStatsContent(stats);
    document.getElementById("mystery-stats").innerHTML = statsContent;
    setupAccordionClass("occurrences");
    setupGraphs(stats);
}

function displayNoCurrentMystery() {
    document.getElementById("current-mystery").innerHTML = "<p>No current mystery</p>";
}

function displayNoSolvedMysteries() {
    document.getElementById("solved-mysteries").innerHTML = "<p>No solved mysteries</p>";
}

function displayCurrentMystery(mystery) {
    const mysteryContent = buildMysteryContent(mystery);
    document.getElementById("current-mystery").innerHTML = mysteryContent;
    setupAccordionsForMysteries([mystery]);
}

function displaySolvedMysteries(mysteries) {
    const mysteryContentForMultiple = buildMysteryContentForMultiple(mysteries);
    document.getElementById("solved-mysteries").innerHTML = mysteryContentForMultiple;
    setupAccordionsForMysteries(mysteries);
}
