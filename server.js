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
  console.log(categoryDivs)
  return categoryDivs
}
/*
const createBoardDivs = async (rows) => {
  let categoryDivs = ''
  for (i in rows) {
    categoryDivs += `<div class="categories"
                    data-id=${rows[i].category_id}
                    data-categoryTitle=${rows[i].category_title}
                    data-categoryIndex=${rows[i].category_index}>
                    <div class="cat_title">${rows[i].category_title}</div>`

    const cardsObj = await db.retrieve_cards(rows[i].category_id)
    const cards = cardsObj.rows
    for (i in cards) {
      categoryDivs += `<div data-id=${cards[i].card_id}></div>`
    }

    categoryDivs += `</div>`
  }
  console.log(categoryDivs)
  return categoryDivs
}
 */

/**** Middlewares ***/
app.set('view engine', 'hbs')

hbs.registerPartials(`${__dirname}/views/partials`)

/** Session Middleware */
app.use(session({
  cookieName: 'session',
  secret: sessionSecret,
  duration: sessionDuration,
  activeDuration: sessionActiveDuration,
  httpOnly: true,
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
app.get('/', requireLogin, (request, response) => {
  renderBoard(request, response)
})

app.get('/login', (request, response) => {
  response.render('login.hbs')
})

app.get('/signup', (request, response) => {
  response.render('signup.hbs')
})

app.post('/signup', (request, response) => {
  auth.signup(request.body.username, request.body.password, request.body.passwordConfirm)
    .then(res => response.render('signup.hbs', {
      show: true,
      message: res
    }))
    .catch(err => response.render('signup.hbs', {
      show: true,
      message: err
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


/**** Start Server ***/
app.listen(port, console.log(`Server is up on the port ${port}, with PID: ${process.pid}`))
