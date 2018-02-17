var spawn = require('child_process').spawn

var startProxy = function(){
    var proxy = spawn("bst", ['proxy', 'http', '8080', '--verbose']);

    proxy.stdout.on('data',function(data){
        console.log(data.toString('utf8'))
    })

    proxy.stderr.on('data',function(data){
        console.log(data.toString('utf8'))
    })
}

module.exports = startProxy