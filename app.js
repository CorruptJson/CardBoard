const express = require('express')
const auth = require('./scripts/auth.js')

//var session

var app = express()

app.use(express.static(__dirname + '/public'))


/*  IGNORE FOR NOW
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
})


app.post('/login', (req, res) => {
  console.log(req)
  res.sendFile(__dirname + '/views/home.html')
})


app.listen(8080, console.log('Server is up on the port 8080'))

*/

app.listen(8080, console.log('Server is up on the port 8080'))