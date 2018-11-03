const fs = require('fs')

const scanFile = (filename) => {
  if (fs.existsSync(filename)) {
    var file = JSON.parse(fs.readFileSync(filename))
  } else {
    var file = []
  }
  return file
}


const addUser = async (username, password) => {
  var file = scanFile('accounts.json')
  newAcc = {
    'username': username,
    'password': password
  }
  file.push(newAcc)
  fs.writeFileSync('accounts.json', JSON.stringify(file))
}

const validateUsername = async (username) => {
  var file = scanFile('accounts.json')
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
  var file = scanFile('accounts.json')
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