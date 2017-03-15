const winston = require('winston'),
      moment = require('moment');
      
let logger = new (winston.Logger)({
    level: 'info',
    transports: [
        new (winston.transports.Console)({
            timestamp: () => moment().format('YYYY-MM-DD HH:mm:ss.SSSS'),
            colorize: true,
        })
    ]
});

module.exports = logger;