const User = require('../users/users-model')

function logger(req, res, next) {
  // DO YOUR MAGIC
  const timeStamp = new Date().toLocaleString()
  const method = req.method
  const url = req.originalURL
  console.log(`[${timeStamp}] [${method}] [${url}]`)
  next()
}

async function validateUserId(req, res, next) {
  // DO YOUR MAGIC
  try {
    const user = await User.getById(req.params.id)
    if (!user) {
      res.status(404).json({
        message: "user not found"
      })
    } else {
      req.user = user
      next()
    }
  } catch (err) {
    res.status(500).json({
      message: 'error'
    })
  }

}

function validateUser(req, res, next) {
  // DO YOUR MAGIC
  const {name} = req.body
  if(!name || !name.trim()) {
    res.status(400).json({
      message: "missing required name field"
    })
  } else {
    req.name= name.trim()
    next()
  }
}

function validatePost(req, res, next) {
  // DO YOUR MAGIC
  const body = req.body
  if (!body.text) {
    res.status(400).json({ message: "missing required text field" })
  } else {
    next()
  }
}
module.exports = {
  logger,
  validateUserId,
  validateUser,
  validatePost,
}
// do not forget to expose these functions to other modules
