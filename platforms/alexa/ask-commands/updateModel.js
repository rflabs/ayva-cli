var exec = require('child-process-promise').exec;

                    /* $ ask api update-model
                        [-s|--skill-id <skillId>]
                        [-f | --file <fileName>]
                        [-l|--locale <locale>]
                        [-p|--profile <profile>]
                        [-g|--stage <stage>]
                        [--debug]

                    */
var updateModel = function(alexaConfig){
    var commandText = `ask api update-model ${alexaConfig.skillId} -f ${alexaConfig.file} -l 'en-US' -g development --debug`;
        //profile -p
    
    exec(commandText)
        .then(() => { return parseResponse() } )
        .catch((err) => { return parseResponse(err) } )    
}

module.exports = updateModel;