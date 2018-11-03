const bcrypt = require('bcrypt');
const database = require('./database.js')

const saltRounds = 12



const signup = async (username, password) => {
  var hashedPass = await generateHash(password)
  if (await database.validateUsername(username)) {
    if (await validateNewPass(password)) {
      database.addUser(username, await generateHash(password))
    } else {
      throw 'Password must be at least 8 characters'
    }
  } else {
    throw 'Username already in use'
  }
}

const login = async (username, password) => {
  var auth = await validateUser(username, password)
  if (auth) {
    return username
  }
}

const validateNewPass = async (password) => {
  if (password.length < 8) {
    return false
  } else {
    return true
  }
}


const validateUser = async (username, password) => {
  var cred = await database.retrieveUser(username)
  if ((validatePass(cred.password, password)) && (username == cred.username)) {
    return true
  } else {
    return false
  }
}

const generateHash = async (password) => {
  const hashedPass = await new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) reject(err)
      resolve(hash)
    })
  })
  return hashedPass
}

const validatePass = async (password_input, password) => {
  const passAuth = await new Promise((resolve, reject) => {
    bcrypt.compare(password_input, password, (err, hash) => {
      if (err) reject(err)
      resolve(hash)
    })
  })
  return passAuth
}

module.exports = {
  login,
  signup
}