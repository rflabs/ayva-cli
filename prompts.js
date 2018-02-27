var chalk = require('chalk')
var Prompt = require('prompt-checkbox');

var chooseYourOwnAdventure = {
  name: 'platform',
  message: chalk.rgb(3, 35, 110)("Welcome brave traveler! A mean-ol dragon has kidnapped your princess! In this time of great violence, can you choose a less aggressive form of confrontation, and talk the dragon down using reason? Choose your approach:"),
  type: 'list',
  prefix: "-",
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
  prefix: "-",
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
  prefix: "-",
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
    description: 'Name your project: '
}

var choosePlatform = {
  name: 'platform',
  message: chalk.rgb(3, 35, 110)("Which voice assistant(s) do you need to configure?"),
  type: 'checkbox',
  prefix: "-",
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
  prefix: '-',
  validate: function(value) {
    if (value.length) {
      return true;
    } else {
      return chalk.red("Please enter your Alexa Skills ID (Having trouble finding this? Visit <url> for help): ")
    }
  }
}

var invocationPhrase = {
  name: 'invocationPhrase',
  message: chalk.rgb(3, 35, 110)("Please enter your preferred invocation phrase for Alexa: "),
  type: 'input',
  prefix: '-',
  validate: function(value) {
    if (value.length) {
      return true;
    } else {
      return chalk.red("Please enter your preferred invocation phrase for Alexa (Having trouble finding this? Visit <url> for help): ")
    }
  }
}


var Prompts = {
    nameYourProjectPrompt: nameYourProjectPrompt,
    chooseYourOwnAdventure: chooseYourOwnAdventure,
    dfClientId: dfClientId,
    dfDevAccessToken: dfDevAccessToken,
    choosePlatform: choosePlatform,
    alexaSkillId: alexaSkillId,
    invocationPhrase: invocationPhrase
}

module.exports = Prompts;