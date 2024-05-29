const { Client, GatewayIntentBits } = require('discord.js');
const { message, createDataItemSigner } = require('@permaweb/aoconnect');
const { dcChannel, relayProcessId, dcToken } = require('./setting')
const { readFileSync } = require('fs');

const signer = (() => {
    const wallet = JSON.parse(
        readFileSync('aos.json').toString()
    );
    return createDataItemSigner(wallet)
})()





const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    // const channelId = Object.keys(dcChannel)[0]
    // await sendMessage(channelId, 'from bot')

});


client.on('messageCreate', async message => {
    if (!dcChannel[message.channelId]) {
        // message is from channel which is not in the list, do nothing
        // console.log('receive message from unwatched channel, do nothing')
        return
    }

    if (message.author.id === client.user.id) {
        // from self, do nothing
        console.log('receive message from bot itself, do nothing')
        return
    }
    await handleOnMessageCreate(message);
});

client.login(dcToken);


async function relayAoMessage(channelId, sender, msg) {
    if (client.isReady) {
        const channel = client.channels.cache.get(channelId)
        await channel.send(`ao->${sender}|${msg}`)
    }
}

async function handleOnMessageCreate(msg) {
    const channelId = msg.channelId
    const username = msg.author.username;
    for (const chatRoom of dcChannel[channelId].linkedAoChatRooms) {
        try {
            console.log('relay dc message to ao chatroom:', chatRoom)
            await message({
                process: relayProcessId,
                tags: [
                    { name: 'Action', value: 'RelayDiscordMessage' },
                    { name: 'ChatRoom', value: chatRoom }
                ],
                signer,
                data: `dc->${username}|${msg.content}`,
            })
        }
        catch (e) {
            console.error('failed to forward dc message', e)
        }
    }
}



module.exports = {
    relayAoMessage
}