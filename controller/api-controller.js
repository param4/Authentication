//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Impoting all required files <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
const libs = require("../libs")
const constants = require('../constants')
const services = require('../services/serve')

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Function Section <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// For Rendering Login Page
const loginPage = (request, response) => {
  /**
   * @function <b>loginPage</b><br>
   * Renders login page
   * @param {object} request
   * @param {object} response
   */
  response.render("loginPage.ejs")
}

// For Rendering Signup page
const signupPage = (request, response) => {
  /**
   * @function <b>signupPage</b><br>
   * Renders signup page
   * @param {object} request
   * @param {object} response
   */
  response.render("signupPage.ejs")
}

// For Sending response when signup successful!
async function signupSuccess(request, response) {
  /**
   * @function <b>signupSuccess</b><br>
   * registers user
   * @param {object} request
   * @param {object} response
   */
  try {
    let hash = await services.createHash(request.body.password)
    let signUp = await services.saveDetails(request.body, hash)
    if (signUp) {
      response.json({
        'statusCode': constants.FLAGS.STATUS_OK,
        'message': constants.MSG.SIGNUP_SUCCESSFUL,
        'data': {}
      })
    }
  } catch (error) {
    response.send(constants.boom.badRequest().output.payload)
  }
}

// For Sending token as response

async function sendToken(request, response) {
  /**
   * @function <b>sendToken</b><br>
   * Generates & sends token
   * @param {object} request
   * @param {object} response
   */
  try {
    let token = await services.generateToken(request.body.email)
    let data = await services.getProfileDetails(request.body.email)
    let bookingData = await services.getBookDetails()
    let arr = []
    for(let i = 0;i<bookingData.length;i++){
      let demoObj = {
        "Booking Id": bookingData[i].book_id,
        "User Id" : bookingData[i].user_id,
        "Name" : bookingData[i].name,
        "Created": bookingData[i].created
      } 
      arr.push(demoObj)
    }
    response.json({
      'statusCode': constants.FLAGS.STATUS_OK,
      'message': constants.MSG.LOGIN_SUCCESSFUL,
      'data': {
        Name : data.name,
        Phone : data.phone_no,
        Email : request.body.email,
        Token : token,
        Booking : arr
      }
    })
  } catch (error) {
    console.log(error);
    
    response.send(constants.boom.badRequest().output.payload)
  }
}

//For showing Profile
async function showProfile(request, response) {
  /**
   * @function <b>showProfile</b><br>
   * Shows profile
   * @param {object} request
   * @param {object} response
   */
  try {
    let profileData = await services.getProfileDetails(request.query.email)
    response.json({
      'statusCode': constants.FLAGS.STATUS_OK,
      'message': constants.MSG.LOGIN_SUCCESSFUL,
      'data': {
        'Name': profileData.name,
        'Email': profileData.email,
        'Phone Number': profileData.phone_no,
        'Date of birth': profileData.dob
      }
    })
  } catch (error) {
    response.send(constants.boom.badRequest().output.payload)
  }
}

// For updating profle pic in database
async function updatePicDB(request, response) {
  /**
   * @function <b>updatePicDB</b><br>
   *  Updates Pic in database
   * @param {object} request
   * @param {object} response
   */
  await services.uploadPic(request.files.image)
  let imageLink = '127.0.0.1:3000/upload/' + request.files.image.name
  libs.execUpdate('UPDATE user SET pic=? WHERE email=?', [imageLink, request.query.email])
    .then(() => {
      response.json({
        'statusCode': constants.FLAGS.STATUS_OK,
        'message': constants.MSG.DATABASE_UPDATED,
        'data': {}
      })
    })
    .catch(() => {
      response.send("Error in Datbase updation!!")
    })
}

// For saying bye when user deletes his account..
const delteAcc = (request, response) => {
  /**
   * @function <b>delteAcc</b><br>
   *  Deletes user account
   * @param {object} request
   * @param {object} response
   */
  constants.promise.coroutine(function*() {
    yield services.deleteAccount(request.body.email)
    })().then(() => {
      response.json({
        'statusCode': constants.FLAGS.STATUS_OK,
        'message': constants.MSG.ACC_DELETED,
        'data': {}
      })
    })
    .catch((err) => {
      response.send(constants.boom.badRequest().output.payload)
    })
}

// For sending image link as response
async function showPicLink(request, response) {
  try {
    imageLink = await services.getImageLink(request.query.email)
    response.send(`Image Link: ${imageLink.pic}`)
  } catch (error) {
    response.send(constants.boom.notFound("Link is not present in Database").output.payload)
  }
}

// For Sending temporary token via response
async function genTempToken(request, response) {
  try {
    let result = await services.checkEmail(request.body.email)
    if (result) {
      constants.jwt.sign({
        email: request.body.email
      }, constants.TOKEN_KEY, {
        expiresIn: 300
      }, (err, tokken) => {
        if (err) {
          response.send(constants.boom.badData("Error in token generation").output.payload)
        } else {
          response.json({
            'statusCode': constants.FLAGS.STATUS_OK,
            'message': constants.MSG.TOKEN_GENERATED,
            'data': {
              'Token': tokken,
              'Valid For': '5 min'
            }
          })
        }
      })
    } else {
      response.send(constants.boom.badData("Email is not registered").output.payload)
    }
  } catch (error) {
    response.send(constants.boom.badRequest().output.payload)
  }

}

// For Sending msg when user sucessfully reset password..
async function resetPassword(request, response) {
  try {
    let result = await services.saveHash(request.body.email, request.body.password)
    response.json({
      'statusCode': constants.FLAGS.STATUS_OK,
      'message': constants.MSG.PASSWORD_RESET,
      'data': {}
    })
  } catch (error) {
    response.send(constants.boom.badRequest().output.payload)

  }
}

// For Showing response when user removes pic succesfully
async function removePic(request, response) {
  try {
    await services.removePicHelper(request.body.email)
    response.json({
      'statusCode': constants.FLAGS.STATUS_OK,
      'message': constants.MSG.IMAGE_REMOVED,
      'data': {}
    })
  } catch (error) {
    response.send(constants.boom.badRequest().output.payload)
  }
}


module.exports ={
  signupSuccess,
  sendToken,
  showProfile,
  updatePicDB,
  showPicLink,
  removePic,
  genTempToken,
  resetPassword,
  delteAcc,
  loginPage,
  signupPage,
}