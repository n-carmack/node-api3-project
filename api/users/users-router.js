const express = require('express');

const router = express.Router();

const User = require('./users-model')
const Post = require('../posts/posts-model')

const {
  validateUserId,
  validateUser,
  validatePost,
} = require('../middleware/middleware')

router.get('/', (req, res, next) => {
  User.get()
    .then(users => {
      res.status(200).json(users)
    })
    .catch(next)
});

router.get('/:id', validateUserId, (req, res) => {
  res.status(200).json(req.user)
});

router.post('/', validateUser, (req, res, next) => {
  User.insert({name: req.name})
    .then(newUser =>{
      res.status(201).json(newUser)
    })
    .catch(next)
});

router.put('/:id', validateUserId, validateUser, async (req, res, next) => {


  User.update(req.params.id, {name: req.name})
    .then(() => {
      return User.getById(req.params.id)
    })
    .then(user => {
      res.json(user)
    })
    .catch(next)
});

router.delete('/:id', validateUserId, async (req, res, next) => {
  try {
    await User.remove(req.params.id)
    res.json(req.user)
  } catch (err) {
    next(err)
  }
});

router.get('/:id/posts', validateUserId, async (req, res, next) => {
  try {
    const result = await User.getUserPosts(req.params.id)
    res.json(result)
  } catch (err) {
    next(err)
  }
});

router.post('/:id/posts', [validateUserId, validatePost], (req, res) => {

  const { id } = req.params
  const body = req.body
  Post.insert({ ...body, user_id: id })
    .then(post => {
      console.log('adding post...')
      res.status(201).json(post)
    })
});

router.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    customMessage: 'something tragic inside posts router happenned',
    message: err.message,
    stack: err.stack,
  })
})

module.exports = router;