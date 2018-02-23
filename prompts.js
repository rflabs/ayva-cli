var chalk = require('chalk')
var Prompt = require('prompt-checkbox');

var chooseYourOwnAdventure = {
  name: 'platform',
  message: chalk.rgb(3, 35, 110)("Welcome brave traveler! A mean-ol dragon has kidnapped your princess! In this time of great violence, can you choose a less aggressive form of confrontation, and talk the dragon down using reason? Choose your approach:"),
  type: 'list',
  prefix: "1.",
  default: 'Google (Dialogflow)',
  choices: [
    'Google (Dialogflow)',
    'Alexa',
    'I am a coward and must respectfully decline'
  ]
}

var dfClientId = {
  name:'dfClientId',
  message: chalk.rgb(3, 35, 110)("Please enter your Dialogflow client id:"),
  type: 'input',
  prefix: "2.",
  validate: function(value) {
    if (value.length) {
      return true;
    } else {
      return chalk.red("Please enter your Dialogflow client id. (Having trouble finding this? Visit <url> for help)")
    }
  }
}

var dfDevAccessToken = {
  name: 'dfDevAccessToken',
  message: chalk.rgb(3, 35, 110)("Please enter your Dialogflow Developer Access Token: "),
  type: 'input',
  prefix: "2.",
  validate: function(value) {
    if (value.length) {
      return true;
    } else {
      return chalk.red("Please enter your Dialogflow Developer Access Token (Having trouble finding this? Visit <url> for help): ")
    }
  }
}

var nameYourProjectPrompt = {
    name: "appName",
    description: 'What would you like to call your application?',
    // type: 'string',
    // default: 'MyVoiceMailbox',
    // required: true
}

var choosePlatform = {
  name: 'platform',
  message: chalk.rgb(3, 35, 110)("Which voice assistant(s) will you be building off of?"),
  type: 'checkbox',
  prefix: "1.",
  default: 'Google (Dialogflow)',
  choices: [
    'Google (Dialogflow)',
    'Alexa'
  ]
}

var alexaSkillId = {
  name: 'alexaSkillId',
  message: chalk.rgb(3, 35, 110)("Please enter your Alexa Skills ID: "),
  type: 'input',
  prefix: '2.',
  validate: function(value) {
    if (value.length) {
      return true;
    } else {
      return chalk.red("Please enter your Alexa Skills ID (Having trouble finding this? Visit <url> for help): ")
    }
  }
}


var Prompts = {
    nameYourProjectPrompt: nameYourProjectPrompt,
    chooseYourOwnAdventure: chooseYourOwnAdventure,
    dfClientId: dfClientId,
    dfDevAccessToken: dfDevAccessToken,
    choosePlatform: choosePlatform,
    alexaSkillId: alexaSkillId
}

module.exports = Prompts;