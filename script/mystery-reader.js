const baseClueBotUrl = `https://aoti-basic-express-app.herokuapp.com/clueBot`;
const currentCollection = `/current`;
const statsCollection = `/stats`;
const currentAccordionClass = "current-accordion";
const solvedAccordionClass = "solved-accordion";

function loadMysteries() {
    loadCurrentMystery();
    loadSolvedMysteries();
    loadStats();
}

async function loadCurrentMystery() {
    const currentResponse = await fetch(baseClueBotUrl + currentCollection);
    const responseText = await currentResponse.text();
    if (responseText) {
        const currentMystery = await JSON.parse(responseText);
        displayCurrentMystery(currentMystery);
    } else {
        displayNoCurrentMystery();
    }
}

async function loadStats() {
    const statsResponse = await fetch(baseClueBotUrl + statsCollection);
    const stats = await statsResponse.json();
    displayStats(stats);
}

async function loadSolvedMysteries() {
    const solvedResponse = await fetch(baseClueBotUrl);
    const solvedMysteries = await solvedResponse.json();
    if (solvedMysteries.length > 0) {
        displaySolvedMysteries(solvedMysteries);
    } else {
        displayNoSolvedMysteries();
    }
}

function displayStats(stats) {
    document.getElementById("mystery-stats").innerHTML = buildStatsContent(stats);
}

function displayCurrentMystery(mystery) {
    document.getElementById("current-mystery").innerHTML = buildMysteryContent(mystery, currentAccordionClass);
    setupAccordions(currentAccordionClass);
}

function displayNoCurrentMystery() {
    document.getElementById("current-mystery").innerHTML = "<p>No current mystery</p>";
}

function displayNoSolvedMysteries() {
    document.getElementById("solved-mysteries").innerHTML = "<p>No solved mysteries</p>";
}

function displaySolvedMysteries(mysteries) {
    document.getElementById("solved-mysteries").innerHTML = buildMysteryContentForMultiple(mysteries);
    setupAccordions(solvedAccordionClass);
}

function buildStatsContent(stats) {
    const mysteryCountStats = `<p>${stats.solvedMysteryCount} mysteries solved</p>`;
    const availableSuspects = `<p>${stats.suspectCount} suspects available</p>`;
    const availableScenes = `<p>${stats.sceneCount} scenes available</p>`;
    const weaponsAvailable = `<p>${stats.weaponCount} weapons available</p>`;
    const murderWeaponOccurrences = "<h4>Top Murder Weapon Occurrences</h4>" + buildOccurrencesContent(stats.murderWeaponOccurrences);
    const crimeSceneOccurrences = "<h4>Top Crime Scene Occurrences</h4>" + buildOccurrencesContent(stats.crimeSceneOccurrences);
    const culpritOccurrences = "<h4>Top Culprit Occurrences</h4>" + buildOccurrencesContent(stats.culpritOccurrences);
    const victimOccurrences = "<h4>Top Victim Occurrences</h4>" + buildOccurrencesContent(stats.victimOccurrences);
    return mysteryCountStats + availableSuspects + availableScenes + weaponsAvailable + murderWeaponOccurrences + crimeSceneOccurrences + culpritOccurrences + victimOccurrences;
}

function buildOccurrencesContent(occurrences) {
    let occurrencesList = `<ol>`;
    occurrences.forEach((occurrence, index) => {
        if (index <= 4) {
            occurrencesList += `<li>${occurrence.name} (${occurrence.count})</li>`;
        }
    });
    return occurrencesList + `</ol>`;
}

function buildMysteryContentForMultiple(mysteries) {
    let mysteryContent = "";
    mysteries.forEach((mystery) => {
        const mysteryContentWithBreak = buildMysteryContent(mystery, solvedAccordionClass) + "<hr>";
        mysteryContent += mysteryContentWithBreak;
    });
    return mysteryContent;
}

function buildMysteryContent(mystery, accordionClass) {
    if (mystery) {
        const announcementsContent = buildAnnouncementsContent(mystery, accordionClass);
        const statusContent = buildStatusContent(mystery);
        const dateContent = buildDateContent(mystery);
        return `
    <h3>
      ${mystery.title}
    </h3>
    ${dateContent}
    ${statusContent}
    ${announcementsContent}
  `;
    } else {
        return ``;
    }
}

function buildStatusContent(mystery) {
    if (mystery.solved) {
        return `
            <p>This mystery has been solved!</p>
            <p>${mystery.victim} was killed by ${mystery.culprit} in the ${mystery.scene} with the ${mystery.weapon}.</p>
`;
    } else {
        return `
            <p>This mystery has not yet been solved.</p>
`
    }
}

function buildDateContent(mystery) {
    const d = new Date(mystery.dateStarted)
    const ye = new Intl.DateTimeFormat('en', {year: 'numeric'}).format(d)
    const mo = new Intl.DateTimeFormat('en', {month: 'long'}).format(d)
    const da = new Intl.DateTimeFormat('en', {day: '2-digit'}).format(d)

    return `<p>Mystery started on ${mo} ${da}, ${ye}</p>`;
}

function buildAnnouncementsContent(mystery, accordionClass) {
    let announcementsListItems = "";
    mystery.announcements.forEach((announcement) => {
        announcementsListItems += `<li>${announcement}</li>`;
    });
    const announcementsAccordion = `
    <button class="accordion ${accordionClass}">Announcements</button>
    <div class="panel">
        <ul>
            ${announcementsListItems}    
        </ul>
    </div>
    `;
    return announcementsAccordion;
}
