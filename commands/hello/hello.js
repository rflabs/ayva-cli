var Ayva = require('../ayvaConfigProvider');

var exec = require('child_process').exec,
prompts = require('../prompts'),
inquirer = require('inquirer'),
rimraf = require('rimraf'),
init = require('../init/init'),
p = require('path');

// UX
var clear = require('clear'),
    figlet = require('figlet'),
    chalk = require('chalk')

var walkthrough = function(installPath) {
    clear();
    var outputFormat = {
        font: 'Graffiti',
        horizontalLayout: 'full',
        verticalLayout: 'full'
    }

    figlet.text('Ayva', outputFormat, function(err, ascii) {
        if (err) {
            console.log(err);
            return;
        }
        console.log(chalk.rgb(200,200,90)(ascii));
        console.log("\n")
        
        var config = Ayva.Empty;
        installPath = installPath || 'ayva-helloWorld'

        let cloneHelloWorld = `git clone --depth=1 https://github.com/rflabs/ayva-helloWorld.git ${installPath}`
        console.log('Welcome to the Ayva developer framework! I\'ll start by setting up your project...\n')
        exec(cloneHelloWorld, "", function(err, data){
            if(err) return console.log(prompts.formatAsError("ayva hello failed: A folder already exists at the specified path. Try deleting it or specifying another path"))

            rimraf(p.join(installPath, '/.git'), function(err){
                if(err) return console.log(err);
                init(installPath)
            })
        })
    })
}

module.exports = walkthrough;