import jwt from 'jsonwebtoken'
import async from 'async'

const config = rootRequire('config')

module.exports = {
  login: (req, res) => {
    async.waterfall([
      (nextCall) => {
        req.checkBody('email', 'Email is required').notEmpty();
        req.checkBody('email', 'Email is not a valid').isEmail();
        req.checkBody('password', 'Password is required').notEmpty();
        var error = req.validationErrors();
        if (error && error.length) {
          return nextCall({
            message: error[0].msg
          })
        }
        nextCall(null, req.body)
      },
      (body, nextCall) => {
        var jwtData = {
          _id: 1,
          email: body.email
        }

        // create a token
        body.access_token = jwt.sign(jwtData, config.secret, {
          expiresIn: 60 * 60 * 24 // expires in 24 hours
        })

        nextCall(null, body)
      },
      (body, nextCall) => {
        // return the information including token as JSON
        nextCall(null, {
          status: 1,
          message: 'Login successfully',
          data: body
        })
      }
    ], (err, response) => {
      if (err) {
        return res.sendToEncode({
          status: 0,
          message: (err && err.message) || 'Oops! You could not be logged in.'
        })
      }

      res.sendToEncode(response)
    })
  },

  test: (req, res) => {
    res.sendToEncode({
      status: 1,
      message: 'TEST MESSAGE',
      data: {
        message: 'test'
      }
    })
  }
}
