const { getEnv } = require('../')
const { setKeysPrefix } = require('../../utils/object')
const Joi = require('joi')

let objSchema = {
  ASSISTANT_USERNAME: Joi.string().disallow(['<assistant_username>']).required(),
  ASSISTANT_PASSWORD: Joi.string().disallow(['<assistant_password>']).required(),
  WORKSPACE_ID: Joi.string().disallow(['<workspace_id>']).required(),
}

if (getEnv() === 'test') {
  objSchema = setKeysPrefix('TEST_', objSchema)
}

const schema = Joi.object(objSchema).unknown().required()

module.exports = schema
