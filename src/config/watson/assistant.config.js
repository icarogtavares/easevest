const { getConfig } = require('../')
const schema = require('./assistant.schema')
const Joi = require('joi')

const { error, value: envVars } = Joi.validate(process.env, schema)
if (error) {
  throw new Error(`Config validation error: ${error.message}`)
}

const config = getConfig({
  production: {
    username: envVars.ASSISTANT_USERNAME,
    password: envVars.ASSISTANT_PASSWORD,
    workspaceId: envVars.WORKSPACE_ID,
  },
  development: {
    username: envVars.ASSISTANT_USERNAME,
    password: envVars.ASSISTANT_PASSWORD,
    workspaceId: envVars.WORKSPACE_ID,
  },
  test: {
    username: envVars.TEST_ASSISTANT_USERNAME,
    password: envVars.TEST_ASSISTANT_PASSWORD,
    workspaceId: envVars.TEST_WORKSPACE_ID,
  },
})

module.exports = config
