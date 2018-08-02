const { axiosInstance, getHeaderWithAuth } = require('../../bin/api')

const index = async (req, res, next) => {
  res.locals.homepage = false
  res.locals.btgame = false
  res.locals.seusTestes = false
  if (req.session.role !== 'admin') {
    return next(new Error('Não autorizado!'))
  }
  try {
    const headers = getHeaderWithAuth(req.session.token)
    const result = await axiosInstance.get(`/admins`, { // eslint-disable-line
      headers,
    })
    if (result && result.data && result.data.docs) {
      return res.render('index.html', { page: 'admin/administradores/index.html', admins: result.data.docs })
    }
    throw new Error('Não foi possível recuperar os admins')
  } catch (err) {
    return next(err)
  }
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
    const result = await axiosInstance.get(`/admins/${req.params.adminId}`, { // eslint-disable-line
      headers,
    })
    if (result && result.data) {
      return res.render('index.html', { page: 'admin/administradores/view.html', admin: result.data })
    }
    throw new Error('Não foi possível recuperar o admin')
  } catch (err) {
    return next(err)
  }
}

module.exports = {
  index,
  view,
}
