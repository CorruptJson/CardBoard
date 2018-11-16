const express = require('express')
const auth = require('./scripts/auth.js')
const hbs = require('hbs')
const bodyParser = require('body-parser')

const port = process.env.PORT || 8080
const app = express()

var session = undefined


app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(bodyParser.json())


app.use(express.static(__dirname + '/public'))



app.get('/', (request, response) => {
  response.render('login.hbs')
})


app.post('/signup', (request, response) => {
  auth.signup(request.body.username, request.body.password, request.body.passwordConfirm)
    .then(res => response.send(res))
    .catch(err => response.send(`Error: ${err}`))
})


app.post('/login', (request, response) => {
  auth.login(request.body.username, request.body.password)
    .then(res => response.send(res))
    .catch(err => response.send(`Error: ${err}`))
})


app.listen(port, console.log(`Server is up on the port ${port}`))
