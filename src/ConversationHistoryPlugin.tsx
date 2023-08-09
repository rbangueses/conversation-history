import React from 'react';
import * as Flex from '@twilio/flex-ui';
import { FlexPlugin } from '@twilio/flex-plugin';
import { CustomizationProvider } from '@twilio-paste/core/customization';
import ConversationHistoryTabComponent from './components/ConversationHistoryTabComponent/ConversationHistoryTabComponent';
import { addParticipantToConversation } from './helpers/addParticipantToConversation';

const PLUGIN_NAME = 'ConversationHistoryPlugin';

export default class ConversationHistoryPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof Flex }
   */
  async init(flex: typeof Flex, manager: Flex.Manager): Promise<void> {
    const options: Flex.ContentFragmentProps = { sortOrder: -1 };
    //console.log("serverless domain: ",process.env.SERVERLESS_DOMAIN_URL);

    Flex.setProviders({
      PasteThemeProvider: CustomizationProvider
    });

    flex.TaskCanvasTabs.Content.add(<ConversationHistoryTabComponent key="data-on-canvas-comp" label="Conversations"/>);

    //alter wrap-up to add address to chat interactions so they can be found  
    flex.Actions.replaceAction('WrapupTask', async (payload, original) => {
     // Only alter chat tasks, skip others
      if( payload.task.taskChannelUniqueName !== "chat" || payload.task.attributes.from.startsWith('whatsapp:')) {
        original(payload);
      }
      else {
        await addParticipantToConversation(payload.task.attributes.conversationSid, payload.task.attributes.from);
        return new Promise(function(resolve, reject) {
          resolve(original(payload));
        })        
      }
    });
  }
}
