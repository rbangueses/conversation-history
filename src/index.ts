import * as FlexPlugin from '@twilio/flex-plugin';
import ConversationHistoryPlugin from './ConversationHistoryPlugin';


console.log("process.env: ",process.env.REACT_APP_SERVERLESS_DOMAIN_URL)
FlexPlugin.loadPlugin(ConversationHistoryPlugin);
