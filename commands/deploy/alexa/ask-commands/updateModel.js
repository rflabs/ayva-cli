var fs = require('fs'),
    prompt = require('../../../prompts'),
    exec = require('child-process-promise').exec

                    /*  ask api update-model
                        [-s|--skill-id <skillId>]
                        [-f | --file <fileName>]
                        [-l|--locale <locale>]
                        [-p|--profile <profile>]
                        [-g|--stage <stage>]
                        [--debug]

                    */
var updateModel = function(ayvaConfig){
    var commandText = `ask api update-model -s ${ayvaConfig.config.alexa.skillId} -f ./en-US.json -l en-US`;
    exec(commandText)
        .then((data) =>  { 
            if(data.stderr) 
                console.log(data.stderr) 
            else {
                fs.unlink('./en-US.json', function(data,err){
                    if(!err)
                        ayvaConfig.speechModel.intents.map(intent => {
                            console.log(prompt.formatAsMainText(`Successfully deployed intent to Alexa: ${intent.name}`))
                        })
                        ayvaConfig.speechModel.entities.map(entity => {
                            console.log(prompt.formatAsMainText(`Successfully deployed entity to Alexa: ${entity.name}`))
                        })
                })
            }
        })
        .catch((err) => {
            console.log(prompt.formatAsError(`\nThere was a problem deploying to Alexa\n--------------------------------------`))
            console.log(err.stderr);
            fs.unlink('./en-US.json', function(data,err){
                return
            })
        } )  
}

module.exports = updateModel;