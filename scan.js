const scanner = require('eddystone-beacon-scanner'),
      base91 = require('base91'),
      log = require('./log'),
      SCAN_INTERVAL = 120000,
      MAX_HISTORY_ENTRIES = 200;

// use dummy data for testing
let ruuviTags = (process.env.NODE_ENV === 'test' ? require('./test/dummyData') : {});

scanner.on('found', beaconFound);
scanner.on('updated', beaconFound);

function scanForBeacons() {
    log.info('scanning for beacons');
    scanner.startScanning(true);
    // scan for 5 seconds and then stop, should be enough to find every ruuvitag around
    setTimeout(() => {
        scanner.stopScanning();
        log.info('stopped scanning');
    }, 5000);
}

function start() {
    // scan every minute only
    setInterval(scanForBeacons, SCAN_INTERVAL);
    scanForBeacons();
}

function updateRuuviData(beacon) {

    let now = Date.now(),
        hash = beacon.url.split('#')[1],
        decoded = base91.decode(hash),
        decoded64 = Buffer.from(hash, 'base64'),
        format = decoded64[0],
        uTemp, tempSign;

    if (ruuviTags[beacon.id] === undefined) {
        ruuviTags[beacon.id] = {
            history: []
        }
    } else if (ruuviTags[beacon.id].lastUpdated > now - 5000) {
        // we already have recent data (under five seconds old), no need to update
        return;
    }

    if (format !== 2) {
        uTemp = (((decoded[3] & 127) << 8) | decoded[2]);
        tempSign = (decoded[3] >> 7) & 1;
        
        ruuviTags[beacon.id].temperature = tempSign === 0 ? uTemp/256.0 : -1 * uTemp/256.0;
        ruuviTags[beacon.id].pressure = (((decoded[5] << 8) + decoded[4]) + 50000)/100;
        ruuviTags[beacon.id].humidity = decoded[1] * 0.5;
    } else {
        uTemp = (((decoded64[2] & 127) << 8) | decoded64[3]);
        tempSign = (decoded64[2] >> 7) & 1;
        
        ruuviTags[beacon.id].temperature = tempSign === 0 ? uTemp/256.0 : -1 * uTemp/256.0;
        ruuviTags[beacon.id].pressure = (((decoded64[4] << 8) + decoded64[5]) + 50000)/100;
        ruuviTags[beacon.id].humidity = decoded64[1] * 0.5;
    }

    ruuviTags[beacon.id].lastUpdated = now;

    // only store historical data when temperature actually changes
    let previousTemp = (ruuviTags[beacon.id].history.slice(-1)[0] || [,0])[1];
    if (previousTemp != ruuviTags[beacon.id].temperature) {
        ruuviTags[beacon.id].history.push([now, ruuviTags[beacon.id].temperature]);
    }

    // if history is "full", purge 10% of the olders entries
    if (ruuviTags[beacon.id].history.length >= MAX_HISTORY_ENTRIES) {
        ruuviTags[beacon.id].history = ruuviTags[beacon.id].history.slice(Math.floor(.1 * MAX_HISTORY_ENTRIES));
    }

    log.info('updated ruuviTag ' + beacon.id);
}

function isRuuviTag(beacon) {
    return (beacon.url && beacon.url.indexOf('ruu.vi') >= 0);
}

function beaconFound(beacon) {
    if (isRuuviTag(beacon)) {
        log.debug('found RuuviTag:\n', JSON.stringify(beacon, null, 2));
        updateRuuviData(beacon);
    }
}

module.exports = {
    start: start,
    data: ruuviTags
}