//fetch list of conversations using phoneNumber and dateOffset as filters
export async function fetchConversationsByParticipant(manager, phoneNumber, dateOffset){
  // Add the Token using the Flex manager
  const body = {
    WorkspaceSid: 'WS45ce05b26c5bdc08e60bb4dbd7c6a46f',
    Token: manager.store.getState().flex.session.ssoTokenPayload.token
  };

  const options = {
      method: 'POST',
      body: new URLSearchParams(body),
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      }
  };

  return new Promise((resolve, reject) =>{
    fetch(`${process.env.REACT_APP_SERVERLESS_DOMAIN_URL}fetchAllConversationsByParticipant?phoneNumber=${encodeURIComponent(phoneNumber)}&dateOffset=${dateOffset}`, options)
    .then(data => {
      resolve(data.json());
    })
  })
}

export async function fetchConversationMessages(manager, conversationSid){
  const body = {
    WorkspaceSid: 'WS45ce05b26c5bdc08e60bb4dbd7c6a46f',
    Token: manager.store.getState().flex.session.ssoTokenPayload.token
  };
  
  const options = {
      method: 'POST',
      body: new URLSearchParams(body),
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      }
  };

  return new Promise((resolve, reject) =>{
    fetch(`${process.env.REACT_APP_SERVERLESS_DOMAIN_URL}fetchConversationMessages?conversationSid=${conversationSid}`, options)
    .then(data => {
      resolve(data.json());
    })
  })
}