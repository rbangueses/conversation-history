export async function addParticipantToConversation(manager, conversationSid, address){
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
    fetch(`${process.env.REACT_APP_SERVERLESS_DOMAIN_URL}addParticipantToConversation?conversationSid=${conversationSid}&address=${encodeURIComponent(address)}`, options)
    .then(data => {
      resolve(data.json());
    })
  })
}