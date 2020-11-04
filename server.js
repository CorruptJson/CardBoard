/**** Node Modules ***/
const express = require('express')
const hbs = require('hbs')
const bodyParser = require('body-parser')
const session = require('client-sessions')


/****  Project scripts ***/
const auth = require('./scripts/auth.js')
const db = require('./scripts/database.js')


/**** Constants ***/
const port = process.env.PORT || 8080
const sessionSecret = process.env.SESSION_SECRET
// Duration values are in milliseconds.
// 30 * 60 * 1000 = 30 Minutes
const sessionDuration = 30 * 60 * 1000
const sessionActiveDuration = 5 * 60 * 1000
const app = express()


/**** Functions ***/
const requireLogin = (request, response, next) => {
  if (!request.user) {
    response.redirect('/login')
  } else {
    next()
  }
}

const renderBoard = (request, response) => {
  createBoardDivs(request.session.user)
    .then(categoryDivs => {
      response.render('index.hbs', {
        user: response.locals.user,
        categories: categoryDivs
      })
    })
}


const createBoardDivs = async (username) => {
  let categoryDivs = []
  let categories = await db.retrieve_categories(username)
  categories = categories.rows
  let cards = await db.retrieve_cards(username)
  cards = cards.rows
  for (i in categories) {
    categoryDivs.push({
      category_id: categories[i].category_id,
      category_title: categories[i].category_title,
      category_index: categories[i].category_index,
      card_list: cards.filter(obj => obj.category_id == categories[i].category_id)
    })
  }
  return categoryDivs
}





/**** Middlewares ***/
app.set('view engine', 'hbs')

hbs.registerPartials(`${__dirname}/views/partials`)

/* Session Middleware */
app.use(session({
  cookieName: 'session',
  secret: sessionSecret,
  duration: sessionDuration,
  activeDuration: sessionActiveDuration,
  secure: true,
}))

/* Bodyparser Middlewares */
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())

/* Middleware to show public files */
app.use(express.static(__dirname + '/public'))

/* Middleware for exposing username to template */
app.use((request, response, next) => {
  if (request.session && request.session.user) { // Check if session exists
    db.retrieveUser(request.session.user).then(user => { // Check Database for user
      if (user.username) { // Username will be undefined if user doesn't exist.
        request.user = user.username
        request.session.user = user.username // refresh session value
        response.locals.user = user.username // expose username to template
      }
      next()
    })
  } else {
    next()
  }
})


/**** HTTP Requests ***/

/*** GET ***/

app.get('/', requireLogin, (request, response) => {
  renderBoard(request, response)
})

app.get('/login', (request, response) => {
  response.render('login.hbs')
})

/*** POST ***/

app.post('/signup', (request, response) => {
  auth.signup(request.body.username, request.body.password, request.body.passwordConfirm)
    .then(res => {
      request.session.user = request.body.username
      response.locals.user = request.body.username
      renderBoard(request, response)
    })
    .catch(err => response.render('login.hbs', {
      show: true,
      message: err,
      signup: true
    }))
})

app.post('/login', (request, response) => {
  auth.login(request.body.username, request.body.password)
    .then(res => {
      request.session.user = res
      response.locals.user = res
      renderBoard(request, response)
    })
    .catch(err => response.render('login.hbs', {
      show: true,
      message: err
    }))
})

app.post('/logout', (request, response) => {
  request.session.reset()
  response.redirect('/')
})

app.post('/createCategory', requireLogin, (request, response) => {
  const username = request.session.user
  db.create_category(username, "New Category")
    .then(res => {
      response.send({
        id: res.rows[0].category_id,
        index: res.rows[0].category_index
      })
    })
    .catch(err => {
      console.error(err)
      response.send(false)
    })
})

app.post('/deleteCategory', requireLogin, (request, response) => {
  const username = request.session.user
  const id = request.body.id
  db.delete_category(username, id)
    .then(res => response.send(true))
    .catch(err => {
      console.error(err)
      response.send(false)
    })
})

app.post('/deleteCard', requireLogin, (request, response) => {
  const username = request.session.user
  const id = request.body.id
  db.delete_card(username, id)
    .then(res => response.send(true))
    .catch(err => {
      console.error(err)
      response.send(false)
    })
})

app.post('/editCategory', requireLogin, (request, response) => {
  const username = request.session.user
  const id = request.body.id
  const text = request.body.text
  db.edit_category(username, id, text)
    .then(res => { response.send(true) })
    .catch(res => { response.send(false) })
})

app.post('/createCard', requireLogin, (request, response) => {
  const username = request.session.user
  const id = request.body.id // id of category
  db.create_card(username, id, "front text here", "back text here")
    .then(res => {
      response.send({
        id: res.rows[0].card_id,
        index: res.rows[0].card_index,
        front: res.rows[0].card_front,
        back: res.rows[0].card_back,
      })
    })
    .catch(err => {
      console.error(err)
      response.send(false)
    })
})

app.post('/editCard', requireLogin, (request, response) => {
  const username = request.session.user
  const id = request.body.id
  const text = request.body.text
  const side = request.body.side
  db.edit_card(username, id, text, side)
    .then(res => { response.send(true) })
    .catch(res => { response.send(false) })
})


/**** Start Server ***/
app.listen(port, console.log(`Server is up on the port ${port}, with PID: ${process.pid}`))
