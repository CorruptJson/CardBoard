require('dotenv').config()
const fs = require('fs')
const accounts = `./database/accounts.json`

const { Client } = require('pg');


/* Function to run query */
const run_query = async (query, param) => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  })
  await client.connect()
  res = await client.query(query, param)
  await client.end()
  return res
}


/* Adds user to database */
const addUser = async (username, password) => {
  return await run_query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, password])
}


/* Checks if username exists in the database.
** Return true if username is not in use, and return false if username is already used*/
const validateUsername = async (username) => {
  match = await run_query('SELECT username FROM users WHERE username = $1', [username])
  if (match.rows.length === 0) {
    return true
  } else {
    return false
  }
}


/* Returns user object with matching username */
const retrieveUser = async (username) => {
  match = await run_query('SELECT * FROM users WHERE username = $1', [username])
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

