var fs = require('fs'),
    exec = require('child-process-promise').exec,
    Ayva = require('../../../ayvaConfigProvider')

                    /*  ask api update-model
                        [-s|--skill-id <skillId>]
                        [-f | --file <fileName>]
                        [-l|--locale <locale>]
                        [-p|--profile <profile>]
                        [-g|--stage <stage>]
                        [--debug]

                    */
var updateModel = function(){
    if(!Ayva) return;

    var commandText = `ask api update-model -s ${Ayva.config.alexa.skillId} -f ./en-US.json -l en-US`;
    exec(commandText)
        .then((data) =>  { 
            if(data.stderr) 
                console.log(data.stderr) 
            else {
                fs.unlink('./en-US.json', function(data,err){
                    if(!err)
                        console.log("Successful deploy to Alexa")
                })
            }
        })
        .catch((err) => { 
            console.log(err.stderr);
            fs.unlink('./en-US.json', function(data,err){
                return
            })
        } )  
}

module.exports = updateModel;