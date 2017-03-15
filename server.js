const express = require('express'),
      app = express(),
      scan = require('./scan'),
      log = require('./log');

app.set('view engine', 'pug');
app.use(express.static('public'));
// enable moment usage in pug templates
app.locals.moment = require('moment');

app.get('/', (req, res) => {
    res.render('index', { ruuviTags: scan.data, noTags: Object.keys(scan.data).length }); 
});

let port = process.env.PORT || 8000;
app.listen(port, () => {
    log.info('RuuviTag weatherstation listening on port ' + port);
});

scan.start();