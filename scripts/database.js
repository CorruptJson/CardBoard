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

      resolve(res)
    })
  })
}


/* Adds user to database */
const addUser = async (username, password) => {
  return await run_query(`INSERT INTO users (username, password) VALUES ('${username}', '${password}');`)
}


/* Checks if username exists in the database.
** Return true if username is not in use, and return false if username is already used*/
const validateUsername = async (username) => {
  match = await run_query(`SELECT username FROM users WHERE username = '${username}';`)
  if (match.rows.length === 0) {
    return true
  } else {
    return false
  }
}


/* Returns user object with matching username */
const retrieveUser = async (username) => {
  match = await run_query(`SELECT * FROM users WHERE username = '${username}';`)
  if (match.rows.length != 0) {
    return match.rows[0]
  } else {
    return { username: '', password: '' }
  }
}


module.exports = {
  addUser,
  validateUsername,
  retrieveUser
}

