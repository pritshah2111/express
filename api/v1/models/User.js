import mongoose from 'mongoose'
import moment from '../../../utils/moment'

const Schema = mongoose.Schema
const connection = require('../db/connection')
const ED = rootRequire('utils/encry_decry')

var schema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  first_name: {
    type: String,
    default: ''
  },
  last_name: {
    type: String,
    default: ''
  },
  updated_at: {
    type: Date,
    default: moment.unix() * 1000
  },
  created_at: {
    type: Date,
    default: moment.unix() * 1000
  }
}, {
  collection: 'tbl_users'
})

schema.pre('save', (next) => {
  var user = this
  if (!user.fbid) {
    user.password = ED.encrypt(user.password);
  }
  user.created_at = user.updated_at = moment.unix() * 1000
  next()
})

schema.pre('update', (next) => {
  this.update({}, {
    $set: {
      updated_at: moment.unix() * 1000
    }
  })
  next()
})

schema.methods.comparePassword = (candidatePassword, cb) => {
  var match = false
  candidatePassword = ED.encrypt(candidatePassword);

  if (candidatePassword === this.password) {
    match = true
  }
  cb(match)
}

module.exports = connection.model(schema.options.collection, schema)
