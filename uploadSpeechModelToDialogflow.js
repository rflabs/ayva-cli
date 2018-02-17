var path = require('path');

var uploadSpeechModelToDialogflow = function(ayvaConfig){
    var speechModel = require(path.join(process.env.PWD,ayvaConfig.pathToSpeechModel))
}

module.exports = uploadSpeechModelToDialogflow