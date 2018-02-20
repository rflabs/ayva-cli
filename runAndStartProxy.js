var spawn = require('child_process').spawn

var logToConsole = function(data){
    var output = data.toString('utf8')
    console.log(output)
}

var startProxy = function(port){
    var app = spawn("npm", [ 'start'])
    var proxy = spawn("bst", ['proxy', 'http', '8080']);

    app.stderr.on('data', logToConsole)
    app.stdout.on('data', logToConsole)
    proxy.stdout.on('data',logToConsole)
    proxy.stderr.on('data',logToConsole)
}

module.exports = startProxy