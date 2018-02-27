var Ayva = require('./ayvaConfigProvider')

var init = function(cmd){
    Ayva.overridePath('/ayva-helloWorld')
    console.log(Ayva)
}


module.exports = init