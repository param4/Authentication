//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Impoting all required files <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
const joi = require('joi')
const jwt = require('jsonwebtoken')
const sql = require('mysql')
const boom = require('boom')
const promise = require('bluebird')
const bcrypt = require('bcrypt')

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Defining all Constants <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
const TOKEN_KEY = '!@#$%^&*()'
const SALT_ROUNDS = 12

const SCHEMA_FOR_LOGIN = joi.object().keys({
  email: joi.string().email({
    minDomainAtoms: 2
  }).required(),
  password: joi.string().min(8).max(32).required()
})

const SCHEMA_FOR_SIGNUP = joi.object().keys({
  fName: joi.string().trim().required(),
  lName: joi.string().required(),
  email: joi.string().email({
    minDomainAtoms: 2
  }).required(),
  password: joi.string().min(8).max(32).required(),
  phone_no: joi.number().min(1000000000).max(9999999999).required(),
  dob: joi.date()
})

const SCHEMA_FOR_RESET = joi.object().keys({
  token: joi.optional(),
  password: joi.string().min(8).max(8).required(),
  confirm_password: joi.string().min(8).max(8).required()
})

// Schema for reset password
const SCHEMA_FOR_FORGET = joi.object().keys({
  email: joi.string().email({
    minDomainAtoms: 2
  }).required()
})

// Connection here..
const CONNECTION = sql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'capd1234',
  database: 'auth',
})


//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Exporting Constants <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
exports.CONNECTION = CONNECTION
exports.TOKEN_KEY = TOKEN_KEY
exports.joi = joi
exports.SCHEMA_FOR_LOGIN = SCHEMA_FOR_LOGIN
exports.jwt = jwt
exports.bcrypt = bcrypt
exports.SCHEMA_FOR_SIGNUP = SCHEMA_FOR_SIGNUP
exports.SALT_ROUNDS = SALT_ROUNDS
exports.SCHEMA_FOR_FORGET = SCHEMA_FOR_FORGET
exports.SCHEMA_FOR_RESET = SCHEMA_FOR_RESET
exports.boom = boom
exports.promise = promise
exports.FLAGS = {
  'STATUS_OK': 200
}
exports.MSG = {
  'LOGIN_SUCCESSFUL': "Login Successful",
  'SIGNUP_SUCCESSFUL': "Signup Successful",
  'DATABASE_UPDATED': "Database Updated",
  'IMAGE_REMOVED': "Image removed successfully",
  'TOKEN_GENERATED': "Token generated",
  'PASSWORD_RESET': "Congrats... Your password hash been changed",
  'ACC_DELETED': "Your account deleted successfully"
}