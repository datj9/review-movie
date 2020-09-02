const router = require('express').Router()
const movieController = require('./controller')

router.get('/',movieController.getMovies)
router.post('/',movieController.createMovie)

module.exports = router