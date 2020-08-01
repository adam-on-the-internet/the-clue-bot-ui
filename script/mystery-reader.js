const baseClueBotUrl = `https://aoti-basic-express-app.herokuapp.com/clueBot`;
const currentCollection = `/current`;
const statsCollection = `/stats`;
const currentAccordionClass = "current-accordion";
const solvedAccordionClass = "solved-accordion";
const occurrenceAccordion = "occurrence-accordion";
const weaponSvg = "weapon";
const victimSvg = "victim";
const sceneSvg = "scene";
const culpritSvg = "culprit";

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
    setupGraphs(stats);
}

function displayCurrentMystery(mystery) {
    console.log(mystery);
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

function setupGraphs(stats) {
    setupAccordions(occurrenceAccordion);
    setupClueOccurrenceGraph(culpritSvg, stats.culpritOccurrences, "Top Culprit Occurrences");
    setupClueOccurrenceGraph(victimSvg, stats.victimOccurrences, "Top Victim Occurrences");
    setupClueOccurrenceGraph(weaponSvg, stats.murderWeaponOccurrences, "Top Murder Weapon Occurrences");
    setupClueOccurrenceGraph(sceneSvg, stats.crimeSceneOccurrences, "Top Crime Scene Occurrences");
}

function setupClueOccurrenceGraph(svgId, originalData, graphTitle) {
    const yTitle = "# of Times Occurred";
    const xTitle = capitalizeFirstLetter(svgId);
    const data = [];
    originalData.forEach((obj, index) => {
        if (index < 5) {
            const newData = {
                item: obj.name,
                value: obj.count,
            };
            data.push(newData);
        }
    })
    setupGenericGraph(svgId, data, graphTitle, xTitle, yTitle);
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function buildStatsContent(stats) {
    const mysteryCountStats = `<p>${stats.solvedMysteryCount} mysteries solved</p>`;
    const availableSuspects = `<p>${stats.suspectCount} suspects available</p>`;
    const availableScenes = `<p>${stats.sceneCount} scenes available</p>`;
    const weaponsAvailable = `<p>${stats.weaponCount} weapons available</p>`;
    const murderWeaponOccurrences = buildOccurrencesContent(stats.murderWeaponOccurrences, weaponSvg);
    const crimeSceneOccurrences = buildOccurrencesContent(stats.crimeSceneOccurrences, sceneSvg);
    const culpritOccurrences = buildOccurrencesContent(stats.culpritOccurrences, culpritSvg);
    const victimOccurrences = buildOccurrencesContent(stats.victimOccurrences, victimSvg);
    const basicStats = mysteryCountStats + availableSuspects + availableScenes + weaponsAvailable;
    const advancedStats = murderWeaponOccurrences + crimeSceneOccurrences + culpritOccurrences + victimOccurrences;
    return `
    ${basicStats}
    <button class="accordion ${occurrenceAccordion}">Advanced Statistics</button>
    <div class="panel">
            ${advancedStats}    
    </div>
    `;
}

function buildOccurrencesContent(occurrences, title) {
    const svgForOccurrences = `<svg id="${title}" width="800" height="500"></svg>`;
    let occurrencesList = `<ol>`;
    occurrences.forEach((occurrence, index) => {
        if (index <= 4) {
            occurrencesList += `<li>${occurrence.name} (${occurrence.count})</li>`;
        }
    });
    return `${svgForOccurrences}${occurrencesList}</ol>`;
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
        const clueTrackerContent = buildClueTracker(mystery, accordionClass);
        const statusContent = buildStatusContent(mystery);
        const dateContent = buildDateContent(mystery);
        return `
    <h3>
      ${mystery.title}
    </h3>
    ${dateContent}
    ${statusContent}
    ${announcementsContent}
    ${clueTrackerContent}
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
    return `
    <button class="accordion ${accordionClass}">Announcements</button>
    <div class="panel">
        <ul>
            ${announcementsListItems}    
        </ul>
    </div>
    `;
}

function buildClueTracker(mystery, accordionClass) {
    let tableContent = "";
    if (mystery.culpritOptions !== undefined) {
        const suspectTable = buildClueTable("Suspect", mystery.culpritOptions, mystery.announcements);
        tableContent += suspectTable;
    }
    if (mystery.weaponOptions !== undefined) {
        const weaponTable = buildClueTable("Weapon", mystery.weaponOptions, mystery.announcements);
        tableContent += weaponTable;
    }
    if (mystery.sceneOptions !== undefined) {
        const sceneTable = buildClueTable("Scene", mystery.sceneOptions, mystery.announcements);
        tableContent += sceneTable;
    }
    if (tableContent !== "") {
        return `
    <br>
    <button class="accordion ${accordionClass}">Clue Tracker</button>
    <div class="panel">
        ${tableContent}
    </div>
    `;
    } else {
        return "";
    }
}

function buildClueTable(tableName, choices, announcements) {
    let choiceRows = ``;
    choices.forEach((choice) => {
        const row = buildClueRow(choice, announcements);
        choiceRows += row;
    });
    return `
<h3>${tableName} Clue Tracker</h3>
    <table>
  <tr>
    <th>${tableName}</th>
    <th>Solution?</th>
    <th>Clue</th>
  </tr>
  ${choiceRows}
</table>
    `;
}

function buildClueRow(item, announcements) {
    const relevantClue = announcements.find((clue) => {
        return clue.includes("Clue #") && clue.includes(item);
    });
    const clueRevealed = relevantClue !== undefined;
    const itemSymbol = clueRevealed ? "X" : "";
    const itemClue = clueRevealed ? relevantClue : "";
    return `
      <tr>
    <td>${item}</td>
    <td>${itemSymbol}</td>
    <td>${itemClue}</td>
  </tr>
    `;
}
