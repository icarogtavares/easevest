
const index = (req, res) => {
  res.render('index.html', { page: 'btgame/index.html' })
}

module.exports = {
  index,
}
