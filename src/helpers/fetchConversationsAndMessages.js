/* Two options are provided: 
* fetchConversationsByParticipant - does not join WhatsApp and SMS together
* fetchAllConversationsByParticipant - joins WhatsApp and SMS together
*/
//fetch list of conversations using phoneNumber and dateOffset as filters. Does not join WhatsApp and SMS together
// export async function fetchConversationsByParticipant(phoneNumber, dateOffset){
//     const options = {
//         method: 'GET',
//         headers: {
//             'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
//         }
//     };

//     return new Promise((resolve, reject) =>{
//       fetch(`${process.env.REACT_APP_SERVERLESS_DOMAIN_URL}fetchConversationsByParticipant?phoneNumber=${encodeURIComponent(phoneNumber)}&dateOffset=${dateOffset}`, options)
//       .then(data => {
//         resolve(data.json());
//       })
//     })
// }

//fetch list of conversations using phoneNumber and dateOffset as filters
export async function fetchConversationsByParticipant(phoneNumber, dateOffset){
  const options = {
      method: 'GET',
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

export async function fetchConversationMessages(conversationSid){
    const options = {
        method: 'GET',
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