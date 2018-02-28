var path = require('path'),
    jsonFile = require('jsonfile'),
    exec = require('child_process').exec,
    prompts = require('../prompts.js'),
    inquirer = require('inquirer'),
    init = require('../init/init')

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
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
        var cloneHelloWorld = `git clone https://github.com/rflabs/ayva-helloWorld.git ${installPath}`;
        console.log(chalk.rgb(200,200,90)(ascii));
        console.log("\n")
        exec(cloneHelloWorld, "", function(err, data){
            if(err) return console.log("Create failed: Folder already exists at the specified path. Try deleting or specifying another path")
            init(installPath)
        })
    })
}

module.exports = walkthrough;