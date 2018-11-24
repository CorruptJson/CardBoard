const bcrypt = require('bcrypt');
const db = require('./database.js')

const saltRounds = 12



const signup = async (username, password, passwordConfirm) => {
  const hashedPass = await generateHash(password)
  const usernameValidation = await db.validateUsername(username)
  if (!usernameValidation) {
    throw `${username} already in use`
  } else if (password != passwordConfirm) {
    throw `Passwords do not match`
  } else if (password.length < 8) {
    throw 'Password must be at least 8 characters'
  } else {
    db.addUser(username, hashedPass)
    return `${username}'s account added!`
  }
}


/* Checks login credentials. Returns username if valid. Throws error if invalid. */
const login = async (username, password) => {
  var auth = await validateLogin(username, password)
  if (auth) {
    return username
  } else {
    throw 'User name or password not match'
  }
}


/*  Checks username and password and returns boolean */
const validateLogin = async (username, password) => {
  var cred = await db.retrieveUser(username)
  if (username == cred.username) {
    var passValidation = await validatePass(password, cred.password)
    if (passValidation) {
      return true
    }
  }

  return false
}


/*  Returns checks password hash and returns boolean */
const validatePass = async (password_input, password) => {
  const passAuth = await new Promise((resolve, reject) => {
    bcrypt.compare(password_input, password, (err, hash) => {
      if (err) reject(err)
      resolve(hash)
    })
  })
  return passAuth
}

/* Uses bcrypt to return a salted hash */
const generateHash = async (password) => {
  const hashedPass = await new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) reject(err)
      resolve(hash)
    })
  })
  return hashedPass
}



module.exports = {
  login,
  signup
}
