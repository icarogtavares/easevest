const watson = require('watson-developer-cloud')
const getConfig = require('../config/watson/assistant.config')

const config = getConfig()

const assistant = new watson.AssistantV1({
  username: config.username,
  password: config.password,
  version: '2018-06-13',
})

module.exports = {
  assistant,
  workspaceId: config.workspaceId,
}
