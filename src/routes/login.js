const express = require('express')
const { login, logout, authLogin } = require('../controllers/login')

const router = express.Router()

router.route('/login')
  .get(login)
  .post(authLogin)

router.route('/logout')
  .get(logout)

module.exports = router
