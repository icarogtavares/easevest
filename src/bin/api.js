const axios = require('axios')
const config = require('../config/config')

const axiosInstance = axios.create({
  baseURL: config.API_URL,
})

module.exports = axiosInstance
