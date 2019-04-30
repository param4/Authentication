//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Impoting all required files <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
const express = require('express')
const bodyParser = require('body-parser')
const controller = require('./controller/api-controller.js')
const validator = require('./validators/api-validator.js')
const constants = require('./constants')
const upload = require('express-fileupload')
const swaggerUi = require('swagger-ui-express'); 
const swaggerDocument = require('./swagger.json');
const request = require('request')

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Using all required Middlewares <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
const APP = express()

// For Uploading & viewing files
APP.use(upload())
APP.use('/upload', express.static('upload'))

// For parsing body data
APP.use(bodyParser.json())
APP.use(bodyParser.urlencoded({
  extended: true
}))

// For Setting Template Engine & using static files
APP.set("template-engine", "ejs")
APP.use("/css", express.static('css'))

APP.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))


//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Routes & API calls <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
/**
 * @api <b>/login</b><br>
 * Renders Login Page
 */
APP.get('/login', controller.loginPage)

/**
 * @api <b>/signup-get</b><br>
 * Renders Signup page
 */
APP.get('/signup', controller.signupPage)

/**
 * @api <b>/getToken</b><br>
 * Validates,verifies data & generates a token
 * @param {string} fName - body
 * @param {string} lName - body
 * @param {string} email - body
 * @param {string} password - body
 * @param {number} phone_no - body
 * @param {date} dob - body
 */
APP.post('/getToken', validator.validateLoginData, validator.verifyCredentials, controller.sendToken)

/**
 * @api <b>/signup-post</b></br>
 * validates data & stores to the database
 * @param {string} email - body
 * @param {string} password - body
 */
APP.post('/signup', validator.validateSignupData, controller.signupSuccess)

/**
 * @api <b>/profile</b></br>
 * sends back basic profile details of user
 * @param {string} token - query
 */
APP.get('/profile', validator.verifyLogin, controller.showProfile)

/**
 * @api <b>/uploadProfilePic</b></br>
 * Validates image,token & stores to databse
 * @param {string} token - query
 * @param {file} image - body
 */
APP.post('/uploadProfilePic', validator.validateImage, validator.verifyLogin, controller.updatePicDB)

/**
 * @api <b>/viewPic</b></br>
 * Gives an image link where image is present
 * @param {string} token - query
 */
APP.get('/viewPic', validator.verifyLogin, controller.showPicLink)

/**
 * @api <b>/removePic</b></br>
 * Delete pic from database
 * @param {string} token - body
 */
APP.delete('/removePic', validator.verifyTokenBody, controller.removePic)

/**
 * @api <b>/forgetPassword</b></br>
 * Generates a 5-min token for reseting password
 * @param {string} email - body
 */
APP.post('/forgetPassword', validator.validateFogetPwdData, controller.genTempToken)

/**
 * @api <b>/resetPassword</b></br>
 * Validates token & saves newly provided password
 * @param {string} token - body
 * @param {string} password - body
 * @param {string} confirm_password - body
 */
APP.post('/resetPassword', validator.validateResetData, validator.verifyTokenBody, controller.resetPassword)

/**
 * @api <b>/deleteAccount</b></br>
 * Deletes account from database
 * @param {string} token - body
 */
APP.delete('/deleteAccount', validator.verifyTokenBody, controller.delteAcc)


//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Starting Server & Dataabse  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

APP.listen(3000, () => {
  constants.CONNECTION.connect((err) => {
    if (err) {
      throw err
    } else {
      console.log("Congrats.. You're Connected!");
      request('https://socket-chat-free.herokuapp.com',(err,response,body)=>{
        if (err) {
          console.log(err);
          
        } else {
          console.log(">>>>>>>>>>>>RESPONSE>>>>>>>>>>>>>>>>>>",response);
          console.log(">>>>>>>>>>>>BODY>>>>>>>>>>>>>",body)
          
        }
      })

    }
  })
})