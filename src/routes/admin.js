const express = require('express')
const { index } = require('../controllers/admin')
const alunoRoutes = require('./admin/alunos')
const administradoresRoutes = require('./admin/administradores')

const router = express.Router()

router.route('/')
  .get(index)

router.use('/alunos', alunoRoutes)
router.use('/administradores', administradoresRoutes)

module.exports = router
