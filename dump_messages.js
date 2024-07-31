const fs = require('node:fs/promises')

;(async () => {
  const channels = (await fs.readdir('package/messages')).filter((channel) => channel !== 'index.json')

  const messageList = []

  for (const channel of channels) {
    const messages = JSON.parse(await fs.readFile(`package/messages/${channel}/messages.json`))
    messages.forEach((message) => {
      messageList.push({
        text: message.Contents,
        createdAt: message.Timestamp,
      })
    })
  }

  await fs.writeFile('dump_messages.json', JSON.stringify(messageList))
})()
