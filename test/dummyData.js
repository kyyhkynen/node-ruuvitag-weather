// generate dummy date for tuning the ui without a ruuvitag
const log = require('../log');

log.info('using dummy data');

// test data for three ruuvitags
let ruuviTags = {
    'd5ac43194593': {
        temperature: 21,
        humidity: 35,
        pressure: 1024,
        lastUpdated: Date.now(),
        history: [[Date.now(), 21]]
    },
    '876f098a0b93': {
        temperature: 22,
        humidity: 36,
        pressure: 1023,
        lastUpdated: Date.now(),
        history: [[Date.now(), 22]]
    },
    'b16b00b5aaaa': {
        temperature: 23,
        humidity: 37,
        pressure: 1022,
        lastUpdated: Date.now(),
        history: [[Date.now(), 23]]
    }
};
for (var i = 0; i < 60; i++) {
    for(var t in ruuviTags) {
        let lastTemp = ruuviTags[t].history[0][1],
            lastTime = ruuviTags[t].history[0][0];
        ruuviTags[t].history.unshift([
            lastTime - 1000 * (58 + Math.floor(Math.random() * 5)),
            lastTemp - 1 + Math.floor(Math.random() * 3)
        ]);
    }
}

module.exports = ruuviTags;