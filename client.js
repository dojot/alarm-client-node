var amqp = require('amqplib/callback_api');
var util = require('util');

'use strict';

function bail(err, conn) {
    console.error(err);
    if (conn) {
        conn.close();
    }
}

// Exchange description
const ex = 'alarms.exchange';
const routing_key = 'alarms';

class AlarmConn {
  constructor ( hostname = 'localhost', port = '5672',
                username = 'guest', password = 'guest') {
    // Alarm  queue
    this.alarms = [];

    // Bound to this object instacne
    this.on_channel_open = this.on_channel_open.bind(this);
    this.on_connect = this.on_connect.bind(this);
    this._send = this._send.bind(this);
    this.send = this.send.bind(this);
    this.close = this.close.bind(this);

    let param = {};
    param.hostname = hostname;
    param.port = port;
    param.username = username;
    param.password = password;
//    console.log("Connection parameters:\n%s", util.inspect(param, {'depth':null}));
    amqp.connect(param, this.on_connect);
  }

  on_channel_open(err, ch) {
    if (err !== null) return bail(err, conn);
    ch.assertExchange(ex, 'direct', {durable: true});
    console.log("Connected!!!");
    this.channel = ch;
    this._send();
  }

  on_connect(err, conn) {
    if (err !== null) return bail(err);
    conn.createChannel(this.on_channel_open);
    this.conn = conn;
  }

  _send() {
    if (!this.hasOwnProperty('channel')) return;
    while(this.alarms.length) {
      let alarm = this.alarms.pop();
      this.channel.publish(ex, routing_key, Buffer.from(JSON.stringify(alarm)), {persistent: true});
      console.log(" [x] Sent :\n'%s'", util.inspect(alarm, {'depth':null}));
    }
  }
  /*
  Enqueue a JSON formatted alarm to RabbitMQ at host
    - see the Alarm Manager alarm json format doc
  */
  send(alarm) {
    this.alarms.push(alarm);
    this._send();
  }

  close() {
    this.conn.close();
  }
}

//export default AlarmConn;
module.exports.AlarmConn = AlarmConn;
