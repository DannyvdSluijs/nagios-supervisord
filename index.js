var config = require('config'); /* Config reading */
var supervisord = require('supervisord'); /* Supervisord xml rpc implementation */

var url = config.get('supervisord.protocol')
if (config.get("supervisord.username")) {
    url += config.get("supervisord.username") + ':' + config.get("supervisord.password") + '@';
}
url += config.get("supervisord.hostname") + ':' + config.get("supervisord.port");

var client = supervisord.connect(url);

client.getAllProcessInfo(function(err, result)
{
	if (err) {
		console.log(err.toString());
		process.exit(3);
	}


	var running = result.filter(function(el) { return el.statename === 'RUNNING'; })
	var notRunning = result.filter(function(el) { return el.statename !== 'RUNNING'; })

	if (notRunning.length) {
		console.log(notRunning.map(function(obj) { return obj.name + ": " + obj.description; }).toString());
		process.exit(2);
	}

	console.log(running.length + " out of " + result.length + " processes running");
	process.exit(0);
});
