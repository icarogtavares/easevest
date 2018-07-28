const axiosInstance = require('../bin/api')

const index = async (req, res, next) => {
  try {
    const result = await axiosInstance.get(`/alunos/${req.session.matricula}/games`, {
      headers: {
        Authorization: `JWT ${req.session.token}`,
      },
    })
    return res.render('index.html', { page: 'btgame/index.html', games: result.data.docs })
  } catch (err) {
    return next(err)
  }
}

module.exports = {
  index,
}
