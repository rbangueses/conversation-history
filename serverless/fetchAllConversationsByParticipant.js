/* Fetches all conversations by a participant.
* The participant is either a phone number i.e. +447123123123 or a whatsapp:++447123123123 and then we bundle them together
* If the participant is a chat participant, the chat is being tied to a from address //TODO MODIFIED FROM?
*/

const MAX_CONVERSATIONS_TO_FETCH = 100;
const MAX_CONVERSATIONS_TO_PRESENT = 20;
const MAX_PERIOD = 12;

/* Returns previous date */
function getPreviousDate(monthsAgo) {
    const d = new Date(); // Current date
    d.setMonth(d.getMonth() - monthsAgo);
    return d;
  }

/* Returns the conversations list in order. 
** Applies filter startDate > date, where date is at a maximum the MAX_PERIOD */
async function getAllConversationsList(client, fromAddress, date){
    var newDate = MAX_PERIOD;
    var result = [];

    //if the original fromAddress is a WhatsApp we need to swap it around
    if(fromAddress.startsWith('whatsapp:')){
      fromAddressWA = fromAddress;
      fromAddress = fromAddress.slice(9);
    }

    var fromAddressWA = 'whatsapp:'+fromAddress;
    //if there is a date, we filter the conversations by it, otherwise we will use the 
    if (date){
        newDate = getPreviousDate(date);
    }

    //fetch conversations with filters
    const conversationsListNumber = await client
        .conversations
        .v1
        .participantConversations
        .list({address: fromAddress, startDate: newDate, limit: MAX_CONVERSATIONS_TO_FETCH})

    //fetch conversations with filters
    const conversationsListWA = await client
        .conversations
        .v1
        .participantConversations
        .list({address: fromAddressWA, startDate: newDate, limit: MAX_CONVERSATIONS_TO_FETCH})

    //sort by date created 
    var conversationsList = conversationsListNumber.concat(conversationsListWA);
    
    conversationsList.sort((a, b) => new Date(b.conversationDateCreated) - new Date(a.conversationDateCreated));  
    
    //remove those that are not to be presented
    if(MAX_CONVERSATIONS_TO_FETCH > MAX_CONVERSATIONS_TO_PRESENT){
      conversationsList
        .splice(MAX_CONVERSATIONS_TO_PRESENT, MAX_CONVERSATIONS_TO_FETCH - MAX_CONVERSATIONS_TO_PRESENT);
    }
    
    //create a result object with the information we want to supply
    for await (const conversation of conversationsList){
      //this will identify whatsapps as whatsapp, sms and chat as sms (because we're adding a messaging binding to chats)
      let originalChannel = conversation.participantMessagingBinding.type;
      //if the proxy comes out null, it was originally a chat
      if (originalChannel === 'sms'){
        if (!conversation.participantMessagingBinding.proxy_address){
          originalChannel = 'chat';
        }
      }
      let convo = JSON.parse(`{
        "conversationOriginalChannel": "${originalChannel}",
        "conversationSid": "${conversation.conversationSid}", 
        "conversationDateCreated": "${conversation.conversationDateCreated}",
        "conversationState": "${conversation.conversationState}",
        "from": "${conversation.participantMessagingBinding.address}"
        }`);
      result.push(convo);
    }
    return result;
}

exports.handler = async function(context, event, callback) {
  // Access the NodeJS Helper Library by calling context.getTwilioClient()
  const client = context.getTwilioClient();

  // Create a custom Twilio Response
  const response = new Twilio.Response();
  //initialize vars
  var phoneNumber = '';
  var startDateOffset = MAX_PERIOD;

  // Set the CORS headers to allow Flex to make an error-free HTTP request to this Function
  response.appendHeader('Access-Control-Allow-Origin', '*');
  response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS, POST, GET');
  response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');
  response.appendHeader('Content-Type', 'application/json');

  //validate if a number has been provided
  if (event.phoneNumber) {
    phoneNumber = event.phoneNumber;
  }
  else {
    response.setBody(JSON.parse(`{"error": "no number provided"}`));
    response.setStatusCode(200);
    callback(null, response);
  }

  /*If dateOffset is provided, we use it*/
  if (event.dateOffset) {
    startDateOffset = event.dateOffset;
  }

  const request = await getAllConversationsList(client, phoneNumber, startDateOffset).then( function(resp) {
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
};