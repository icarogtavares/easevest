const express = require('express')
const { index } = require('../../controllers/admin/alunos')

const router = express.Router()

router.route('/')
  .get(index)

module.exports = router
