const axiosInstance = require('../bin/api')

const authLogin = async (req, res, next) => {
  try {
    const result = await axiosInstance.post('/login', req.body)
    if (result.status !== 200 || !result.data.token) throw new Error('Token Error')
    if (result.data.token) {
      req.session.regenerate(() => {
        req.session.matricula = req.body.matricula
        req.session.token = result.data.token
        req.session.success = `Authenticated as ${req.body.matricula}`
        res.redirect('/')
      })
    }
  } catch (e) {
    const err = new Error('Token Error!')
    err.status = 401
    req.session.error = 'Matrícula ou senha inválidos!'
    next(err)
  }
}

const logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/')
  })
}

const login = (req, res) => {
  res.render('index.html', { page: 'login/index.html' })
}

async function restrict (req, res, next) {
  if (process.env.NODE_ENV === 'development') {
    return next()
  }
  try {
    if (!req.session.matricula || !req.session.token) throw new Error('Usuário não está logado!')
    const result = await axiosInstance.get('/login', {
      headers: {
        Authorization: `JWT ${req.session.token}`,
      },
    })
    if (result.status === 200) return next()
    throw new Error('Token inválido!')
  } catch (err) {
    req.session.error = err.message || 'Acesso negado!'
    return res.redirect('/login')
  }
}

module.exports = {
  login,
  logout,
  authLogin,
  restrict,
}
