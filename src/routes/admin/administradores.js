const express = require('express')
const { index, view } = require('../../controllers/admin/administradores')

const router = express.Router()

router.route('/')
  .get(index)

router.route('/:adminId')
  .get(view)

module.exports = router
