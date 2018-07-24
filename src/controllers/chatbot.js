const chatbot = (req, res) => {
  res.render('chatbot.html', { absoluteUrl: req.absoluteUrl })
}

module.exports = {
  chatbot,
}
