const weaponSvg = "weapon";
const victimSvg = "victim";
const sceneSvg = "scene";
const culpritSvg = "culprit";

// UTILS

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function buildMysteryAccordionClass(mystery) {
    return `mystery-accordion-${mystery._id}`;
}

// MYSTERY BASE

function buildMysteryContent(mystery) {
    if (mystery) {
        const announcementsContent = buildMysteryAnnouncements(mystery);
        const clueTrackerContent = buildClueTrackerContent(mystery);
        const statusContent = buildStatusContent(mystery);
        const dateContent = buildMysteryDate(mystery);
        return `
    <div id="mystery-${mystery._id}">
        <h3>
          ${mystery.title}
        </h3>
        ${dateContent}
        ${statusContent}
        ${announcementsContent}
        ${clueTrackerContent}
    </div>
  `;
    } else {
        return ``;
    }
}

function buildMysteryContentForMultiple(mysteries) {
    let mysteryContent = "";
    mysteries.forEach((mystery) => {
        const mysteryContentWithBreak = buildMysteryContent(mystery) + "<hr>";
        mysteryContent += mysteryContentWithBreak;
    });
    return mysteryContent;
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

function buildMysteryDate(mystery) {
    const d = new Date(mystery.dateStarted)
    const ye = new Intl.DateTimeFormat('en', {year: 'numeric'}).format(d)
    const mo = new Intl.DateTimeFormat('en', {month: 'long'}).format(d)
    const da = new Intl.DateTimeFormat('en', {day: '2-digit'}).format(d)

    return `<p>Mystery started on ${mo} ${da}, ${ye}</p>`;
}

function buildMysteryAnnouncements(mystery) {
    let announcementsListItems = "";
    mystery.announcements.forEach((announcement) => {
        const announcementItem = `<li>${announcement}</li>`;
        announcementsListItems += announcementItem;
    });
    return `
    <button class="accordion ${buildMysteryAccordionClass(mystery)}">Announcements</button>
    <div class="panel">
        <ul>
            ${announcementsListItems}    
        </ul>
    </div>
    `;
}

function setupAccordionsForMysteries(mysteries) {
    const mysteryClassNames = mysteries.map((mystery) => {
        return buildMysteryAccordionClass(mystery);
    })
    setupAccordionClasses(mysteryClassNames);
}

// STATS

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
    <button class="accordion occurrences">Advanced Statistics</button>
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

function setupGraphs(stats) {
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

// CLUE TRACKER

function buildClueTrackerContent(mystery) {
    let tableContent = "";
    if (mystery.culpritOptions !== undefined) {
        const suspectTable = buildClueTrackerTable("Suspect", mystery.culpritOptions, mystery.announcements);
        tableContent += suspectTable;
    }
    if (mystery.weaponOptions !== undefined) {
        const weaponTable = buildClueTrackerTable("Weapon", mystery.weaponOptions, mystery.announcements);
        tableContent += weaponTable;
    }
    if (mystery.sceneOptions !== undefined) {
        const sceneTable = buildClueTrackerTable("Scene", mystery.sceneOptions, mystery.announcements);
        tableContent += sceneTable;
    }
    if (tableContent !== "") {
        return `
    <br>
    <button class="accordion ${buildMysteryAccordionClass(mystery)}">Clue Tracker</button>
    <div class="panel">
        ${tableContent}
    </div>
    `;
    } else {
        return "";
    }
}

function buildClueTrackerTable(tableName, choices, announcements) {
    let choiceRows = ``;
    choices.forEach((choice) => {
        const row = buildClueTrackerRow(choice, announcements);
        choiceRows += row;
    });
    return `
<h3>${tableName} Clue Tracker</h3>
    <table>
  <tr>
    <th>${tableName}</th>
    <th>Eliminated</th>
    <th>Clue</th>
  </tr>
  ${choiceRows}
</table>
    `;
}

function buildClueTrackerRow(item, announcements) {
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
