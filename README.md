# Alarm Manager NodeJS Client

[![License badge](https://img.shields.io/badge/license-GPL-blue.svg)](https://opensource.org/licenses/GPL-3.0)

```bash
npm install dojot-clientlib
```

This library implements an Alarm Manager nodejs client for sending alarms to it
through RabbitMQ.

## How does it works

The client sends a JSON formated alarm event to the RabbitMQ instance of Alarm
Manager. The alarm is enqueued until a server channel connection is available.

### Sending messages to Alarm Manager

Alarms are JSON messages :

```json
{
  "namespace": "test.commons.backtrace",
  "domain": "ApplicationCrash",
  "description": "description to be written",
  "severity": "Minor", [Warning, Minor, Major, Clear]
  "primarySubject": {
    "instance_id": "4",
    "module_name": "My beautiful module"
  },
  "additionalData": {
    "process_id": "1",
    "signal": "1"
  },
  "eventTimestamp": "1"
}
```

And we send it through :
```javascript

var clientlib = require('dojot-clientlib');

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

var client = new clientlib.AlarmConn();
client.send(ALARM);
client.close();
```

Other parameters includes:
```javascript
function send(alarm,
  hostname = 'localhost', port = '5672',
  username = 'guest', password = 'guest')
```

The user should close the connection when is done through:
```javascript
function close();
```
