const baseClueBotUrl = `https://aoti-basic-express-app.herokuapp.com/clueBot`;
const currentCollection = `/current`;
const statsCollection = `/stats`;

function loadMysteries() {
    loadCurrentMystery();
    loadSolvedMysteries();
    loadStats();
}

async function loadCurrentMystery() {
    const currentResponse = await fetch(baseClueBotUrl + currentCollection);
    const responseText = await currentResponse.text();
    if (responseText) {
        const currentMystery = await currentResponse.json();
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
    document.getElementById("mystery-stats").innerHTML = "<p>Loading...</p>";
    document.getElementById("mystery-stats").innerHTML = buildStatsContent(stats);
}

function displayCurrentMystery(mystery) {
    document.getElementById("solved-mysteries").innerHTML = "<p>Loading...</p>";
    document.getElementById("current-mystery").innerHTML = buildMysteryContent(mystery);
}

function displayNoCurrentMystery() {
    document.getElementById("current-mystery").innerHTML = "<p>No current mystery</p>";
}

function displayNoSolvedMysteries() {
    document.getElementById("solved-mysteries").innerHTML = "<p>No solved mysteries</p>";
}

function displaySolvedMysteries(mysteries) {
    document.getElementById("solved-mysteries").innerHTML = "<p>Loading...</p>";
    document.getElementById("solved-mysteries").innerHTML = buildMysteryContentForMultiple(mysteries);
}

function buildStatsContent(stats) {
    const mysteryCountStats = `<p>${stats.solvedMysteryCount} mysteries solved</p>`;
    const availableSuspects = `<p>${stats.suspectCount} suspects available</p>`;
    const availableScenes = `<p>${stats.sceneCount} scenes available</p>`;
    const weaponsAvailable = `<p>${stats.weaponCount} weapons available</p>`;
    const murderWeaponOccurrences = "<h4>Murder Weapon Occurrences</h4>" + buildOccurrencesContent(stats.murderWeaponOccurrences);
    const crimeSceneOccurrences = "<h4>Crime Scene Occurrences</h4>" + buildOccurrencesContent(stats.crimeSceneOccurrences);
    const culpritOccurrences = "<h4>Culprit Occurrences</h4>" + buildOccurrencesContent(stats.culpritOccurrences);
    const victimOccurrences = "<h4>Victim Occurrences</h4>" + buildOccurrencesContent(stats.victimOccurrences);
    return mysteryCountStats + availableSuspects + availableScenes + weaponsAvailable + murderWeaponOccurrences + crimeSceneOccurrences + culpritOccurrences + victimOccurrences;
}

function buildOccurrencesContent(occurrences) {
    let occurrencesList = `<ul>`;
    occurrences.forEach((occurrence) => {
        occurrencesList += `<li>${occurrence.name} (${occurrence.count})</li>`;
    });
    return occurrencesList + `</ul>`;
}

function buildMysteryContentForMultiple(mysteries) {
    let mysteryContent = "";
    mysteries.forEach((mystery) => {
        const mysteryContentWithBreak = buildMysteryContent(mystery) + "<hr>";
        mysteryContent += mysteryContentWithBreak;
    });
    return mysteryContent;
}

function buildMysteryContent(mystery) {
    if (mystery) {
        const announcementsContent = buildAnnouncementsContent(mystery);
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
            <p>The Mystery has been solved!</p>
            <p>${mystery.victim} was killed by ${mystery.culprit} in the ${mystery.scene} with the ${mystery.weapon}.</p>
`;
    } else {
        return `
            <p>The Mystery has not yet been solved.</p>
            <p>${mystery.victim} was killed by ??? in the ??? with the ???.</p>
`
    }
}

function buildDateContent(mystery) {
    const d = new Date(mystery.dateStarted)
    const ye = new Intl.DateTimeFormat('en', {year: 'numeric'}).format(d)
    const mo = new Intl.DateTimeFormat('en', {month: 'long'}).format(d)
    const da = new Intl.DateTimeFormat('en', {day: '2-digit'}).format(d)

    return `<p>Murder Occurred on ${mo} ${da}, ${ye}</p>`;
}

function buildAnnouncementsContent(mystery) {
    let announcementsContent = "<h4>Announcements</h4><ul>";
    mystery.announcements.forEach((announcement) => {
        announcementsContent += `<li>${announcement}</li>`;
    });
    return announcementsContent + "</ul>";
}
