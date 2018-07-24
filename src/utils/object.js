const setKeysPrefix = (prefix, object) =>
  Object.keys(object).reduce((result, key) => {
    if (key !== 'element_') {
      result[prefix + key] = object[key] // eslint-disable-line no-param-reassign
    }
    return result
  }, {})

module.exports = {
  setKeysPrefix,
}
