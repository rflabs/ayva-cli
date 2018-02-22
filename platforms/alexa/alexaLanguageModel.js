var alexaModel = function(){
    return {
        "interactionModel":{
            "languageModel": {
                "invocationName": null,
                "intents": [
                    {
                        "name": "AMAZON.CancelIntent",
                        "slots": [],
                        "samples": []
                    },
                    {
                        "name": "AMAZON.HelpIntent",
                        "slots": [],
                        "samples": []
                    },
                    {
                        "name": "AMAZON.StopIntent",
                        "slots": [],
                        "samples": []
                    }
                ]
            }
        }
    }
}

module.exports = alexaModel


/* SAMPLE INTENT 
{
    "name": "Name",
    "slots": [
        {
            "name": "firstName",
            "type": "AMAZON.US_FIRST_NAME"
        }
    ],
    "samples": [
        "I am {firstName}",
        "{firstName}",
        "My name is {firstName}"
    ]
}

*/