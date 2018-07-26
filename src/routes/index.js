const express = require('express')
const axiosInstance = require('../bin/api')

const router = express.Router()

async function restrict (req, res, next) {
  try {
    if (!req.session.matricula || !req.session.token) {
      throw new Error('Usuário não está logado!')
    }
    await axiosInstance.get('/login', {
      headers: {
        Authorization: `JWT ${req.session.token}`,
      },
    })
    return next()
  } catch (err) {
    req.session.error = 'Access denied!'
    return res.redirect('/login')
  }
}

router.post('/login', async (req, res, next) => {
  try {
    const result = await axiosInstance.post('/login', req.body)
    if (result.data.token) {
      req.session.regenerate(() => {
        req.session.matricula = req.body.matricula
        req.session.token = result.data.token
        req.session.success = `Authenticated as ${req.body.matricula}`
        res.redirect('back')
      })
    }
  } catch (err) {
    next(err)
  }
})

router.get('/logout', (req, res, next) => {
  req.session.destroy(() => {
    res.redirect('/')
  })
})

router.get('/login', (req, res, next) => {
  res.render('index.html', { page: 'login/index.html' })
})

router.get('/', restrict, (req, res, next) => {
  res.render('index.html', { page: 'index/index.html' })
})

module.exports = router
