const { results } = require('@permaweb/aoconnect');
const fs = require('fs');
const { relayAoMessage } = require('./poll-and-relay-dc-message')
const { aoChatRoom, relayProcessId, dcChannel } = require('./setting')
const cursorsFileName = 'ao-cursors.json'
const cursors = readCursorsFromFile()

function readCursorsFromFile() {
    if (fs.existsSync(cursorsFileName)) {
        const data = fs.readFileSync(cursorsFileName).toString()
        return JSON.parse(data)
    }
    return {}
}

function saveCursorsToFile() {
    fs.writeFileSync(cursorsFileName, JSON.stringify(cursors))
}

async function pollAndRelayAoMessage(processId) {
    console.log('polling ao message, processId:', processId)
    try {
        if (!cursors[processId]) {
            console.log('getting the last result')
            const lastResult = await results({
                process: processId,
                sort: 'DESC',
                limit: 1,
            });
            if (!lastResult) {
                return
            }
            cursors[processId] = lastResult.edges[0].cursor;
            // console.log('last result cursors', cursors[processId])
        }

        const otherResults = await results({
            process: processId,
            from: cursors[processId],
            sort: 'DESC',
            limit: 20
        });


        for (const element of otherResults.edges.reverse()) {
            cursors[processId] = element.cursor;
            const messages = element.node.Messages;
            const broadcastMessage = messages.find(m => m.Tags.some(t => t.name === 'Action' && t.value === 'Broadcasted') && m.Tags.some(t => t.name === 'Broadcaster' && t.value !== relayProcessId))
            if (broadcastMessage) {
                const broadcaster = broadcastMessage.Tags.find(t => t.name === 'Broadcaster')?.value
                const nickname = broadcastMessage.Tags.find(t => t.name === 'Nickname')?.value
                for (const channelId of aoChatRoom[processId].linkedDcChannels) {
                    console.log('relay ao message to dc', broadcaster, nickname)
                    await relayAoMessage(channelId, nickname, broadcastMessage.Data)
                }
            }
            else {
                console.log('ignore message')
            }
        }

    }
    catch (error) {
        console.error(error);
    }
    finally {
        setTimeout(() => pollAndRelayAoMessage(processId), 5000);
        saveCursorsToFile()
    }
}

function main() {
    for (const processId of Object.keys(aoChatRoom)) {
        pollAndRelayAoMessage(processId);
    }
}

module.exports = { main }