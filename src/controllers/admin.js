const { axiosInstance, getHeaderWithAuth } = require('../bin/api')
const { contains, sort } = require('ramda')
const gameStages = require('../models/GameStages')
const GameStagesEnum = require('../models/GameStagesEnum')

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

const resultados = async (req, res, next) => {
  res.locals.homepage = false
  res.locals.btgame = false
  res.locals.seusTestes = false
  if (req.session.role !== 'admin') {
    return next(new Error('Não autorizado!'))
  }
  try {
    const headers = getHeaderWithAuth(req.session.token)
    const gameId = 'teslamodel'
    const gameOficialResult = await axiosInstance.get(`/btgames/${gameId}`, {
      headers,
    })
    const alunosGamesResult = await axiosInstance.post('/alunos/games/query', {
      selector: { finalizado: true },
    }, {
      headers,
    })
    const gameOficial = gameOficialResult.data
    const alunosGames = alunosGamesResult.data.docs
    const resultadoGeral = []
    alunosGames.forEach((game, i) => {
      const gameResult = {}
      let totalAcertos = 0
      let totalPossibilidades = 0
      gameStages.forEach((stage) => {
        let acertos = 0
        gameOficial[stage].forEach((answer) => {
          if (contains(answer.id.toString(), game[stage].respostas)) {
            acertos += answer.correta ? 1 : 0
          }
        })
        gameResult[stage] = {}
        gameResult[stage].acertos = acertos
        gameResult[stage].possibilidades = game[stage].respostas.length
        totalAcertos += acertos
        totalPossibilidades += gameResult[stage].possibilidades
      })
      gameResult.alunoMatricula = game.aluno_matricula
      gameResult.acertos = totalAcertos
      gameResult.possibilidades = totalPossibilidades
      resultadoGeral[i] = gameResult
    })
    const classificacao = (a, b) => b.acertos - a.acertos
    const resultadoGeralOrdenado = sort(classificacao, resultadoGeral)
    return res.render('index.html', {
      page: 'admin/resultados.html',
      game: gameOficial,
      resultados: resultadoGeralOrdenado,
      gameStages,
      GameStagesEnum,
    })
  } catch (err) {
    return next(err)
  }
}

module.exports = {
  index,
  view,
  getEdit,
  postEdit,
  create,
  destroy,
  resultados,
}
