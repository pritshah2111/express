import logger from '../../../utils/logger'
import express from 'express'

const isLoggedInPolicie = require('../policies/isLoggedIn.js')
const isUserAuthenticatedPolicy = require('../policies/isUserAuthenticated.js')
const UserController = require('../controllers/user.js')
const router = express.Router()
const decodeReqPolicy = require('../policies/decodeRequest.js')
const encodeResPolicy = require('../policies/encodeResponse.js')
const AESCrypt = rootRequire('utils/aes')

router.get('/encode', (req, res) => {
  res.render('encode')
})

router.post('/encode', (req, res) => {
  var body = req.body

  logger.info('ENCODE BREQ BODY :->', body);

  try {
    var json = eval('(' + body.data + ')')
    var enc = AESCrypt.encrypt(JSON.stringify(json))
  } catch (e) {
    var enc = 'Invalid parameters'
  }
  res.send({
    'encoded': enc
  })
})

router.get('/decode', (req, res) => {
  res.render('decode')
})

router.post('/decode', (req, res) => {
  var body = req.body

  logger.info('DECODE REQ BODY :->', body)

  try {
    var dec = AESCrypt.decrypt(JSON.stringify(body.data))
  } catch (e) {
    var dec = 'Invalid parameters'
  }
  res.send(dec)
})

// decode request data
router.all('/*', (req, res, next) => {
  res.sendToEncode = (data) => {
    req.resbody = data
    next()
  }
  next()
}, decodeReqPolicy)

/**
 * Users Account & Authentication APIs
 */
router.post('/auth/login', UserController.login)

/**
 * Authentication Middleware (BEFORE)
 * Serve all apis before MIDDLE if they serve like /api/*
 */
router.all('/api/*', isUserAuthenticatedPolicy, isLoggedInPolicie)

/**
 * Other APIs Routes (MIDDLE)
 */
router.get('/auth/test', UserController.test)

/**
 * Responses Middleware (AFTER)
 * Serve all apis after MIDDLE if they serve like /api/*
 */
router.all('/*', encodeResPolicy)

// exports router
module.exports = router
