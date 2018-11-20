const db = require('./database.js')
//const signup = async (username, password, passwordConfirm) => {
//  const hashedPass = await generateHash(password)
//  const usernameValidation = await db.validateUsername(username)
//  if (!usernameValidation) {
//    throw `${username} already in use`
//  } else if (password != passwordConfirm) {
//    throw `Passwords do not match`
//  } else if (password.length < 8) {
//    throw 'Password must be at least 8 characters'
//  } else {
//    db.addUser(username, hashedPass)
//    return `${username}'s account added!`
//  }
//}

const create_category = () => {
  console.log('done')
}
