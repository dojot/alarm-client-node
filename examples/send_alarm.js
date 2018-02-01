#!/usr/bin/env node

/*
  USAGE: ./send_alarm.js <RabbitMQ IP>
*/
var client = require('../client');

var ALARM = {
        "namespace": "test.commons.backtrace",
        "domain": "ApplicationCrash",
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

client.send(ALARM, process.argv[2]);
