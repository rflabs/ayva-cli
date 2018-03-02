var Ayva = require('../ayvaConfigProvider');

var exec = require('child_process').exec,
prompts = require('../prompts'),
inquirer = require('inquirer'),
init = require('../init/init')
p = require('path');

var walkthrough = function(installPath) {
    var config = Ayva.Empty;
    installPath = installPath || 'ayva-helloWorld'

    var cloneHelloWorld = `git clone --depth=1 https://github.com/rflabs/ayva-helloWorld.git ${installPath} && rm -rf ${installPath}/.git`; //Don't use original repo
    
    console.log('Cloning repo from git...')
    exec(cloneHelloWorld, "", function(err, data){
        if(err) return console.log("Hello failed: Folder already exists at the specified path. Try deleting or specifying another path")
        init(installPath)
    });
}

module.exports = walkthrough;