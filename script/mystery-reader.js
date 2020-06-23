const solvedUrl = `https://aoti-basic-express-app.herokuapp.com/clueBot`;
const currentUrl = `https://aoti-basic-express-app.herokuapp.com/clueBot/current`;

function loadMysteries() {
    loadCurrentMystery();
    loadSolvedMysteries();
}

async function loadCurrentMystery() {
    const currentResponse = await fetch(currentUrl);
    const responseText = await currentResponse.text();
    if (responseText) {
        const currentMystery = await currentResponse.json();
        displayCurrentMystery(currentMystery);
    } else {
        displayNoCurrentMystery();
    }
}

async function loadSolvedMysteries() {
    const solvedResponse = await fetch(solvedUrl);
    const solvedMysteries = await solvedResponse.json();
    if (solvedMysteries.length > 0) {
        displaySolvedMysteries(solvedMysteries);
    } else {
        displayNoSolvedMysteries();
    }
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
        return "<p>The Mystery has been solved!</p>";
    } else {
        return `<p>Chapter ${mystery.status}/21</p>`
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

function addAsset(asset) {
    const tagContent = getAssetTagContent(asset);
    const commentContent = getCommentContent(asset);
    const fullPath = `${baseUrl}/assets${asset.src}`;
    const assetContent = buildAssetContent(asset, fullPath, commentContent, tagContent);
    document.getElementById("gallery").innerHTML += assetContent;
}
