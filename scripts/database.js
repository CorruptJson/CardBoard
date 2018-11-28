require('dotenv').config()
const fs = require('fs')
const accounts = `./database/accounts.json`

const { Client } = require('pg')


/* Function to run query */
const run_query = async (query, param) => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  })
  await client.connect()
  const res = await client.query(query, param)
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
  const match = await run_query('SELECT username FROM users WHERE username = $1', [username])
  if (match.rows.length === 0) {
    return true
  } else {
    return false
  }
}


/* Returns user object with matching username */
const retrieveUser = async (username) => {
  const match = await run_query('SELECT * FROM users WHERE username = $1', [username])
  if (match.rows.length != 0) {
    return match.rows[0]
  } else {
    return { username: undefined, password: undefined }
  }
}

/* Creates category */
const create_category = async (username, title) => {
  const categories = await retrieve_categories(username)
  console.log(categories.rows.length)
  if (categories.rows.length) {
    const num = categories.rows.slice(-1)[0].category_index + 1
    console.log(num)
    return await run_query(`INSERT INTO category (username, category_title, category_index) VALUES ($1, $2, $3) RETURNING *`, [username, title, num])
  }
  const num = 0
  return await run_query(`INSERT INTO category (username, category_title, category_index) VALUES ($1, $2, $3) RETURNING *`, [username, title, num])
}

/* Returns categories with matching user */
const retrieve_categories = async (username) => {
  return await run_query('SELECT * from category WHERE username = $1 ORDER BY category_index', [username])
}

/* Returns cards with matching user */
const retrieve_cards = async (username) => {
  return await run_query(`SELECT * from card WHERE category_id in (SELECT category_id FROM category WHERE username = $1)`, [username])
}



//create_category(`jason`, `new_test`).then(res => console.log(res.rows[0].category_id))

module.exports = {
  addUser,
  validateUsername,
  retrieveUser,
  run_query,
  retrieve_categories,
  retrieve_cards,
  create_category
}

