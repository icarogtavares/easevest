const express = require('express')
const { index } = require('../../controllers/admin/administradores')

const router = express.Router()

router.route('/')
  .get(index)

module.exports = router
