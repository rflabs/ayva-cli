var path = require('path');
var ayvaConfig = require(path.join(process.env.PWD, "ayva.json"))
console.log(ayvaConfig)

var uploadSpeechModelToDialogflow = function(){
    var p = path.join(process.env.PWD,ayvaConfig.pathToSpeechModel)
    console.log(p)
    var speechModel = require(p)
}

module.exports = uploadSpeechModelToDialogflow