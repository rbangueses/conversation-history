/* This function is used to add a participant to a conversation before we close it, 
* so that the live chat session can be surfaced on the previous chat conversations
*/

//adds a messaging binding address (phone number) to an existing conversation
async function addParticipant(client, conversationSid, address){
  //need to check if this is a phone number, otherwise we might invoke this with a chat identity 
  if(!address.startsWith('+')){
    console.log("the address (phone number) provided does not start with a +. Address provided: ", address)
    return;
  }

  const addParticipant = await client.conversations.v1.conversations(conversationSid)
  .participants
  .create({
     'messagingBinding.address': address
   })
  .then(participant => console.log(participant.sid));
}

exports.handler = async function(context, event, callback) {

const client = context.getTwilioClient();
const response = new Twilio.Response();

// Set the CORS headers to allow Flex to make an error-free HTTP request to this Function
response.appendHeader('Access-Control-Allow-Origin', '*');
response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS, POST, GET');
response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');
response.appendHeader('Content-Type', 'application/json');

var conversationSid = event.conversationSid;
var address = event.address;

//validate if parameters are missing
if (!conversationSid || !address) {
  response.setBody(JSON.parse(`{"error": "malformed request"}`));
  response.setStatusCode(200);
  callback(null, response);
}

const request = await addParticipant(client, conversationSid, address).then( function(resp) {
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