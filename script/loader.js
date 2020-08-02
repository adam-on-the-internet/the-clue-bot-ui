const baseClueBotUrl = `https://aoti-basic-express-app.herokuapp.com/clueBot`;
const currentCollection = baseClueBotUrl + `/current`;
const statsCollection = baseClueBotUrl + `/stats`;

function load() {
    loadCurrentMystery();
    loadSolvedMysteries();
    loadStats();
}

async function loadCurrentMystery() {
    const currentResponse = await fetch(currentCollection);
    const responseText = await currentResponse.text();
    if (responseText) {
        const currentMystery = await JSON.parse(responseText);
        displayCurrentMystery(currentMystery);
    } else {
        displayNoCurrentMystery();
    }
}

async function loadStats() {
    const statsResponse = await fetch(statsCollection);
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
