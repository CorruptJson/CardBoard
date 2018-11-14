const express = require('express')
const auth = require('./scripts/auth.js')
const hbs = require('hbs')
const bodyParser = require('body-parser')

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


app.post('/login', (request, response) => {
  response.send(request.body)
})



app.listen(8080, console.log('Server is up on the port 8080'))
