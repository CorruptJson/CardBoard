const fs = require('fs')
const accounts = `./database/accounts.json`

const scanFile = (filename) => {
  if (fs.existsSync(filename)) {
    var file = JSON.parse(fs.readFileSync(filename))
  } else {
    var file = []
  }
  return file
}


const addUser = (username, password) => {
  var file = scanFile(accounts)
  newAcc = {
    'username': username,
    'password': password
  }
  file.push(newAcc)
  fs.writeFileSync(accounts, JSON.stringify(file))
}


const validateUsername = (username) => {
  var file = scanFile(accounts)
  var match = file.find((user) => {
    return user.username == username
  })
  if (!match) {
    return true
  } else {
    return false
  }
}


const retrieveUser = (username) => {
  var file = scanFile(accounts)
  var match = file.find((user) => {
    return user.username == username
  })
  if (match) {
    return match
  } else {
    return { username: '', password: '' }
  }
}


module.exports = {
  addUser,
  validateUsername,
  retrieveUser
}