const axios = require('axios')
const config = require('../config/config')

const axiosInstance = axios.create({
  baseURL: config.API_URL,
})

const getHeaderWithAuth = (token) => {
  const header = { Authorization: `JWT ${token}` }
  return header
}

module.exports = {
  axiosInstance,
  getHeaderWithAuth,
}
