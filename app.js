const express = require('express')
const auth = require('./scripts/auth.js')

var session = 4

var app = express()

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
})


app.post('/login', (req, res) => {
  console.log(req)
  res.sendFile(__dirname + '/views/home.html')
})


app.listen(8080, console.log('Server is up on the port 8080'));




