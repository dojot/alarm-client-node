#!/usr/bin/env node

/*
  USAGE: ./send_alarm.js <RabbitMQ IP>
*/
var client = require('../client');

var ALARM = {
        "namespace": "dojot.auth",
        "domain": "AuthenticationError",
        "description": "description to be written",
        "severity": "Minor",
        "primarySubject": {
            "instance_id": "4",
            "module_name": "My beautiful module"
        },
        "additionalData": {
            "process_id": "1",
            "signal": "1"
        },
        "eventTimestamp": "1"
    };

var con = new client.AlarmConn(process.argv[2]);

con.send(ALARM);

setTimeout(function() { con.close(); process.exit(0) }, 500);
