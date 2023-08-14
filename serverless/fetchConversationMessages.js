const TokenValidator = require('twilio-flex-token-validator').functionValidator;
const MAX_MESSAGES_TO_FETCH = 100;

/* Returns the messages within a given conversation */
async function getConversationMessages(client, conversationSid){
    var result = [];
    var messages = await client.conversations.v1.conversations(conversationSid)
        .messages
        .list({limit: MAX_MESSAGES_TO_FETCH})
    
    //create a result object with the information we want to supply
    for await (const message of messages){

        let media = JSON.stringify(message.media);
        
        let msg = JSON.parse(`{
            "index": "${message.index}",
            "author": "${message.author}", 
            "body": "${message.body}",
            "media": ${media},
            "dateCreated": "${message.dateCreated}"
            }`);
        console.log(msg);
        result.push(msg);
    }
    return result;
}

exports.handler = TokenValidator (async function(context, event, callback) {
  // Access the NodeJS Helper Library by calling context.getTwilioClient()
  const client = context.getTwilioClient();

  // Create a custom Twilio Response
  const response = new Twilio.Response();

  // Set the CORS headers to allow Flex to make an error-free HTTP request to this Function
  response.appendHeader('Access-Control-Allow-Origin', '*');
  response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS, POST, GET');
  response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');
  response.appendHeader('Content-Type', 'application/json');

  var conversationSid = event.conversationSid;

  //validate if a conversationSid has been provided
  if (!conversationSid) {
    response.setBody(JSON.parse(`{"error": "no conversationSid provided"}`));
    response.setStatusCode(200);
    callback(null, response);
  }

  const request = await getConversationMessages(client, conversationSid).then( function(resp) {
    // handle success 
    var data = resp;
    if(typeof data !== 'undefined'){
      response.setBody(data);
    }
    //handle error
    else response.setBody(JSON.parse(`{"result": "error"}`));
    response.setStatusCode(200);
    callback(null, response);
  })
});