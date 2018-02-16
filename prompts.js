var chalk = require('chalk')
var Prompt = require('prompt-checkbox');

var chooseYourOwnAdventure = [
    {
      name: 'platform',
      message: chalk.rgb(3, 35, 110)("Welcome brave traveler! A mean-ol dragon has kidnapped your princess! In this time of great violence, can you choose a less aggressive form of confrontation, and talk the dragon down using reason? Choose your approach:"),
      type: 'checkbox',
      default: 'Google (Dialogflow)',
      choices: [
        'Google (Dialogflow)',
        'Alexa',
        'I am a coward and must respectfully decline'
      ]
    }
  ];

var nameYourProjectPrompt = {
    name: "appName",
    description: 'What would you like to call your application?',
    // type: 'string',
    // default: 'MyVoiceMailbox',
    // required: true
}


var Prompts = {
    nameYourProjectPrompt: nameYourProjectPrompt,
    chooseYourOwnAdventure: chooseYourOwnAdventure
}

module.exports = Prompts;