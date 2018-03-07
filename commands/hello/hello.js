var Ayva = require('../ayvaConfigProvider');

var exec = require('child_process').exec,
prompts = require('../prompts'),
inquirer = require('inquirer'),
init = require('../init/init')
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
        console.log(prompts.formatAsMainText(ascii));
        console.log("\n")
        
        var config = Ayva.Empty;
        installPath = installPath || 'ayva-helloWorld'

        var cloneHelloWorld = `git clone --depth=1 https://github.com/rflabs/ayva-helloWorld.git ${installPath} && rm -rf ${installPath}/.git`; //Don't use original repo
        
        console.log(chalk.rgb(200,200,90)('Welcome to the Ayva developer framework! I\'ll start by setting up your project...'))
        exec(cloneHelloWorld, "", function(err, data){
            if(err) return console.log(prompts.formatAsError("ayva hello failed: A folder already exists at the specified path. Try deleting it or specifying another path"))
            init(installPath)
        })
    })
}

module.exports = walkthrough;