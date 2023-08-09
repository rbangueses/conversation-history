export async function addParticipantToConversation(conversationSid, address, customerChatAddress){
    const options = {
        method: 'GET',
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