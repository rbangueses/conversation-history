import React from 'react';
import { ITask, withTaskContext } from '@twilio/flex-ui';
import { fetchConversationMessages } from '../../helpers/fetchConversationsAndMessages';
import {
    ChatLog,
    ChatMessage,
    ChatMessageMeta,
    ChatMessageMetaItem,
    ChatBubble
  } from '@twilio-paste/chat-log';

type MyProps = {
    task: ITask;
    conversationSid: string;
  };

type MessageTrimmed = {
    index : string,
    author: string,
    body: string,
    dateCreated : string
}

type MyState = {
    messages: MessageTrimmed[]; // like this
};

class ConversationHistoryTranscriptComponent extends React.Component<MyProps, MyState> {

    constructor(props : any) {
        super(props);
        this.state = {
            messages: []
        }
    }  

    async componentDidMount(){
        const fetchMessagesRequest = await fetchConversationMessages(this.props.conversationSid).then( (messages) =>{
            this.setState({messages : messages})
        })
    }
   
    render() {
    return (
        <ChatLog>
            {
                this.state.messages?.map((message, index)=> {

                    let dateTime : string = message.dateCreated;
                    const uuidPattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
                    if(message.author.startsWith("whatsapp:") || message.author.startsWith("+") || uuidPattern.test(message.author)|| message.author === 'Virtual Assistant'){
                        console.log("inbound message?", message)
                        return (
                            <ChatMessage variant="inbound" key={message.index}>
                                <ChatBubble >{message.body}</ChatBubble>
                                <ChatMessageMeta aria-label="customer" >
                                <ChatMessageMetaItem>{message.author} ・ {dateTime.slice(0,24)}</ChatMessageMetaItem>
                                </ChatMessageMeta>
                            </ChatMessage>
                        )
                    }
                    else {
                        let author = message.author;
                        if(author === this.props.conversationSid){
                            author = "Virtual Agent";
                        }
                        console.log("outbound message?", message)
                        return (    
                            <ChatMessage variant="outbound" key={message.index}>
                                <ChatBubble >{message.body}</ChatBubble>
                                <ChatMessageMeta aria-label="agent" >
                                <ChatMessageMetaItem>{author} ・ {dateTime.slice(0,24)}</ChatMessageMetaItem>
                                </ChatMessageMeta>
                            </ChatMessage>
                        ) 
                    }
                })
            }
        </ChatLog>
    );
}
}

export default withTaskContext(ConversationHistoryTranscriptComponent);