//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Impoting all required files <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
const constants = require('./constants')


//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Function section <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
module.exports.execQuery = (query, param = []) => {
  /**
   * @function <b>execQuery</b><br>
   *  Deletes user account
   * @param {string} query
   * @param {array} param
   */
  return new Promise((resolve, reject) => { // Returns Promise    
    constants.CONNECTION.query(query, param, (err, rows) => { // Quering database here with a callback
      if (err) {
        console.log(err);
        reject(err)
      } else {
        resolve(rows) // Resolving row-set
      }
    })
  })
}

module.exports.execUpdate = (query, param = []) => {
  /**
   * @function <b>execUpdate</b><br>
   *  Deletes user account
   * @param {string} query
   * @param {array} param
   */
  return new Promise((resolve, reject) => { // Returns Promise
    constants.CONNECTION.query(query, param, (err) => { // Quering database here with a callback
      if (err)
        reject(err);
      resolve(true)
    })
  })
}