// const { axiosInstance, getHeaderWithAuth } = require('../bin/api')

const index = async (req, res, next) => {
  res.locals.homepage = false
  res.locals.btgame = false
  res.locals.seusTestes = false
  if (req.session.role === 'admin') {
    return res.render('index.html', { page: 'admin/alunos/index.html' })
  }
  return next(new Error('Não autorizado!'))
}

module.exports = {
  index,
}
