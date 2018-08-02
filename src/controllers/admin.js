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
  const doc = req.body
  try {
    doc.role = doc.role ? 'admin' : 'user'
    const headers = getHeaderWithAuth(req.session.token)
    await axiosInstance.put(`/users/${req.params.userId}`, {
      doc,
    }, {
      headers,
    })
    req.session.msg = `Usuário ${req.body.nome} atualizado com sucesso!`
  } catch (err) {
    req.session.err = err.message || 'Não foi possível atualizar o usuário'
    // return next(err)
  }
  return res.redirect(doc.role === 'admin' ? '/admin/administradores' : '/admin/alunos')
}

const create = async (req, res, next) => {
  res.locals.homepage = false
  res.locals.btgame = false
  res.locals.seusTestes = false
  if (req.session.role !== 'admin') {
    return next(new Error('Não autorizado!'))
  }
  const doc = req.body
  try {
    doc.role = doc.role ? 'admin' : 'user'
    const headers = getHeaderWithAuth(req.session.token)
    await axiosInstance.post('/users', {
      doc,
    }, {
      headers,
    })
    req.session.msg = `Usuário ${req.body.nome} adicionado com sucesso!`
  } catch (err) {
    req.session.err = err.message || 'Não foi possível adicionar o usuário'
    // return next(err)
  }
  return res.redirect(doc.role === 'admin' ? '/admin/administradores' : '/admin/alunos')
}

const destroy = async (req, res, next) => {
  res.locals.homepage = false
  res.locals.btgame = false
  res.locals.seusTestes = false
  if (req.session.role !== 'admin') {
    return next(new Error('Não autorizado!'))
  }
  const doc = req.body
  try {
    const headers = getHeaderWithAuth(req.session.token)
    await axiosInstance.delete('/users', {
      data: doc,
      headers,
    })
    req.session.msg = 'Usuário removido com sucesso!'
  } catch (err) {
    req.session.err = err.message || 'Não foi possível remover o usuário'
    // return next(err)
  }
  return res.redirect(doc.role === 'admin' ? '/admin/administradores' : '/admin/alunos')
}

module.exports = {
  index,
  view,
  getEdit,
  postEdit,
  create,
  destroy,
}
