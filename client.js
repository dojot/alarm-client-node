var amqp = require('amqplib/callback_api');
var util = require('util');

function bail(err, conn) {
    console.error(err);
    if (conn) {
        conn.close();
    }
}

/*
Sends an JSON formatted alarm to RabbitMQ at host
  - see the Alarm Manager alarm json format doc
  - RabbitMQ exchange and routing_key extracted from:
   alarm-manager/alarm-receiver/src/main/java/com/cpqd/vppd/alarmmanager/alarmreceiver/AmqpAlarmReceiver.java
*/
function send(alarm,
  hostname = 'localhost', port = '5672',
  username = 'guest', password = 'guest') {

  function on_connect(err, conn) {
    if (err !== null) return bail(err);

    function on_channel_open(err, ch) {
      if (err !== null) return bail(err, conn);
      var ex = 'alarms.exchange';
      var routing_key = 'alarms';
      ch.assertExchange(ex, 'direct', {durable: true});
      ch.publish(ex, routing_key, Buffer.from(JSON.stringify(alarm)), {persistent: true});
      console.log(" [x] Sent :\n'%s'", util.inspect(alarm, {'depth':null}));
      ch.close(function() { conn.close(); });
    }
    conn.createChannel(on_channel_open);
  }

  var param = {};
  param.hostname = hostname;
  param.port = port;
  param.username = username;
  param.password = password;
  console.log("Connection parameters:\n%s", util.inspect(param, {'depth':null}));
  amqp.connect(param, on_connect);
}

module.exports.send = send;
