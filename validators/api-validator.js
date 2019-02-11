//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Impoting all required files <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
const CONSTANTS = require('../constants')
const controller = require('../controller/api-controller')


//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Function definition section <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// For validating login data with joi
const validateLoginData = (request, response, next) => {
  /**
   * @function <b>validateLoginData</b><br>
   *  Validates login data
   * @param {object} request
   * @param {object} response
   * @param {function} next  
   */
  CONSTANTS.joi.validate(request.body, CONSTANTS.SCHEMA_FOR_LOGIN, (err, data) => {
    if (err) {
      response.send(CONSTANTS.boom.badData(err.details[0].message).output.payload)
    } else {
      next()
    }
  })
}

//For validatng signup data with joi
const validateSignupData = (request, response, next) => {
  /**
   * @function <b>validateSignupData</b><br>
   *  Validates signup data
   * @param {object} request
   * @param {object} response
   * @param {function} next  
   */
  CONSTANTS.joi.validate(request.body, CONSTANTS.SCHEMA_FOR_SIGNUP, (err, data) => {
    if (err) {
      response.send(CONSTANTS.boom.badData(err.details[0].message).output.payload)
    } else {
      next()
    }
  })
}

// For Validating Forget Password Data
const validateFogetPwdData = (request, response, next) => {
  /**
   * @function <b>validateFogetPwdData</b><br>
   *  Validates Forget password data
   * @param {object} request
   * @param {object} response
   * @param {function} next  
   */
  CONSTANTS.joi.validate(request.body, CONSTANTS.SCHEMA_FOR_FORGET, (err, data) => {
    if (err) {
      response.send(CONSTANTS.boom.badData(err.details[0].message).output.payload)
    } else {
      next()
    }
  })
}

// For validating image
const validateImage = (request, response, next) => {
  /**
   * @function <b>validateImage</b><br>
   *  Validates image
   * @param {object} request
   * @param {object} response
   * @param {function} next  
   */
  let extension = request.files.image.name.split('.').pop().toLowerCase()
  if (extension === 'jpg' || extension === 'jpeg' || extension === 'png' || extension === 'bmp') { // Validating extentions of images
    next()
  } else {
    response.send(CONSTANTS.boom.unsupportedMediaType("Please Enter jpg/png/bmp/jpeg").output.payload)
  }
}

// For validating Reset password data
const validateResetData = (request, response, next) => {
  /**
   * @function <b>validateResetData</b><br>
   *  Validates reset password data
   * @param {object} request
   * @param {object} response
   * @param {function} next  
   */
  if (request.body.password === request.body.confirm_password) {
    CONSTANTS.joi.validate(request.body, CONSTANTS.SCHEMA_FOR_RESET, (err, result) => { //Validating data using joi
      if (err) {
        response.send(CONSTANTS.boom.badData().output.payload)
      } else {
        next()
      }
    })
  } else {
    response.send(CONSTANTS.boom.unauthorized("Password didn't match!!").output.payload)
  }
}
// For verifying email & password
const verifyCredentials = (request, response, next) => {
  /**
   * @function <b>verifyCredentials</b><br>
   *  Verifies credentials
   * @param {object} request
   * @param {object} response
   * @param {function} next  
   */
  CONSTANTS.CONNECTION.query("select * from login where email = '" + request.body.email + "'", (err, rows) => { // Querying database             
    if (err) {
      response.send(CONSTANTS.boom.badRequest("Error in database query!"))
    } else {
      if (rows.length == 0) { // Checking if email matches
        response.send(CONSTANTS.boom.badData(err.details[0].message).output.payload)
      } else {
        CONSTANTS.bcrypt.compare(request.body.password, rows[0].password, (err, result) => { // Checking if hash matches
          if (err) {
            response.send(CONSTANTS.boom.badRequest("Error in hash matching!").output.payload)
          } else if (result) {
            next() // Passing control to next function 
          } else {
            response.send(CONSTANTS.boom.unauthorized("Password didn't match!!").output.payload)
          }
        })
      }

    }
  })
}

// For valdating token given in query 
const verifyLogin = (request, response, next) => {
  /**
   * @function <b>verifyLogin</b><br>
   *  verifies token
   * @param {object} request
   * @param {object} response
   * @param {function} next  
   */
  if (request.query.token) {
    CONSTANTS.jwt.verify(request.query.token, CONSTANTS.TOKEN_KEY, (err, dec) => {
      if (err) {
        response.send(CONSTANTS.boom.badData("Token Error").output.payload)
      } else {
        request.query.email = dec.email
        next()
      }
    })
  } else {
    response.send(CONSTANTS.boom.unauthorized("Please Login first!!").output.payload)
  }
}

// For valdating token given in body 
const verifyTokenBody = (request, response, next) => {
  /**
   * @function <b>verifyTokenBody</b><br>
   *  Verifies token provided in body
   * @param {object} request
   * @param {object} response
   * @param {function} next  
   */
  if (request.body.token) {
    CONSTANTS.jwt.verify(request.body.token, CONSTANTS.TOKEN_KEY, (err, dec) => {
      if (err) {  
        response.send(CONSTANTS.boom.badData("Token Expired!").output.payload)
      } else {
        request.body.email = dec.email
        next()
      }
    })
  } else {
    response.send(CONSTANTS.boom.unauthorized("Please Login first!!").output.payload)
  }
}

module.exports ={
  verifyTokenBody,
  verifyLogin,
  verifyCredentials,
  validateLoginData,
  validateSignupData,
  validateFogetPwdData,
  validateImage, 
  validateResetData,
}