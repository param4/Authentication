//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Impoting all required files <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
const constants = require('../constants')
const libs = require('../libs')
const async = require('async')

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Function Section <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
const generateToken = (email) => {
  /**
  * @function <b>generateToken</b><br>
  * Generates token
  * @param {string} email
  * @return {Promise}
  */
  return new Promise((resolve, reject) => {
    constants.jwt.sign({
      email: email
    }, constants.TOKEN_KEY, (err, tokken) => {
      if (err) {
        reject(err)
      } else {
        resolve(tokken)
      }
    })
  })
}

const createHash = (password) => {
  /**
  * @function <b>createHash</b><br>
  * Creates hash
  * @param {string} password
  * @return {Promise}
  */
  return new Promise((resolve, reject) => {
    constants.bcrypt.hash(password, constants.SALT_ROUNDS, (err, hash) => {
      if (err) {
        reject(err)
      } else {
        resolve(hash)
      }
    })
  })
}

const saveDetails = (signUpData, hash) => {
  /**
  * @function <b>saveDetails</b><br>
  * Saves details of user
  * @param {object} signUpData
  * @param {string} hash
  * @return {Promise}
  */
  let name = signUpData.fName + " " + signUpData.lName
  return new Promise((resolve, reject) => {
    constants.CONNECTION.query("INSERT INTO user(name,email,password,phone_no,dob) VALUES(?,?,?,?,?)", [name, signUpData.email, hash, signUpData.phone_no, signUpData.dob], (err) => {
      if (err) {
        reject(err)
      } else {
        constants.CONNECTION.query("INSERT INTO login(email,password) VALUES(?,?)", [signUpData.email, hash], (err) => {
          if (err) {
            reject(err)
          } else {
            resolve(true)
          }
        })
      }
    })
  })
}

async function getProfileDetails(email) {
  /**
  * @function <b>getProfileDetails</b><br>
  * get profile details
  * @param {string} email
  * @return {Promise}
  */
  let data = await libs.execQuery('SELECT * FROM user WHERE email=?', [email])
  return data[0]
}

const uploadPic = (img) => {
  /**
  * @function <b>uploadPic</b><br>
  * Uploads profile pic
  * @param {string} img
  * @return {Promise}
  */
  return new Promise((resolve, reject) => {
    img.mv('./upload/' + img.name, (err) => {
      if (err) {
        reject(err)
      } else {
        resolve(true)
      }
    })
  })
}

async function getImageLink(email) {
  /**
  * @function <b>getImageLink</b><br>
  * Gets image link from database
  * @param {string} email
  * @return {Promise}
  */
  let imageLink = await libs.execQuery('SELECT pic FROM user WHERE email=?', [email])
  return imageLink[0]
}

async function deleteAccount(email) {
  /**
  * @function <b>deleteAccount</b><br>
  * Deletes account of user
  * @param {string} email
  * @return {Promise}
  */
  try {
    let result = await libs.execUpdate('DELETE FROM user WHERE email=?', [email])
    return true
  } catch (e) {
    response.send("Error Occured in deleting Account!")
  }
}

async function checkEmail(email) {
  /**
  * @function <b>checkEmail</b><br>
  * Checks whether eamil exist in database 
  * @param {string} email
  * @return {Promise}
  */
  try {
    let result = await libs.execQuery('SELECT * FROM user WHERE email=?', [email])
    if (result.length > 0) {
      return true
    } else {
      return false
    }
  } catch (e) {
    response.send(constants.boom.badRequest("Error Occured in Query!").output.payload)
  }
}

async function removePicHelper(email) {
  /**
  * @function <b>removePicHelper</b><br>
  * Removes pic from database
  * @param {string} email
  * @return {Promise}
  */
  try {
    let result = await libs.execQuery('UPDATE user SET pic=? WHERE email=?', [null, email])
    if (result) {
      return true
    }
  } catch (e) {
    response.send("Error Occured in Query!")
  }
}

async function saveHash(email, password) {
  /**
  * @function <b>saveHash</b><br>
  * Saves Hash to database
  * @param {string} email
  * @param {string} password
  * @return {Promise}
  */
  try {
    let hash = await constants.bcrypt.hash(password, constants.SALT_ROUNDS)
    let result = await libs.execUpdate('UPDATE login SET password=? WHERE email=?', [hash, email])
    return true
  } catch (e) {
    return e
  }
}

async function getBookDetails(){
  try {
    let result = await libs.execQuery('select * from book')
    return result

  } catch (err) {
    return err
  }

}


// async function getName(email){
//   try {
//     let result = await libs.execQuery('sel')
//     return result[0].name  
//   } catch (error) {
//     return(error)
//   }
  

// }
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Exporting Files <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
module.exports = {
  saveHash,
  checkEmail,
  getImageLink,
  generateToken,
  deleteAccount,
  removePicHelper,
  getProfileDetails,
  saveDetails,
  createHash,
  uploadPic,
  getBookDetails
}