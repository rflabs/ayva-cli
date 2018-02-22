var gitCommand = "git clone https://github.com/rflabs/ayva-helloWorld.git",
path = require('path'),
ayvaConfigPath = path.join(process.env.PWD || process.cwd(), "/ayva-helloWorld/ayva.json"),
ayvaConfig = require(path.join(__dirname,'/empty.ayva.json'))
jsonFile = require('jsonfile'),
exec = require('child_process').exec,
prompts = require('./prompts.js'),
inquirer = require('inquirer')

// UX
var clear = require('clear')
var figlet = require('figlet');
var chalk = require('chalk')

var walkthrough = function(req, optional) {
    clear();

    figlet.text('Ayva', {
        font: 'Graffiti',
        horizontalLayout: 'full',
        verticalLayout: 'full'
    }, function(err, ascii) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
        console.log(chalk.rgb(64,5,30)(ascii));
        console.log("\n")
        exec(gitCommand, "", function(err, data){
            inquirer.prompt(prompts.choosePlatform).then(function(answer) {
                console.log("\n")
                for (let i in answer.platform) {
                    if (answer.platform[i] === 'Google (Dialogflow)') {
                        inquirer.prompt(prompts.dfDevAccessToken).then(function(res) {
                            ayvaConfig.dialogflow["developerAccessToken"] = res.dfDevAccessToken;
                            jsonFile.writeFileSync(ayvaConfigPath, ayvaConfig)
                            console.log("\n")
                        })
                    }
                }
                
            })
        });
        
    });


    
}

module.exports = walkthrough;