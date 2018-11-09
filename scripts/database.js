require('dotenv').config()
const fs = require('fs')
const accounts = `./database/accounts.json`

const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
})

client.connect()

/* Function to run query */
const run_query = (query) => {
  return new Promise((resolve, reject) => {
    client.query(query, (err, res) => {
      if (err) reject(err)
      resolve(res.rows)
      client.end();
    })
  })
}


/* Checks if json file exists. No longer necessary after database implementation */
const scanFile = (filename) => {
  if (fs.existsSync(filename)) {
    var file = JSON.parse(fs.readFileSync(filename))
  } else {
    var file = []
  }
  return file
}

/* Adds user to database */
const addUser = (username, password) => {
  var file = scanFile(accounts)
  newAcc = {
    'username': username,
    'password': password
  }
  file.push(newAcc)
  fs.writeFileSync(accounts, JSON.stringify(file))
}

/* Checks if username exists in the database.
** Return true if username is not in use, and return false if username is already used*/
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

/* Returns user object with matching username */
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


// Old garbage. Pls ignore
/*
var queryString =
  `CREATE TABLE users (
    username VARCHAR(16) PRIMARY KEY,
    password CHAR(60) NOT NULL
  );`

var queryString2 = `SELECT * FROM users;`

var queryString3 = `INSERT INTO users (username, password) VALUES ('${username}', '${hashedpassword}');`

var testQuery = async () => {
  console.log(await run_query('SELECT * FROM users'))
}

testQuery()
*/
