const { axiosInstance, getHeaderWithAuth } = require('../bin/api')

const index = async (req, res, next) => {
  res.locals.homepage = false
  res.locals.btgame = false
  res.locals.seusTestes = false
  if (req.session.role === 'admin') {
    return res.render('index.html', { page: 'admin/index.html' })
  }
  return next(new Error('Não autorizado!'))
}

const view = async (req, res, next) => {
  res.locals.homepage = false
  res.locals.btgame = false
  res.locals.seusTestes = false
  if (req.session.role !== 'admin') {
    return next(new Error('Não autorizado!'))
  }
  try {
    const headers = getHeaderWithAuth(req.session.token)
    const result = await axiosInstance.get(`/users/${req.params.userId}`, { // eslint-disable-line
      headers,
    })
    if (result && result.data) {
      return res.render('index.html', { page: 'admin/view.html', reqUser: result.data })
    }
    throw new Error('Não foi possível recuperar o admin')
  } catch (err) {
    return next(err)
  }
}

const getEdit = async (req, res, next) => {
  res.locals.homepage = false
  res.locals.btgame = false
  res.locals.seusTestes = false
  if (req.session.role !== 'admin') {
    return next(new Error('Não autorizado!'))
  }
  try {
    const headers = getHeaderWithAuth(req.session.token)
    const result = await axiosInstance.get(`/users/${req.params.userId}`, { // eslint-disable-line
      headers,
    })
    if (result && result.data) {
      return res.render('index.html', { page: 'admin/edit.html', reqUser: result.data })
    }
    throw new Error('Não foi possível recuperar o admin')
  } catch (err) {
    return next(err)
  }
}

const postEdit = async (req, res, next) => {
  res.locals.homepage = false
  res.locals.btgame = false
  res.locals.seusTestes = false
  if (req.session.role !== 'admin') {
    return next(new Error('Não autorizado!'))
  }
  try {
    const headers = getHeaderWithAuth(req.session.token)
    const result = await axiosInstance.get(`/users/${req.params.userId}`, { // eslint-disable-line
      headers,
    })
    if (result && result.data) {
      return res.render('index.html', { page: 'admin/edit.html', reqUser: result.data })
    }
    throw new Error('Não foi possível recuperar o admin')
  } catch (err) {
    return next(err)
  }
}

module.exports = {
  index,
  view,
  getEdit,
  postEdit,
}
