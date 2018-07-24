/**
 * Updates the response text using the intent confidence
 * @param  {Object} input The request to the Assistant service
 * @param  {Object} response The response from the Assistant service
 * @return {Object}          The response with the updated message
 */
const updateMessage = (input, response) => {
  let responseText = null
  if (!response.output) {
    response.output = {}
  } else {
    return response
  }
  if (response.intents && response.intents[0]) {
    const intent = response.intents[0]
    if (intent.confidence >= 0.75) {
      responseText = `I understood your intent was ${intent.intent}`
    } else if (intent.confidence >= 0.5) {
      responseText = `I think your intent was ${intent.intent}`
    } else {
      responseText = 'I did not understand your intent'
    }
  }
  response.output.text = responseText
  return response
}

module.exports = {
  updateMessage,
}
