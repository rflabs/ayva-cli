var chalk = require('chalk')

var formatAsMainText = function(text){
  return chalk.rgb(200,200,90)(text)
}

var formatAsError = function(text){
  return chalk.red(text)
}

var chooseYourOwnAdventure = {
  name: 'platform',
  message: formatAsMainText("Welcome brave traveler! A mean-ol dragon has kidnapped your princess! In this time of great violence, can you choose a less aggressive form of confrontation, and talk the dragon down using reason? Choose your approach:"),
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
  message: formatAsMainText("Please enter your Dialogflow client id:"),
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
  message: formatAsMainText("Please enter your Dialogflow Developer Access Token: "),
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
  message: formatAsMainText("Which voice assistant(s) do you need to configure?"),
  type: 'checkbox',
  prefix: "-",
  choices: [
    'Google (Dialogflow)',
    'Alexa'
  ]
}

var alexaSkillId = {
  name: 'alexaSkillId',
  message: formatAsMainText("Please enter your Alexa Skills ID: "),
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
  message: formatAsMainText("Please enter your preferred invocation phrase for Alexa: "),
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
  nameYourProjectPrompt,
  chooseYourOwnAdventure,
  dfClientId,
  dfDevAccessToken,
  choosePlatform,
  alexaSkillId,
  invocationPhrase,
  formatAsError,
  formatAsMainText
}

module.exports = Prompts;