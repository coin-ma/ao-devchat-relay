## dev setup

### process list
* test-chat-room: [B9BIdLkqwyKyw0X5tgMO1Nn_4mHHw1DeqMPwks3Zs_Q ](https://www.ao.link/entity/B9BIdLkqwyKyw0X5tgMO1Nn_4mHHw1DeqMPwks3Zs_Q)
* test-user: [JIUfKIWGActC1lBIPQt_AIsjrUaSat8-oZsW2baF_Xo](https://www.ao.link/entity/JIUfKIWGActC1lBIPQt_AIsjrUaSat8-oZsW2baF_Xo)
* default(ao-replay): [ba_9JjzvB-COdVvwMa24ymEX8dWPmiZCoIg_Ydm4s9M](https://www.ao.link/entity/ba_9JjzvB-COdVvwMa24ymEX8dWPmiZCoIg_Ydm4s9M) 

### run test
* `npm install && npm run start`

* Join discord https://discord.gg/5gqWPzdXwE and go to ao-chatbot channel

* enter test-chat-room process `aos test-chat-room --wallet aos.json`

* enter test-user ao process `aos test-user --wallet aos.json`

    send message to ao chatroom:

    `Send({Target = 'B9BIdLkqwyKyw0X5tgMO1Nn_4mHHw1DeqMPwks3Zs_Q', Action='Broadcast', Data='message from ao'})`

    message should appear in dc channel

* enter message in dc ao-chatbot channel

    message should appear in test-user aos process's inbox
    `Inbox[#Inbox].Data`
    

## Installation
* create dc-relay process and join chatroom
    ```
    aos dc-relay --wallet=aos.json --load message-relay.lua

    Send({Target = ao.id, ChatRoom = {ChatRoom}, Action='Register'})
    ```

* set up discord bot and add the bot to the ao dev channel

* update setting.js 

* npm install && npm run start
