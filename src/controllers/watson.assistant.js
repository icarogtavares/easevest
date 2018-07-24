const { assistant, workspaceId } = require('../bin/watson.assistant')
const { updateMessage } = require('../services/watson.assistant')

const message = (req, res) => {
  const payload = {
    workspace_id: workspaceId,
    context: req.body.context || {},
    input: req.body.input || {},
  }

  return assistant.message(payload, (err, data) => {
    if (err) {
      return res.status(err.code || 500).json(err)
    }
    return res.json(updateMessage(payload, data))
  })
}

module.exports = {
  message,
}
